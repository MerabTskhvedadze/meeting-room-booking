import { ArrowLeft, CalendarX2, CircleCheck, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { LoadError } from '@/components/LoadError'
import { PageHeader } from '@/components/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import { cancelBooking, getBookingById } from '@/services/bookingService'
import { getEmployees } from '@/services/employeeService'
import { getRooms } from '@/services/roomService'
import type { Booking } from '@/types/booking'
import type { Employee } from '@/types/employee'
import type { Room } from '@/types/room'
import { isBookingUpcoming } from '@/utils/booking'
import { BookingDetailsCard } from '../components/BookingDetailsCard'
import { BookingDetailsLoading } from '../components/BookingDetailsLoading'
import { CancelBookingPanel } from '../components/CancelBookingPanel'

export function BookingDetailsPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [isConfirmingCancellation, setIsConfirmingCancellation] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancellationError, setCancellationError] = useState('')
  const [cancellationSucceeded, setCancellationSucceeded] = useState(false)

  useDocumentTitle(booking?.title ?? 'Booking details')

  useEffect(() => {
    let shouldUpdate = true

    Promise.all([getBookingById(bookingId ?? ''), getRooms(), getEmployees()])
      .then(([loadedBooking, loadedRooms, loadedEmployees]) => {
        if (shouldUpdate) {
          setBooking(loadedBooking)
          setRooms(loadedRooms)
          setEmployees(loadedEmployees)
        }
      })
      .catch(() => {
        if (shouldUpdate) {
          setError('Booking details could not be loaded. Please try again.')
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
  }, [bookingId, loadAttempt])

  const now = new Date()
  const room = booking ? rooms.find((item) => item.id === booking.roomId) : undefined
  const employee = booking
    ? employees.find((item) => item.id === booking.employeeId)
    : undefined
  const canManageBooking =
    booking?.status === 'confirmed' && isBookingUpcoming(booking, now)

  function retryLoading() {
    setIsLoading(true)
    setError('')
    setLoadAttempt((attempt) => attempt + 1)
  }

  async function handleCancellation() {
    if (!booking) {
      return
    }

    setIsCancelling(true)
    setCancellationError('')

    try {
      const cancelledBooking = await cancelBooking(booking.id)
      setBooking(cancelledBooking)
      setIsConfirmingCancellation(false)
      setCancellationSucceeded(true)
    } catch (cancellationFailure) {
      setCancellationError(
        cancellationFailure instanceof Error
          ? cancellationFailure.message
          : 'The booking could not be cancelled.',
      )
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <section>
      <PageHeader
        actions={
          <>
            <Link className={buttonVariants({ variant: 'outline' })} to="/bookings">
              <ArrowLeft aria-hidden="true" />
              All bookings
            </Link>
            {canManageBooking ? (
              <Link className={buttonVariants()} to={`/bookings/${bookingId}/edit`}>
                <Pencil aria-hidden="true" />
                Edit booking
              </Link>
            ) : null}
          </>
        }
        description="Review the meeting schedule, room, and organizer."
        eyebrow="Booking details"
        title={booking?.title ?? 'Booking details'}
      />

      {isLoading ? (
        <BookingDetailsLoading />
      ) : error ? (
        <LoadError className="mt-8" message={error} onRetry={retryLoading} />
      ) : booking ? (
        <>
          <BookingDetailsCard booking={booking} employee={employee} now={now} room={room} />

          {cancellationSucceeded && (
            <div
              aria-live="polite"
              className="mt-6 flex items-center gap-2.5 rounded-lg border border-border bg-muted px-4 py-3 text-sm font-medium"
              role="status"
            >
              <CircleCheck aria-hidden="true" className="shrink-0" size={16} />
              Booking cancelled — the status badge above has been updated.
            </div>
          )}

          {canManageBooking ? (
            <CancelBookingPanel
              error={cancellationError}
              isCancelling={isCancelling}
              isConfirming={isConfirmingCancellation}
              onCancel={handleCancellation}
              onClose={() => {
                setIsConfirmingCancellation(false)
                setCancellationError('')
              }}
              onOpen={() => setIsConfirmingCancellation(true)}
            />
          ) : null}
        </>
      ) : (
        <EmptyState
          actionLabel="Return to bookings"
          className="mt-8"
          description="The booking may have been removed or the link is incorrect."
          icon={<CalendarX2 aria-hidden="true" size={22} />}
          onAction={() => navigate('/bookings')}
          title="Booking not found"
        />
      )}
    </section>
  )
}
