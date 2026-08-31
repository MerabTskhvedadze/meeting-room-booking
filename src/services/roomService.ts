import roomsSeed from '../data/rooms.json'
import type { Room } from '../types/room'

const rooms = roomsSeed as Room[]

export async function getRooms(): Promise<Room[]> {
  return structuredClone(rooms)
}

export async function getRoomById(id: string): Promise<Room | null> {
  const room = rooms.find((candidate) => candidate.id === id)
  return room ? structuredClone(room) : null
}
