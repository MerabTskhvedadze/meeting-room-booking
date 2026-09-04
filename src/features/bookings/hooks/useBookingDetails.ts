import { useCallback } from 'react'

import { useAsyncQuery } from '@/hooks/use-async-query'
import { getBookingContext } from '@/services/workspaceService'

export function useBookingDetails(bookingId: string) {
  const query = useCallback(async () => {
    const context = await getBookingContext(bookingId)
    const { booking, employees, rooms } = context

    return {
      booking,
      employee: booking
        ? employees.find((candidate) => candidate.id === booking.employeeId)
        : undefined,
      room: booking ? rooms.find((candidate) => candidate.id === booking.roomId) : undefined,
    }
  }, [bookingId])

  return useAsyncQuery(query, 'Booking details could not be loaded. Please try again.')
}
