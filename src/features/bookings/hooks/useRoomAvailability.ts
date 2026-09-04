import { useEffect, useState } from 'react'

import { isRoomAvailable } from '@/services/bookingService'
import { combineLocalDateAndTime } from '@/utils/date'
import type { AvailabilityStatus, BookingFormValues } from '../types/bookingForm'

export function useRoomAvailability(
  values: BookingFormValues,
  ignoredBookingId?: string,
): AvailabilityStatus {
  const [status, setStatus] = useState<AvailabilityStatus>('idle')
  const { date, endTime, roomId, startTime } = values

  const start = Date.parse(combineLocalDateAndTime(date, startTime))
  const end = Date.parse(combineLocalDateAndTime(date, endTime))
  const canCheck = Boolean(
    roomId && date && startTime && endTime && !Number.isNaN(start) && !Number.isNaN(end) && start < end,
  )

  useEffect(() => {
    if (!canCheck) return

    let active = true
    const timeout = window.setTimeout(async () => {
      setStatus('checking')
      try {
        const available = await isRoomAvailable(
          roomId,
          new Date(start).toISOString(),
          new Date(end).toISOString(),
          ignoredBookingId,
        )
        if (active) setStatus(available ? 'available' : 'unavailable')
      } catch {
        if (active) setStatus('idle')
      }
    }, 400)

    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [canCheck, end, ignoredBookingId, roomId, start])

  return canCheck ? status : 'idle'
}
