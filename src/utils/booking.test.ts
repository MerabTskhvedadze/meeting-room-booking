import { describe, expect, it } from 'vitest'

import type { Booking } from '@/types/booking'
import { isBookingActive, isBookingPast, isBookingUpcoming } from './booking'

const now = new Date('2026-09-01T10:00:00.000Z')

const booking: Booking = {
  id: 'booking-1',
  roomId: 'room-101',
  employeeId: 'emp-1',
  title: 'Planning meeting',
  description: 'Plan the next milestone.',
  startTime: '2026-09-01T09:00:00.000Z',
  endTime: '2026-09-01T11:00:00.000Z',
  status: 'confirmed',
  createdAt: '2026-08-25T09:00:00.000Z',
}

describe('booking lifecycle utilities', () => {
  it('treats a booking as past when its end time is reached', () => {
    expect(isBookingPast({ ...booking, endTime: now.toISOString() }, now)).toBe(true)
    expect(isBookingPast(booking, now)).toBe(false)
  })

  it('treats a booking as active from its start until its end', () => {
    expect(isBookingActive({ ...booking, startTime: now.toISOString() }, now)).toBe(true)
    expect(isBookingActive({ ...booking, endTime: now.toISOString() }, now)).toBe(false)
  })

  it('treats a booking as upcoming only before its start time', () => {
    expect(
      isBookingUpcoming({ ...booking, startTime: '2026-09-01T10:01:00.000Z' }, now),
    ).toBe(true)
    expect(isBookingUpcoming({ ...booking, startTime: now.toISOString() }, now)).toBe(false)
  })
})
