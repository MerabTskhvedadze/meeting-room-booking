import { useCallback } from 'react'

import { useAsyncQuery } from '@/hooks/use-async-query'
import { getBookingContext } from '@/services/workspaceService'

export function useBookingFormData(bookingId?: string) {
  const query = useCallback(() => getBookingContext(bookingId), [bookingId])
  return useAsyncQuery(query, 'Booking form data could not be loaded. Please try again.')
}
