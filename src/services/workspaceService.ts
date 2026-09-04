import { getBookingById, getBookings } from './bookingService'
import { getEmployees } from './employeeService'
import { getRooms } from './roomService'

export async function getWorkspaceData() {
  const [bookings, rooms, employees] = await Promise.all([
    getBookings(),
    getRooms(),
    getEmployees(),
  ])

  return { bookings, employees, rooms }
}

export async function getScheduleData() {
  const [bookings, rooms, employees] = await Promise.all([
    getBookings(),
    getRooms(),
    getEmployees(),
  ])
  return { bookings, employees, rooms }
}

export async function getBookingContext(bookingId?: string) {
  const [booking, rooms, employees] = await Promise.all([
    bookingId ? getBookingById(bookingId) : Promise.resolve(null),
    getRooms(),
    getEmployees(),
  ])

  return { booking, employees, rooms }
}
