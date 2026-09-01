import type { Booking } from '@/types/booking'

export function isBookingPast(booking: Booking, now: Date) {
  return Date.parse(booking.endTime) <= now.getTime()
}

export function isBookingActive(booking: Booking, now: Date) {
  return (
    Date.parse(booking.startTime) <= now.getTime() &&
    Date.parse(booking.endTime) > now.getTime()
  )
}

export function isBookingUpcoming(booking: Booking, now: Date) {
  return Date.parse(booking.startTime) > now.getTime()
}
