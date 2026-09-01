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
    <div className="mt-6 space-y-3">
      {bookings.map((booking) => (
        <BookingCard
          booking={booking}
          employee={employeeById.get(booking.employeeId)}
          key={booking.id}
          now={now}
          room={roomById.get(booking.roomId)}
        />
      ))}
    </div>
  )
}
