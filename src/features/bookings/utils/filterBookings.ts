import type { Booking, BookingStatus } from '@/types/booking'
import type { Employee } from '@/types/employee'
import type { Room } from '@/types/room'
import { isBookingPast } from '@/utils/booking'
import { indexById } from '@/utils/collection'

export type BookingPeriod = '' | 'upcoming' | 'past'

export type BookingFilterValues = {
  period: BookingPeriod
  roomId: string
  search: string
  status: BookingStatus | ''
}

export function filterAndSortBookings(
  bookings: Booking[],
  rooms: Room[],
  employees: Employee[],
  filters: BookingFilterValues,
  now: Date,
): Booking[] {
  const search = filters.search.trim().toLowerCase()
  const roomById = indexById(rooms)
  const employeeById = indexById(employees)

  return bookings
    .filter((booking) => {
      const searchableText = [
        booking.title,
        booking.description,
        roomById.get(booking.roomId)?.name,
        employeeById.get(booking.employeeId)?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const bookingIsPast = isBookingPast(booking, now)

      return (
        (!search || searchableText.includes(search)) &&
        (!filters.roomId || booking.roomId === filters.roomId) &&
        (!filters.status || booking.status === filters.status) &&
        (!filters.period ||
          (filters.period === 'upcoming' && !bookingIsPast) ||
          (filters.period === 'past' && bookingIsPast))
      )
    })
    .sort((first, second) => {
      const firstIsCurrentOrUpcoming = !isBookingPast(first, now)
      const secondIsCurrentOrUpcoming = !isBookingPast(second, now)

      if (firstIsCurrentOrUpcoming !== secondIsCurrentOrUpcoming) {
        return firstIsCurrentOrUpcoming ? -1 : 1
      }

      return firstIsCurrentOrUpcoming
        ? Date.parse(first.startTime) - Date.parse(second.startTime)
        : Date.parse(second.startTime) - Date.parse(first.startTime)
    })
}
