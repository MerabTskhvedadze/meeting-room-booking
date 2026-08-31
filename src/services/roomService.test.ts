import { describe, expect, it } from 'vitest'

import { getRoomById, getRooms } from './roomService'

describe('room service', () => {
  it('loads rooms from the seed data', async () => {
    const rooms = await getRooms()

    expect(rooms).toHaveLength(5)
    expect(rooms[0]).toMatchObject({
      id: 'room-101',
      name: 'Atlas Boardroom',
      capacity: 16,
    })
  })

  it('finds a room by id', async () => {
    await expect(getRoomById('room-202')).resolves.toMatchObject({
      name: 'Zenith Focus Pod',
      floor: 2,
    })
    await expect(getRoomById('missing-room')).resolves.toBeNull()
  })
})
