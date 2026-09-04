import { describe, expect, it } from 'vitest'
import type { Booking } from '@/types/booking'
import { filterAndSortBookings } from './filterBookings'

const now = new Date('2026-09-04T12:00:00.000Z')
const bookings: Booking[] = [
  { id: 'past', roomId: 'r1', employeeId: 'e1', title: 'Retro', description: '', startTime: '2026-09-03T10:00:00Z', endTime: '2026-09-03T11:00:00Z', status: 'confirmed', createdAt: '' },
  { id: 'next', roomId: 'r2', employeeId: 'e2', title: 'Planning', description: '', startTime: '2026-09-05T10:00:00Z', endTime: '2026-09-05T11:00:00Z', status: 'confirmed', createdAt: '' },
]
const rooms = [
  { id: 'r1', name: 'Atlas', capacity: 4, floor: 1, amenities: [] },
  { id: 'r2', name: 'Nexus', capacity: 8, floor: 2, amenities: [] },
]
const employees = [
  { id: 'e1', name: 'Sarah', email: '', department: '' },
  { id: 'e2', name: 'David', email: '', department: '' },
]
const emptyFilters = { period: '' as const, roomId: '', search: '', status: '' as const }

describe('filterAndSortBookings', () => {
  it('searches related room and employee names', () => {
    expect(filterAndSortBookings(bookings, rooms, employees, { ...emptyFilters, search: 'David' }, now).map((b) => b.id)).toEqual(['next'])
  })

  it('filters past bookings', () => {
    expect(filterAndSortBookings(bookings, rooms, employees, { ...emptyFilters, period: 'past' }, now).map((b) => b.id)).toEqual(['past'])
  })

  it('sorts upcoming bookings before past bookings', () => {
    expect(filterAndSortBookings(bookings, rooms, employees, emptyFilters, now).map((b) => b.id)).toEqual(['next', 'past'])
  })
})
