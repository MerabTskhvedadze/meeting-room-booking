import { describe, expect, it } from 'vitest'

import { toDateTimeLocalValue } from './date'

describe('date utilities', () => {
  it('formats an ISO date for a local date-time input without changing the moment', () => {
    const isoDate = '2099-01-12T10:00:00.000Z'
    const localInputValue = toDateTimeLocalValue(isoDate)

    expect(new Date(localInputValue).toISOString()).toBe(isoDate)
  })
})
