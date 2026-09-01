import { ArrowRight, CalendarCheck2, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Booking } from '@/types/booking'
import type { Employee } from '@/types/employee'
import type { Room } from '@/types/room'
import { timeFormatter } from '@/utils/date'
import { formatMeetingDay } from '../utils/date'

interface UpcomingMeetingsCardProps {
  bookings: Booking[]
  employees: Employee[]
  now: Date
  rooms: Room[]
}

export function UpcomingMeetingsCard({
  bookings,
  employees,
  now,
  rooms,
}: UpcomingMeetingsCardProps) {
  const roomById = new Map(rooms.map((room) => [room.id, room]))
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming meetings</CardTitle>
        <CardDescription>Your next confirmed room bookings.</CardDescription>
        <CardAction>
          <Link className={buttonVariants({ size: 'sm', variant: 'ghost' })} to="/bookings">
            View all
            <ArrowRight aria-hidden="true" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <div className="divide-y">
            {bookings.slice(0, 5).map((booking) => {
              const start = new Date(booking.startTime)
              const end = new Date(booking.endTime)
              const room = roomById.get(booking.roomId)
              const employee = employeeById.get(booking.employeeId)

              return (
                <Link
                  className="group flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                  key={booking.id}
                  to={`/bookings/${booking.id}`}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <CalendarCheck2 aria-hidden="true" size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium group-hover:underline">{booking.title}</p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {room?.name ?? 'Unknown room'} &middot;{' '}
                      {employee?.name ?? 'Unknown host'}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge variant="outline">{formatMeetingDay(start, now)}</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {timeFormatter.format(start)}&ndash;{timeFormatter.format(end)}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="py-10 text-center">
            <CalendarDays
              aria-hidden="true"
              className="mx-auto text-muted-foreground"
              size={24}
            />
            <p className="mt-3 font-medium">No upcoming meetings</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a booking when your team is ready.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
