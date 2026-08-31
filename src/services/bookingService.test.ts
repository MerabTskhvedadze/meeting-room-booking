import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { CreateBookingInput } from '../types/booking'
import { createMemoryStorage } from '../test/memoryStorage'
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getBookings,
  isRoomAvailable,
  updateBooking,
} from './bookingService'

const validBooking: CreateBookingInput = {
  roomId: 'room-101',
  employeeId: 'emp-1',
  title: 'Product planning',
  description: 'Plan the next product milestone.',
  startTime: '2099-01-12T10:00:00.000Z',
  endTime: '2099-01-12T11:00:00.000Z',
}

describe('booking service', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { localStorage: createMemoryStorage() })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses seed bookings when nothing has been saved', async () => {
    const bookings = await getBookings()

    expect(bookings).toHaveLength(5)
    expect(bookings[0].title).toBe('Weekly Engineering Sync')
  })

  it('creates and persists a booking', async () => {
    const created = await createBooking({
      ...validBooking,
      title: '  Product planning  ',
    })

    expect(created).toMatchObject({
      roomId: validBooking.roomId,
      title: 'Product planning',
      status: 'confirmed',
    })
    expect(created.id).toMatch(/^booking-/)

    const savedBooking = await getBookingById(created.id)
    expect(savedBooking).toEqual(created)
    await expect(getBookings()).resolves.toHaveLength(6)
  })

  it('updates an existing booking', async () => {
    const created = await createBooking(validBooking)
    const updated = await updateBooking(created.id, {
      title: 'Updated product planning',
      endTime: '2099-01-12T11:30:00.000Z',
    })

    expect(updated.title).toBe('Updated product planning')
    expect(updated.endTime).toBe('2099-01-12T11:30:00.000Z')
    await expect(getBookingById(created.id)).resolves.toEqual(updated)
  })

  it('cancels a booking without deleting it', async () => {
    const created = await createBooking(validBooking)
    const cancelled = await cancelBooking(created.id)

    expect(cancelled.status).toBe('cancelled')
    await expect(getBookingById(created.id)).resolves.toEqual(cancelled)
  })

  it('prevents overlapping bookings in the same room', async () => {
    await createBooking(validBooking)

    await expect(
      createBooking({
        ...validBooking,
        employeeId: 'emp-2',
        startTime: '2099-01-12T10:30:00.000Z',
        endTime: '2099-01-12T11:30:00.000Z',
      }),
    ).rejects.toThrow('This room is already booked during the selected time.')

    await expect(
      isRoomAvailable(
        validBooking.roomId,
        '2099-01-12T10:30:00.000Z',
        '2099-01-12T10:45:00.000Z',
      ),
    ).resolves.toBe(false)
  })

  it('allows consecutive bookings when their times do not overlap', async () => {
    await createBooking(validBooking)

    await expect(
      createBooking({
        ...validBooking,
        employeeId: 'emp-2',
        startTime: validBooking.endTime,
        endTime: '2099-01-12T12:00:00.000Z',
      }),
    ).resolves.toMatchObject({ startTime: validBooking.endTime })
  })

  it('rejects invalid and past booking times', async () => {
    await expect(
      createBooking({
        ...validBooking,
        endTime: validBooking.startTime,
      }),
    ).rejects.toThrow('The booking must end after it starts.')

    await expect(
      createBooking({
        ...validBooking,
        startTime: '2020-01-12T10:00:00.000Z',
        endTime: '2020-01-12T11:00:00.000Z',
      }),
    ).rejects.toThrow('A booking must start in the future.')
  })
})
