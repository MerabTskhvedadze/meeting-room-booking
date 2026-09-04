import { describe, expect, it } from 'vitest'
import type { Booking } from '@/types/booking'
import { isBookingActive, isBookingPast, isBookingUpcoming } from './booking'

function makeBooking(start: string, end: string): Booking {
  return {
    id: 'test-booking',
    roomId: 'room-101',
    employeeId: 'emp-1',
    title: 'Test',
    description: '',
    startTime: start,
    endTime: end,
    status: 'confirmed',
    createdAt: '2026-01-01T00:00:00.000Z',
  }
}

// Fixed reference point: 2026-09-04 at noon UTC.
const NOW = new Date('2026-09-04T12:00:00.000Z')

const PAST_BOOKING = makeBooking('2026-09-04T09:00:00.000Z', '2026-09-04T10:00:00.000Z')
const ACTIVE_BOOKING = makeBooking('2026-09-04T11:00:00.000Z', '2026-09-04T13:00:00.000Z')
const UPCOMING_BOOKING = makeBooking('2026-09-05T10:00:00.000Z', '2026-09-05T11:00:00.000Z')

describe('isBookingPast', () => {
  it('returns true when the booking has already ended', () => {
    expect(isBookingPast(PAST_BOOKING, NOW)).toBe(true)
  })

  it('returns false while the booking is in progress', () => {
    expect(isBookingPast(ACTIVE_BOOKING, NOW)).toBe(false)
  })

  it('returns false for a future booking', () => {
    expect(isBookingPast(UPCOMING_BOOKING, NOW)).toBe(false)
  })

  it('returns true when end time is exactly equal to now (boundary)', () => {
    const booking = makeBooking('2026-09-04T11:00:00.000Z', NOW.toISOString())
    expect(isBookingPast(booking, NOW)).toBe(true)
  })
})

describe('isBookingActive', () => {
  it('returns true while the meeting is in progress', () => {
    expect(isBookingActive(ACTIVE_BOOKING, NOW)).toBe(true)
  })

  it('returns false before the booking starts', () => {
    expect(isBookingActive(UPCOMING_BOOKING, NOW)).toBe(false)
  })

  it('returns false after the booking has ended', () => {
    expect(isBookingActive(PAST_BOOKING, NOW)).toBe(false)
  })

  it('returns true when now equals start time (meeting just started)', () => {
    const booking = makeBooking(NOW.toISOString(), '2026-09-04T13:00:00.000Z')
    expect(isBookingActive(booking, NOW)).toBe(true)
  })

  it('returns false when now equals end time (meeting just finished)', () => {
    const booking = makeBooking('2026-09-04T11:00:00.000Z', NOW.toISOString())
    expect(isBookingActive(booking, NOW)).toBe(false)
  })
})

describe('isBookingUpcoming', () => {
  it('returns true before the booking starts', () => {
    expect(isBookingUpcoming(UPCOMING_BOOKING, NOW)).toBe(true)
  })

  it('returns false while the booking is in progress', () => {
    expect(isBookingUpcoming(ACTIVE_BOOKING, NOW)).toBe(false)
  })

  it('returns false after the booking has ended', () => {
    expect(isBookingUpcoming(PAST_BOOKING, NOW)).toBe(false)
  })

  it('returns false when now equals start time (no longer upcoming)', () => {
    const booking = makeBooking(NOW.toISOString(), '2026-09-04T13:00:00.000Z')
    expect(isBookingUpcoming(booking, NOW)).toBe(false)
  })
})
