import { ArrowUpRight, CalendarDays, Clock3, MapPin, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import { BookingStatusBadge } from '@/features/bookings/components/BookingStatusBadge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { Booking } from '@/types/booking'
import type { Employee } from '@/types/employee'
import type { Room } from '@/types/room'
import { dateFormatter, timeFormatter } from '@/utils/date'

type ScheduleBookingDrawerProps = {
  booking: Booking | null
  employee?: Employee
  onClose: () => void
  room?: Room
}

export function ScheduleBookingDrawer({
  booking,
  employee,
  onClose,
  room,
}: ScheduleBookingDrawerProps) {
  const start = booking ? new Date(booking.startTime) : null
  const end = booking ? new Date(booking.endTime) : null

  return (
    <Sheet open={booking !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto overscroll-contain sm:max-w-md">
        {booking && start && end ? (
          <>
            <SheetHeader className="border-b pr-12">
              <div className="mb-2">
                <BookingStatusBadge booking={booking} now={new Date()} />
              </div>
              <SheetTitle className="text-xl">{booking.title}</SheetTitle>
              <SheetDescription>Meeting details from the room schedule.</SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-4">
              <dl className="grid gap-5">
                <div className="grid grid-cols-[1.25rem_1fr] gap-3">
                  <CalendarDays aria-hidden="true" className="mt-0.5 text-muted-foreground" size={18} />
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">Date</dt>
                    <dd className="mt-1 font-medium">{dateFormatter.format(start)}</dd>
                  </div>
                </div>

                <div className="grid grid-cols-[1.25rem_1fr] gap-3">
                  <Clock3 aria-hidden="true" className="mt-0.5 text-muted-foreground" size={18} />
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">Time</dt>
                    <dd className="mt-1 font-medium tabular-nums">
                      {timeFormatter.format(start)}–{timeFormatter.format(end)}
                    </dd>
                  </div>
                </div>

                <div className="grid grid-cols-[1.25rem_1fr] gap-3">
                  <MapPin aria-hidden="true" className="mt-0.5 text-muted-foreground" size={18} />
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">Room</dt>
                    <dd className="mt-1 font-medium">{room?.name ?? 'Unknown room'}</dd>
                    {room ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Floor {room.floor} · Capacity {room.capacity}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-[1.25rem_1fr] gap-3">
                  <UserRound aria-hidden="true" className="mt-0.5 text-muted-foreground" size={18} />
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">Organizer</dt>
                    <dd className="mt-1 font-medium">{employee?.name ?? 'Unknown organizer'}</dd>
                    {employee ? (
                      <p className="mt-1 text-xs text-muted-foreground">{employee.department}</p>
                    ) : null}
                  </div>
                </div>
              </dl>

              <div className="border-t pt-5">
                <h3 className="text-sm font-medium">Description</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {booking.description || 'No description was provided for this meeting.'}
                </p>
              </div>
            </div>

            <SheetFooter className="border-t sm:flex-row sm:justify-end">
              <SheetClose render={<Button type="button" variant="outline" />}>
                Close
              </SheetClose>
              <Link className={buttonVariants()} to={`/bookings/${booking.id}`}>
                Open full details
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
