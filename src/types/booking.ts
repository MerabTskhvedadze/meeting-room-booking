export type BookingStatus = 'confirmed' | 'cancelled'

export interface Booking {
  id: string
  roomId: string
  employeeId: string
  title: string
  description: string
  startTime: string
  endTime: string
  status: BookingStatus
  createdAt: string
}

export type CreateBookingInput = Pick<
  Booking,
  'roomId' | 'employeeId' | 'title' | 'description' | 'startTime' | 'endTime'
>

export type UpdateBookingInput = Partial<CreateBookingInput>
