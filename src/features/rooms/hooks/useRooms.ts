import { useCallback } from 'react'

import { useAsyncQuery } from '@/hooks/use-async-query'
import { getRooms } from '@/services/roomService'

export function useRooms() {
  const query = useCallback(() => getRooms(), [])
  return useAsyncQuery(query, 'Rooms could not be loaded. Please try again.')
}
