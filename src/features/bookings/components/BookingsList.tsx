import type { Booking } from '@/types/booking'
import type { Employee } from '@/types/employee'
import type { Room } from '@/types/room'
import { BookingCard } from './BookingCard'

interface BookingsListProps {
  bookings: Booking[]
  employees: Employee[]
  now: Date
  rooms: Room[]
}

export function BookingsList({ bookings, employees, now, rooms }: BookingsListProps) {
  const roomById = new Map(rooms.map((room) => [room.id, room]))
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]))

  return (
    <ul className="mt-6 list-none space-y-3">
      {bookings.map((booking) => (
        <li key={booking.id}>
          <BookingCard
            booking={booking}
            employee={employeeById.get(booking.employeeId)}
            now={now}
            room={roomById.get(booking.roomId)}
          />
        </li>
      ))}
    </ul>
  )
}
