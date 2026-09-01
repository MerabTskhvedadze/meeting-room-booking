import { Badge } from '@/components/ui/badge'
import type { Booking } from '@/types/booking'
import { isBookingActive, isBookingPast } from '@/utils/booking'

type BookingStatusBadgeProps = {
  booking: Booking
  now: Date
}

export function BookingStatusBadge({ booking, now }: BookingStatusBadgeProps) {
  if (booking.status === 'cancelled') {
    return <Badge variant="destructive">Cancelled</Badge>
  }

  if (isBookingPast(booking, now)) {
    return <Badge variant="outline">Past</Badge>
  }

  if (isBookingActive(booking, now)) {
    return <Badge>In progress</Badge>
  }

  return <Badge variant="secondary">Upcoming</Badge>
}
