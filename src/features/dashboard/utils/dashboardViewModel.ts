import type { Booking } from '@/types/booking'
import type { Room } from '@/types/room'
import { isBookingActive, isBookingUpcoming } from '@/utils/booking'
import { isSameLocalDay } from '@/utils/date'

export function buildDashboardViewModel(bookings: Booking[], rooms: Room[], now: Date) {
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const confirmedBookings = bookings.filter((booking) => booking.status === 'confirmed')
  const activeBookings = confirmedBookings.filter((booking) => isBookingActive(booking, now))
  const upcomingBookings = confirmedBookings
    .filter((booking) => isBookingUpcoming(booking, now))
    .sort((first, second) => Date.parse(first.startTime) - Date.parse(second.startTime))
  const occupiedRoomIds = new Set(activeBookings.map((booking) => booking.roomId))

  return {
    activeBookings,
    availableRooms: rooms.length - occupiedRoomIds.size,
    occupiedRooms: occupiedRoomIds.size,
    seats: rooms.reduce((total, room) => total + room.capacity, 0),
    todayMeetings: confirmedBookings.filter((booking) =>
      isSameLocalDay(new Date(booking.startTime), now),
    ).length,
    upcomingMeetings: upcomingBookings.filter(
      (booking) => Date.parse(booking.startTime) <= nextWeek.getTime(),
    ).length,
    upcomingBookings,
  }
}
