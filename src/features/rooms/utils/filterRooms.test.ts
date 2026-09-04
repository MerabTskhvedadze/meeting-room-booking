import { describe, expect, it } from 'vitest'
import type { Room } from '@/types/room'
import { filterRooms } from './filterRooms'

const rooms: Room[] = [
  { id: 'small', name: 'Focus Pod', capacity: 2, floor: 1, amenities: ['Phone'] },
  { id: 'large', name: 'Atlas', capacity: 16, floor: 3, amenities: ['Projector'] },
]

const emptyFilters = { amenity: '', capacity: '', floor: '', search: '' }

describe('filterRooms', () => {
  it('filters by name or amenity search', () => {
    expect(filterRooms(rooms, { ...emptyFilters, search: 'projector' })).toEqual([rooms[1]])
  })

  it('filters by floor and minimum capacity', () => {
    expect(filterRooms(rooms, { ...emptyFilters, floor: '3', capacity: '10' })).toEqual([rooms[1]])
  })

  it('returns all rooms when filters are empty', () => {
    expect(filterRooms(rooms, emptyFilters)).toEqual(rooms)
  })
})
