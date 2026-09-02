import { describe, expect, it } from 'vitest'

import { toDateTimeLocalValue, toLocalDateValue } from './date'

describe('date utilities', () => {
  it('formats an ISO date for a local date-time input without changing the moment', () => {
    const isoDate = '2099-01-12T10:00:00.000Z'
    const localInputValue = toDateTimeLocalValue(isoDate)

    expect(new Date(localInputValue).toISOString()).toBe(isoDate)
  })

  it('formats a date for URL and date input values', () => {
    expect(toLocalDateValue(new Date(2099, 0, 7))).toBe('2099-01-07')
  })
})
