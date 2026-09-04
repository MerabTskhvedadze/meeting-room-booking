import { useCallback } from 'react'

import { getWorkspaceData } from '@/services/workspaceService'
import { useAsyncQuery } from './use-async-query'

export function useWorkspaceData() {
  const query = useCallback(() => getWorkspaceData(), [])
  return useAsyncQuery(query, 'Workspace data could not be loaded. Please try again.')
}
