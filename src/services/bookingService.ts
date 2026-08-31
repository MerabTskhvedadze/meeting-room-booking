import bookingsSeed from '../data/bookings.json'
import employeesSeed from '../data/employees.json'
import roomsSeed from '../data/rooms.json'
import type {
  Booking,
  CreateBookingInput,
  UpdateBookingInput,
} from '../types/booking'
import type { Employee } from '../types/employee'
import type { Room } from '../types/room'
import { readStoredJson, writeStoredJson } from '../data/storage/browserStorage'

const STORAGE_KEY = 'bookings'

const seedBookings = bookingsSeed as Booking[]
const rooms = roomsSeed as Room[]
const employees = employeesSeed as Employee[]

function readBookings(): Booking[] {
  return structuredClone(readStoredJson(STORAGE_KEY, seedBookings))
}

function saveBookings(bookings: Booking[]): void {
  writeStoredJson(STORAGE_KEY, bookings)
}

function parseTime(value: string, fieldName: string): number {
  const timestamp = Date.parse(value)

  if (Number.isNaN(timestamp)) {
    throw new Error(`${fieldName} must be a valid date and time.`)
  }

  return timestamp
}

function validateBooking(input: CreateBookingInput): CreateBookingInput {
  const title = input.title.trim()
  const description = input.description.trim()
  const start = parseTime(input.startTime, 'Start time')
  const end = parseTime(input.endTime, 'End time')

  if (!title) {
    throw new Error('A booking title is required.')
  }

  if (start >= end) {
    throw new Error('The booking must end after it starts.')
  }

  if (start <= Date.now()) { 
    throw new Error('A booking must start in the future.')
  }

  if (!rooms.some((room) => room.id === input.roomId)) {
    throw new Error('The selected room does not exist.')
  }

  if (!employees.some((employee) => employee.id === input.employeeId)) {
    throw new Error('The selected employee does not exist.')
  }

  return {
    ...input,
    title,
    description,
    startTime: new Date(start).toISOString(),
    endTime: new Date(end).toISOString(),
  }
}

function hasConflict(
  bookings: Booking[],
  roomId: string,
  startTime: string,
  endTime: string,
  ignoredBookingId?: string,
): boolean {
  const requestedStart = Date.parse(startTime)
  const requestedEnd = Date.parse(endTime)

  return bookings.some((booking) => {
    const shouldIgnore =
      booking.id === ignoredBookingId ||
      booking.roomId !== roomId ||
      booking.status === 'cancelled'

    if (shouldIgnore) {
      return false
    }

    return (
      requestedStart < Date.parse(booking.endTime) &&
      requestedEnd > Date.parse(booking.startTime)
    )
  })
}

function ensureRoomIsAvailable(
  bookings: Booking[],
  input: CreateBookingInput,
  ignoredBookingId?: string,
): void {
  if (
    hasConflict(
      bookings,
      input.roomId,
      input.startTime,
      input.endTime,
      ignoredBookingId,
    )
  ) {
    throw new Error('This room is already booked during the selected time.')
  }
}

function ensureBookingIsUpcoming(booking: Booking): void {
  if (Date.parse(booking.startTime) <= Date.now()) {
    throw new Error('Past bookings cannot be changed.')
  }
}

export async function getBookings(): Promise<Booking[]> {
  return readBookings()
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const booking = readBookings().find((item) => item.id === id)
  return booking ? structuredClone(booking) : null
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const bookings = readBookings()
  const validBooking = validateBooking(input)
  ensureRoomIsAvailable(bookings, validBooking)

  const newBooking: Booking = {
    ...validBooking,
    id: `booking-${crypto.randomUUID()}`,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }

  saveBookings([...bookings, newBooking])
  return structuredClone(newBooking)
}

export async function updateBooking(
  id: string,
  changes: UpdateBookingInput,
): Promise<Booking> {
  const bookings = readBookings()
  const bookingIndex = bookings.findIndex((booking) => booking.id === id)

  if (bookingIndex === -1) {
    throw new Error('Booking not found.')
  }

  const currentBooking = bookings[bookingIndex]

  if (currentBooking.status === 'cancelled') {
    throw new Error('A cancelled booking cannot be edited.')
  }

  ensureBookingIsUpcoming(currentBooking)

  const updatedDetails = validateBooking({
    roomId: changes.roomId ?? currentBooking.roomId,
    employeeId: changes.employeeId ?? currentBooking.employeeId,
    title: changes.title ?? currentBooking.title,
    description: changes.description ?? currentBooking.description,
    startTime: changes.startTime ?? currentBooking.startTime,
    endTime: changes.endTime ?? currentBooking.endTime,
  })

  ensureRoomIsAvailable(bookings, updatedDetails, id)

  const updatedBooking: Booking = {
    ...currentBooking,
    ...updatedDetails,
  }

  bookings[bookingIndex] = updatedBooking
  saveBookings(bookings)
  return structuredClone(updatedBooking)
}

export async function cancelBooking(id: string): Promise<Booking> {
  const bookings = readBookings()
  const bookingIndex = bookings.findIndex((booking) => booking.id === id)

  if (bookingIndex === -1) {
    throw new Error('Booking not found.')
  }

  ensureBookingIsUpcoming(bookings[bookingIndex])

  const cancelledBooking: Booking = {
    ...bookings[bookingIndex],
    status: 'cancelled',
  }

  bookings[bookingIndex] = cancelledBooking
  saveBookings(bookings)
  return structuredClone(cancelledBooking)
}

export async function isRoomAvailable(
  roomId: string,
  startTime: string,
  endTime: string,
  ignoredBookingId?: string,
): Promise<boolean> {
  if (!rooms.some((room) => room.id === roomId)) {
    throw new Error('The selected room does not exist.')
  }

  const start = parseTime(startTime, 'Start time')
  const end = parseTime(endTime, 'End time')

  if (start >= end) {
    throw new Error('The booking must end after it starts.')
  }

  return !hasConflict(
    readBookings(),
    roomId,
    new Date(start).toISOString(),
    new Date(end).toISOString(),
    ignoredBookingId,
  )
}
