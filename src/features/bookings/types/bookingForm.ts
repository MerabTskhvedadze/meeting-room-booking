export type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable'

export type BookingFormValues = {
  date: string
  description: string
  employeeId: string
  endTime: string
  roomId: string
  startTime: string
  title: string
}
