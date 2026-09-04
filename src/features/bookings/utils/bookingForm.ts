import type { CreateBookingInput } from '@/types/booking'
import type { Booking } from '@/types/booking'
import { combineLocalDateAndTime, toDateTimeLocalValue } from '@/utils/date'
import type { BookingFormValues } from '../types/bookingForm'

export const emptyBookingFormValues: BookingFormValues = {
  date: '',
  description: '',
  employeeId: '',
  endTime: '10:00',
  roomId: '',
  startTime: '09:00',
  title: '',
}

export function bookingToFormValues(booking: Booking): BookingFormValues {
  const start = toDateTimeLocalValue(booking.startTime)
  const end = toDateTimeLocalValue(booking.endTime)

  return {
    date: start.slice(0, 10),
    description: booking.description,
    employeeId: booking.employeeId,
    endTime: end.slice(11, 16),
    roomId: booking.roomId,
    startTime: start.slice(11, 16),
    title: booking.title,
  }
}

export function formValuesToBookingInput(values: BookingFormValues): CreateBookingInput {
  const start = Date.parse(combineLocalDateAndTime(values.date, values.startTime))
  const end = Date.parse(combineLocalDateAndTime(values.date, values.endTime))

  if (Number.isNaN(start) || Number.isNaN(end)) {
    throw new Error('Choose valid start and end times.')
  }

  return {
    description: values.description,
    employeeId: values.employeeId,
    endTime: new Date(end).toISOString(),
    roomId: values.roomId,
    startTime: new Date(start).toISOString(),
    title: values.title,
  }
}

export function adjustEndTime(startTime: string, endTime: string): string {
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
  const start = toMinutes(startTime)
  const end = toMinutes(endTime)

  if (end > start) return endTime

  const adjusted = Math.min(start + 60, 23 * 60 + 45)
  return `${String(Math.floor(adjusted / 60)).padStart(2, '0')}:${String(adjusted % 60).padStart(2, '0')}`
}
