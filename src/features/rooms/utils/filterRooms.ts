import type { Room } from '@/types/room'

export type RoomFilterValues = {
  amenity: string
  capacity: string
  floor: string
  search: string
}

export function filterRooms(rooms: Room[], filters: RoomFilterValues): Room[] {
  const search = filters.search.trim().toLowerCase()
  const floor = Number(filters.floor)
  const minimumCapacity = Number(filters.capacity)

  return rooms.filter((room) =>
    (!search ||
      room.name.toLowerCase().includes(search) ||
      room.amenities.some((item) => item.toLowerCase().includes(search))) &&
    (!floor || room.floor === floor) &&
    (!minimumCapacity || room.capacity >= minimumCapacity) &&
    (!filters.amenity || room.amenities.includes(filters.amenity)),
  )
}
