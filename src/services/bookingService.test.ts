import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getBookings,
  isRoomAvailable,
  updateBooking,
} from './bookingService'

// ---------------------------------------------------------------------------
// Mock setup
// ---------------------------------------------------------------------------

// vi.hoisted() runs before vi.mock() factories and before module imports,
// making `store` safely available inside the mock factory below.
const store = vi.hoisted(() => new Map<string, string>())

vi.mock('@/data/storage/browserStorage', () => ({
  readStoredJson: <T>(key: string, fallback: T): T => {
    const raw = store.get(key)
    if (raw === undefined) return fallback
    try {
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  },
  writeStoredJson: (key: string, value: unknown): void => {
    store.set(key, JSON.stringify(value))
  },
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

// Fixed "now" so time-based assertions are deterministic.
// All seed bookings end by 2026-09-11, so October 2026 dates are conflict-free.
const FIXED_NOW = new Date('2026-09-04T12:00:00.000Z')

// A small room with no seed bookings in October 2026.
const VALID_ROOM = 'room-202'
const VALID_EMPLOYEE = 'emp-1'

// A clean future slot well beyond all seed data.
const FUTURE_START = '2026-10-01T10:00:00.000Z'
const FUTURE_END = '2026-10-01T11:00:00.000Z'

// room-101 has a confirmed seed booking on 2026-09-08 09:00–11:00 (booking-f06).
// These coordinates overlap that window to test conflict detection.
const CONFLICT_ROOM = 'room-101'
const CONFLICT_START = '2026-09-08T09:30:00.000Z'
const CONFLICT_END = '2026-09-08T10:30:00.000Z'

// booking-f06: room-101, 2026-09-08 09:00–11:00, confirmed — upcoming from FIXED_NOW.
const UPCOMING_SEED_ID = 'booking-f06'

// Minimal valid input factory with overrideable fields.
function validInput(overrides: Partial<Parameters<typeof createBooking>[0]> = {}) {
  return {
    roomId: VALID_ROOM,
    employeeId: VALID_EMPLOYEE,
    title: 'Test meeting',
    description: '',
    startTime: FUTURE_START,
    endTime: FUTURE_END,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

beforeEach(() => {
  store.clear()
  vi.useFakeTimers()
  vi.setSystemTime(FIXED_NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

// ---------------------------------------------------------------------------
// getBookings
// ---------------------------------------------------------------------------

describe('getBookings', () => {
  it('returns seed bookings when storage is empty', async () => {
    const bookings = await getBookings()
    expect(bookings.length).toBeGreaterThan(0)
    expect(bookings.every((b) => typeof b.id === 'string')).toBe(true)
  })

  it('includes a newly created booking', async () => {
    await createBooking(validInput())
    const bookings = await getBookings()
    expect(bookings.some((b) => b.title === 'Test meeting')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// getBookingById
// ---------------------------------------------------------------------------

describe('getBookingById', () => {
  it('returns null for an unknown ID', async () => {
    expect(await getBookingById('booking-does-not-exist')).toBeNull()
  })

  it('returns a seed booking by ID', async () => {
    const booking = await getBookingById(UPCOMING_SEED_ID)
    expect(booking).not.toBeNull()
    expect(booking?.id).toBe(UPCOMING_SEED_ID)
  })

  it('returns a newly created booking by ID', async () => {
    const created = await createBooking(validInput())
    const fetched = await getBookingById(created.id)
    expect(fetched?.id).toBe(created.id)
    expect(fetched?.title).toBe('Test meeting')
  })
})

// ---------------------------------------------------------------------------
// createBooking
// ---------------------------------------------------------------------------

describe('createBooking', () => {
  it('creates a booking with valid input', async () => {
    const booking = await createBooking(validInput())
    expect(booking.id).toMatch(/^booking-/)
    expect(booking.title).toBe('Test meeting')
    expect(booking.status).toBe('confirmed')
    expect(booking.createdAt).toBeTruthy()
  })

  it('persists the booking across subsequent reads', async () => {
    const { id } = await createBooking(validInput())
    expect(await getBookingById(id)).not.toBeNull()
  })

  it('trims whitespace from the title', async () => {
    const booking = await createBooking(validInput({ title: '  Stand-up  ' }))
    expect(booking.title).toBe('Stand-up')
  })

  it('throws for an empty title', async () => {
    await expect(createBooking(validInput({ title: '' }))).rejects.toThrow(
      'A booking title is required.',
    )
  })

  it('throws for a whitespace-only title', async () => {
    await expect(createBooking(validInput({ title: '   ' }))).rejects.toThrow(
      'A booking title is required.',
    )
  })

  it('throws when start time equals end time', async () => {
    await expect(
      createBooking(validInput({ startTime: FUTURE_START, endTime: FUTURE_START })),
    ).rejects.toThrow('The booking must end after it starts.')
  })

  it('throws when end time is before start time', async () => {
    await expect(
      createBooking(validInput({ startTime: FUTURE_END, endTime: FUTURE_START })),
    ).rejects.toThrow('The booking must end after it starts.')
  })

  it('throws when start time is in the past', async () => {
    await expect(
      createBooking(
        validInput({
          startTime: '2026-09-01T10:00:00.000Z',
          endTime: '2026-09-01T11:00:00.000Z',
        }),
      ),
    ).rejects.toThrow('A booking must start in the future.')
  })

  it('throws when start time is exactly now', async () => {
    await expect(
      createBooking(
        validInput({ startTime: FIXED_NOW.toISOString(), endTime: FUTURE_START }),
      ),
    ).rejects.toThrow('A booking must start in the future.')
  })

  it('throws for an unknown room ID', async () => {
    await expect(
      createBooking(validInput({ roomId: 'room-999' })),
    ).rejects.toThrow('The selected room does not exist.')
  })

  it('throws for an unknown employee ID', async () => {
    await expect(
      createBooking(validInput({ employeeId: 'emp-999' })),
    ).rejects.toThrow('The selected employee does not exist.')
  })

  it('throws when the room already has a confirmed booking in that slot', async () => {
    // room-101 has a seed booking from 09:00–11:00 on 2026-09-08.
    await expect(
      createBooking(
        validInput({ roomId: CONFLICT_ROOM, startTime: CONFLICT_START, endTime: CONFLICT_END }),
      ),
    ).rejects.toThrow('This room is already booked during the selected time.')
  })

  it('allows a booking that starts exactly when an existing one ends', async () => {
    // booking-f06 ends at 2026-09-08T11:00:00.000Z — adjacent slot should be free.
    const booking = await createBooking(
      validInput({
        roomId: CONFLICT_ROOM,
        startTime: '2026-09-08T11:00:00.000Z',
        endTime: '2026-09-08T12:00:00.000Z',
      }),
    )
    expect(booking.status).toBe('confirmed')
  })
})

// ---------------------------------------------------------------------------
// updateBooking
// ---------------------------------------------------------------------------

describe('updateBooking', () => {
  it('updates the title of an existing upcoming booking', async () => {
    const updated = await updateBooking(UPCOMING_SEED_ID, { title: 'Renamed meeting' })
    expect(updated.title).toBe('Renamed meeting')
    expect(updated.id).toBe(UPCOMING_SEED_ID)
  })

  it('persists the update across subsequent reads', async () => {
    await updateBooking(UPCOMING_SEED_ID, { title: 'Persisted name' })
    expect((await getBookingById(UPCOMING_SEED_ID))?.title).toBe('Persisted name')
  })

  it('throws for an unknown booking ID', async () => {
    await expect(
      updateBooking('booking-does-not-exist', { title: 'X' }),
    ).rejects.toThrow('Booking not found.')
  })

  it('throws when trying to update a cancelled booking', async () => {
    // booking-p03 is already cancelled in the seed data.
    await expect(updateBooking('booking-p03', { title: 'X' })).rejects.toThrow(
      'A cancelled booking cannot be edited.',
    )
  })

  it('throws when trying to update a past booking', async () => {
    // booking-p01 started 2026-08-25, well before FIXED_NOW.
    await expect(updateBooking('booking-p01', { title: 'X' })).rejects.toThrow(
      'Past bookings cannot be changed.',
    )
  })

  it('throws when the new time conflicts with another room booking', async () => {
    // booking-f08 occupies room-301 on 2026-09-08 15:30–17:30.
    await expect(
      updateBooking(UPCOMING_SEED_ID, {
        roomId: 'room-301',
        startTime: '2026-09-08T15:30:00.000Z',
        endTime: '2026-09-08T16:30:00.000Z',
      }),
    ).rejects.toThrow('This room is already booked during the selected time.')
  })

  it('does not conflict with its own current time slot when time is unchanged', async () => {
    const seed = await getBookingById(UPCOMING_SEED_ID)
    expect(seed).not.toBeNull()

    const updated = await updateBooking(UPCOMING_SEED_ID, {
      title: 'Same slot, new title',
      roomId: seed!.roomId,
      startTime: seed!.startTime,
      endTime: seed!.endTime,
    })

    expect(updated.title).toBe('Same slot, new title')
  })
})

// ---------------------------------------------------------------------------
// cancelBooking
// ---------------------------------------------------------------------------

describe('cancelBooking', () => {
  it('sets the booking status to cancelled', async () => {
    const cancelled = await cancelBooking(UPCOMING_SEED_ID)
    expect(cancelled.status).toBe('cancelled')
    expect(cancelled.id).toBe(UPCOMING_SEED_ID)
  })

  it('persists the cancellation across subsequent reads', async () => {
    await cancelBooking(UPCOMING_SEED_ID)
    expect((await getBookingById(UPCOMING_SEED_ID))?.status).toBe('cancelled')
  })

  it('makes the room slot available after cancellation', async () => {
    await cancelBooking(UPCOMING_SEED_ID)
    // The previously conflicting slot is now free.
    expect(await isRoomAvailable(CONFLICT_ROOM, CONFLICT_START, CONFLICT_END)).toBe(true)
  })

  it('throws for an unknown booking ID', async () => {
    await expect(cancelBooking('booking-does-not-exist')).rejects.toThrow(
      'Booking not found.',
    )
  })

  it('throws for a booking whose start time has already passed', async () => {
    // booking-f03 started at 2026-09-04T09:00 — before FIXED_NOW (12:00).
    await expect(cancelBooking('booking-f03')).rejects.toThrow(
      'Past bookings cannot be changed.',
    )
  })
})

// ---------------------------------------------------------------------------
// isRoomAvailable
// ---------------------------------------------------------------------------

describe('isRoomAvailable', () => {
  it('returns true when the room has no bookings in the requested slot', async () => {
    expect(await isRoomAvailable(VALID_ROOM, FUTURE_START, FUTURE_END)).toBe(true)
  })

  it('returns false when the room has a confirmed conflicting booking', async () => {
    expect(await isRoomAvailable(CONFLICT_ROOM, CONFLICT_START, CONFLICT_END)).toBe(false)
  })

  it('returns true when the only conflicting booking is cancelled', async () => {
    await cancelBooking(UPCOMING_SEED_ID)
    expect(await isRoomAvailable(CONFLICT_ROOM, CONFLICT_START, CONFLICT_END)).toBe(true)
  })

  it('ignores the booking being edited so it never conflicts with itself', async () => {
    expect(
      await isRoomAvailable(CONFLICT_ROOM, CONFLICT_START, CONFLICT_END, UPCOMING_SEED_ID),
    ).toBe(true)
  })

  it('throws for an unknown room ID', async () => {
    await expect(
      isRoomAvailable('room-999', FUTURE_START, FUTURE_END),
    ).rejects.toThrow('The selected room does not exist.')
  })

  it('throws when start equals end', async () => {
    await expect(
      isRoomAvailable(VALID_ROOM, FUTURE_START, FUTURE_START),
    ).rejects.toThrow('The booking must end after it starts.')
  })

  it('throws when start is after end', async () => {
    await expect(
      isRoomAvailable(VALID_ROOM, FUTURE_END, FUTURE_START),
    ).rejects.toThrow('The booking must end after it starts.')
  })
})
