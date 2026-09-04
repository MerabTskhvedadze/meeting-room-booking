import { useCallback } from 'react'

import { useAsyncQuery } from '@/hooks/use-async-query'
import { getScheduleData } from '@/services/workspaceService'

export function useScheduleData() {
  const query = useCallback(() => getScheduleData(), [])
  return useAsyncQuery(query, 'The room schedule could not be loaded. Please try again.')
}
