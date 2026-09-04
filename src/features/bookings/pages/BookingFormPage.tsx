import { ArrowLeft, CalendarX2, LockKeyhole } from 'lucide-react'
import { useEffect, useState, type SyntheticEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { LoadError } from '@/components/LoadError'
import { PageHeader } from '@/components/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import { createBooking, updateBooking } from '@/services/bookingService'
import { isBookingUpcoming } from '@/utils/booking'
import { toDateTimeLocalValue } from '@/utils/date'
import { getErrorMessage } from '@/utils/error'
import { BookingForm } from '../components/BookingForm'
import { BookingFormLoading } from '../components/BookingFormLoading'
import { useBookingFormData } from '../hooks/useBookingFormData'
import { useRoomAvailability } from '../hooks/useRoomAvailability'
import type { BookingFormValues } from '../types/bookingForm'
import {
  adjustEndTime,
  bookingToFormValues,
  emptyBookingFormValues,
  formValuesToBookingInput,
} from '../utils/bookingForm'

export function BookingFormPage() {
  const { bookingId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isEditing = bookingId !== undefined
  const requestedRoomId = searchParams.get('room') ?? ''
  const { data, error: loadError, isLoading, retry } = useBookingFormData(bookingId)
  const booking = data?.booking ?? null
  const rooms = data?.rooms ?? []
  const employees = data?.employees ?? []
  const [values, setValues] = useState<BookingFormValues>(emptyBookingFormValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const availabilityStatus = useRoomAvailability(values, isEditing ? bookingId : undefined)

  useDocumentTitle(isEditing ? 'Edit booking' : 'New booking')

  useEffect(() => {
    if (!data) return

    if (data.booking) {
      // Query data initializes an independently editable draft.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues(bookingToFormValues(data.booking))
    } else if (!isEditing) {
      setValues({
        ...emptyBookingFormValues,
        roomId: data.rooms.some((room) => room.id === requestedRoomId)
          ? requestedRoomId
          : '',
      })
    }
  }, [data, isEditing, requestedRoomId])

  const now = new Date()
  const canEditBooking =
    booking?.status === 'confirmed' && isBookingUpcoming(booking, now)
  const cancelPath = isEditing ? `/bookings/${bookingId}` : '/bookings'


  function updateValue(name: keyof BookingFormValues, value: string) {
    setValues((currentValues) => {
      const next = { ...currentValues, [name]: value }

      if (name === 'startTime' && value && next.endTime) {
        next.endTime = adjustEndTime(value, next.endTime)
      }

      return next
    })
    setSubmitError('')
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault()

    if (!values.roomId || !values.employeeId) {
      setSubmitError('Choose a room and an organizer.')
      return
    }

    if (!values.date) {
      setSubmitError('Choose a meeting date.')
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const input = formValuesToBookingInput(values)
      const savedBooking =
        isEditing && bookingId
          ? await updateBooking(bookingId, input)
          : await createBooking(input)

      navigate(`/bookings/${savedBooking.id}`)
    } catch (submissionFailure) {
      setSubmitError(getErrorMessage(submissionFailure, 'The booking could not be saved.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <PageHeader
        actions={
          <Link className={buttonVariants({ variant: 'outline' })} to={cancelPath}>
            <ArrowLeft aria-hidden="true" />
            {isEditing ? 'Booking details' : 'All bookings'}
          </Link>
        }
        description={
          isEditing
            ? 'Change the meeting details, room, organizer, or time.'
            : 'Choose the right room and time for your team.'
        }
        eyebrow={isEditing ? 'Update meeting' : 'Schedule a meeting'}
        title={isEditing ? 'Edit booking' : 'New booking'}
      />

      {isLoading ? (
        <BookingFormLoading />
      ) : loadError ? (
        <LoadError className="mt-8" message={loadError} onRetry={retry} />
      ) : isEditing && !booking ? (
        <EmptyState
          actionLabel="Return to bookings"
          className="mt-8"
          description="The booking may have been removed or the link is incorrect."
          icon={<CalendarX2 aria-hidden="true" size={22} />}
          onAction={() => navigate('/bookings')}
          title="Booking not found"
        />
      ) : isEditing && !canEditBooking ? (
        <EmptyState
          actionLabel="View booking details"
          className="mt-8"
          description="Past and cancelled bookings cannot be changed."
          icon={<LockKeyhole aria-hidden="true" size={22} />}
          onAction={() => navigate(`/bookings/${bookingId}`)}
          title="Booking cannot be edited"
        />
      ) : (
        <BookingForm
          availabilityStatus={availabilityStatus}
          cancelPath={cancelPath}
          employees={employees}
          error={submitError}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          minimumDateTime={toDateTimeLocalValue(now.toISOString())}
          onChange={updateValue}
          onSubmit={handleSubmit}
          rooms={rooms}
          values={values}
        />
      )}
    </section>
  )
}
