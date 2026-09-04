import { ArrowLeft, CalendarX2, LockKeyhole } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { LoadError } from '@/components/LoadError'
import { PageHeader } from '@/components/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import {
  createBooking,
  getBookingById,
  updateBooking,
} from '@/services/bookingService'
import { getEmployees } from '@/services/employeeService'
import { getRooms } from '@/services/roomService'
import type { Booking } from '@/types/booking'
import type { Employee } from '@/types/employee'
import type { Room } from '@/types/room'
import { isBookingUpcoming } from '@/utils/booking'
import { combineLocalDateAndTime, toDateTimeLocalValue } from '@/utils/date'
import {
  BookingForm,
  type BookingFormValues,
} from '../components/BookingForm'
import { BookingFormLoading } from '../components/BookingFormLoading'

const emptyFormValues: BookingFormValues = {
  date: '',
  description: '',
  employeeId: '',
  endTime: '10:00',
  roomId: '',
  startTime: '09:00',
  title: '',
}

export function BookingFormPage() {
  const { bookingId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isEditing = bookingId !== undefined
  const requestedRoomId = searchParams.get('room') ?? ''
  const [booking, setBooking] = useState<Booking | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [values, setValues] = useState<BookingFormValues>(emptyFormValues)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    let shouldUpdate = true
    const bookingRequest = isEditing
      ? getBookingById(bookingId)
      : Promise.resolve(null)

    Promise.all([bookingRequest, getRooms(), getEmployees()])
      .then(([loadedBooking, loadedRooms, loadedEmployees]) => {
        if (!shouldUpdate) {
          return
        }

        setBooking(loadedBooking)
        setRooms(loadedRooms)
        setEmployees(loadedEmployees)

        if (loadedBooking) {
          setValues({
            date: '',
            description: loadedBooking.description,
            employeeId: loadedBooking.employeeId,
            endTime: toDateTimeLocalValue(loadedBooking.endTime),
            roomId: loadedBooking.roomId,
            startTime: toDateTimeLocalValue(loadedBooking.startTime),
            title: loadedBooking.title,
          })
        } else if (!isEditing) {
          setValues({
            ...emptyFormValues,
            roomId: loadedRooms.some((room) => room.id === requestedRoomId)
              ? requestedRoomId
              : '',
          })
        }
      })
      .catch(() => {
        if (shouldUpdate) {
          setLoadError('Booking form data could not be loaded. Please try again.')
        }
      })
      .finally(() => {
        if (shouldUpdate) {
          setIsLoading(false)
        }
      })

    return () => {
      shouldUpdate = false
    }
  }, [bookingId, isEditing, loadAttempt, requestedRoomId])

  const now = new Date()
  const canEditBooking =
    booking?.status === 'confirmed' && isBookingUpcoming(booking, now)
  const cancelPath = isEditing ? `/bookings/${bookingId}` : '/bookings'

  function retryLoading() {
    setIsLoading(true)
    setLoadError('')
    setLoadAttempt((attempt) => attempt + 1)
  }

  function updateValue(name: keyof BookingFormValues, value: string) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setSubmitError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!values.roomId || !values.employeeId) {
      setSubmitError('Choose a room and an organizer.')
      return
    }

    if (!isEditing && !values.date) {
      setSubmitError('Choose a meeting date.')
      return
    }

    const startValue = isEditing
      ? values.startTime
      : combineLocalDateAndTime(values.date, values.startTime)
    const endValue = isEditing
      ? values.endTime
      : combineLocalDateAndTime(values.date, values.endTime)
    const start = Date.parse(startValue)
    const end = Date.parse(endValue)

    if (Number.isNaN(start) || Number.isNaN(end)) {
      setSubmitError('Choose valid start and end times.')
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const input = {
        description: values.description,
        employeeId: values.employeeId,
        endTime: new Date(end).toISOString(),
        roomId: values.roomId,
        startTime: new Date(start).toISOString(),
        title: values.title,
      }
      const savedBooking =
        isEditing && bookingId
          ? await updateBooking(bookingId, input)
          : await createBooking(input)

      navigate(`/bookings/${savedBooking.id}`)
    } catch (submissionFailure) {
      setSubmitError(
        submissionFailure instanceof Error
          ? submissionFailure.message
          : 'The booking could not be saved.',
      )
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
        <LoadError className="mt-8" message={loadError} onRetry={retryLoading} />
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
