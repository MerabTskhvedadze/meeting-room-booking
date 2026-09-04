import { ArrowLeft, CalendarX2, CircleCheck, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { LoadError } from '@/components/LoadError'
import { PageHeader } from '@/components/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import { cancelBooking } from '@/services/bookingService'
import { isBookingUpcoming } from '@/utils/booking'
import { getErrorMessage } from '@/utils/error'
import { BookingDetailsCard } from '../components/BookingDetailsCard'
import { BookingDetailsLoading } from '../components/BookingDetailsLoading'
import { CancelBookingPanel } from '../components/CancelBookingPanel'
import { useBookingDetails } from '../hooks/useBookingDetails'

export function BookingDetailsPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { data, error, isLoading, retry } = useBookingDetails(bookingId ?? '')
  const booking = data?.booking ?? null
  const employee = data?.employee
  const room = data?.room
  const [isConfirmingCancellation, setIsConfirmingCancellation] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancellationError, setCancellationError] = useState('')
  const [cancellationSucceeded, setCancellationSucceeded] = useState(false)

  useDocumentTitle(booking?.title ?? 'Booking details')

  const now = new Date()
  const canManageBooking = booking?.status === 'confirmed' && isBookingUpcoming(booking, now)

  async function handleCancellation() {
    if (!booking) {
      return
    }

    setIsCancelling(true)
    setCancellationError('')

    try {
      await cancelBooking(booking.id)
      setIsConfirmingCancellation(false)
      setCancellationSucceeded(true)
      retry()
    } catch (cancellationFailure) {
      setCancellationError(
        getErrorMessage(cancellationFailure, 'The booking could not be cancelled.'),
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
        <LoadError className="mt-8" message={error} onRetry={retry} />
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
