import { describe, expect, it } from 'vitest'
import { getGreeting, formatMeetingDay } from '@/features/dashboard/utils/date'
import {
  combineLocalDateAndTime,
  isSameLocalDay,
  toLocalDateValue,
} from './date'

// ---------------------------------------------------------------------------
// isSameLocalDay
// ---------------------------------------------------------------------------

describe('isSameLocalDay', () => {
  it('returns true for two dates on the same calendar day', () => {
    expect(
      isSameLocalDay(new Date(2026, 8, 4, 8, 0, 0), new Date(2026, 8, 4, 22, 0, 0)),
    ).toBe(true)
  })

  it('returns false for dates on consecutive days', () => {
    expect(
      isSameLocalDay(new Date(2026, 8, 4, 23, 0, 0), new Date(2026, 8, 5, 0, 0, 0)),
    ).toBe(false)
  })

  it('returns false for same day in different months', () => {
    expect(
      isSameLocalDay(new Date(2026, 8, 4, 10, 0, 0), new Date(2026, 9, 4, 10, 0, 0)),
    ).toBe(false)
  })

  it('returns false for same day in different years', () => {
    expect(
      isSameLocalDay(new Date(2025, 8, 4, 10, 0, 0), new Date(2026, 8, 4, 10, 0, 0)),
    ).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// toLocalDateValue
// ---------------------------------------------------------------------------

describe('toLocalDateValue', () => {
  it('returns a string matching YYYY-MM-DD', () => {
    const result = toLocalDateValue(new Date(2026, 8, 4))
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('formats September 4 2026 correctly', () => {
    // Using the Date constructor with local parts avoids timezone offset issues.
    expect(toLocalDateValue(new Date(2026, 8, 4))).toBe('2026-09-04')
  })

  it('zero-pads single-digit months and days', () => {
    expect(toLocalDateValue(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

// ---------------------------------------------------------------------------
// combineLocalDateAndTime
// ---------------------------------------------------------------------------

describe('combineLocalDateAndTime', () => {
  it('joins a date string and a time string with T', () => {
    expect(combineLocalDateAndTime('2026-09-04', '10:30')).toBe('2026-09-04T10:30')
  })

  it('works with midnight', () => {
    expect(combineLocalDateAndTime('2026-09-04', '00:00')).toBe('2026-09-04T00:00')
  })
})

// ---------------------------------------------------------------------------
// getGreeting
// ---------------------------------------------------------------------------

describe('getGreeting', () => {
  it('returns a morning greeting for hours 0 through 11', () => {
    expect(getGreeting(0)).toBe('Good morning')
    expect(getGreeting(6)).toBe('Good morning')
    expect(getGreeting(11)).toBe('Good morning')
  })

  it('returns an afternoon greeting for hours 12 through 17', () => {
    expect(getGreeting(12)).toBe('Good afternoon')
    expect(getGreeting(15)).toBe('Good afternoon')
    expect(getGreeting(17)).toBe('Good afternoon')
  })

  it('returns an evening greeting for hours 18 through 23', () => {
    expect(getGreeting(18)).toBe('Good evening')
    expect(getGreeting(21)).toBe('Good evening')
    expect(getGreeting(23)).toBe('Good evening')
  })
})

// ---------------------------------------------------------------------------
// formatMeetingDay
// ---------------------------------------------------------------------------

describe('formatMeetingDay', () => {
  const today = new Date(2026, 8, 4, 12, 0, 0)

  it('returns "Today" when the date is the same calendar day', () => {
    const sameDay = new Date(2026, 8, 4, 9, 0, 0)
    expect(formatMeetingDay(sameDay, today)).toBe('Today')
  })

  it('returns a formatted date string for a different day', () => {
    const tomorrow = new Date(2026, 8, 5, 10, 0, 0)
    const result = formatMeetingDay(tomorrow, today)
    expect(result).not.toBe('Today')
    expect(result.length).toBeGreaterThan(0)
  })
})
