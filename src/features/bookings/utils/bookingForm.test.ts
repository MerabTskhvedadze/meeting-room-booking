import { describe, expect, it } from 'vitest'

import type { Booking } from '@/types/booking'
import {
  adjustEndTime,
  bookingToFormValues,
  formValuesToBookingInput,
} from './bookingForm'

describe('adjustEndTime', () => {
  it('keeps a valid end time', () => {
    expect(adjustEndTime('09:00', '10:00')).toBe('10:00')
  })

  it('moves an invalid end time one hour after the start', () => {
    expect(adjustEndTime('14:00', '10:00')).toBe('15:00')
  })

  it('caps late meetings at 23:45', () => {
    expect(adjustEndTime('23:30', '22:00')).toBe('23:45')
  })
})

describe('booking form transformations', () => {
  const booking: Booking = {
    id: 'booking-1',
    roomId: 'room-101',
    employeeId: 'emp-1',
    title: 'Planning',
    description: 'Quarterly planning',
    startTime: '2026-10-01T10:00:00.000Z',
    endTime: '2026-10-01T11:00:00.000Z',
    status: 'confirmed',
    createdAt: '2026-09-01T10:00:00.000Z',
  }

  it('maps a booking into editable form values', () => {
    const values = bookingToFormValues(booking)
    expect(values.title).toBe('Planning')
    expect(values.roomId).toBe('room-101')
    expect(values.date).toMatch(/^2026-10-01$/)
  })

  it('maps valid form values into service input', () => {
    const input = formValuesToBookingInput({
      date: '2026-10-01',
      description: 'Quarterly planning',
      employeeId: 'emp-1',
      endTime: '11:00',
      roomId: 'room-101',
      startTime: '10:00',
      title: 'Planning',
    })
    expect(Date.parse(input.startTime)).toBe(Date.parse('2026-10-01T10:00'))
    expect(Date.parse(input.endTime)).toBe(Date.parse('2026-10-01T11:00'))
  })

  it('rejects invalid date and time values', () => {
    expect(() =>
      formValuesToBookingInput({
        date: '',
        description: '',
        employeeId: 'emp-1',
        endTime: '11:00',
        roomId: 'room-101',
        startTime: '10:00',
        title: 'Planning',
      }),
    ).toThrow('Choose valid start and end times.')
  })
})
