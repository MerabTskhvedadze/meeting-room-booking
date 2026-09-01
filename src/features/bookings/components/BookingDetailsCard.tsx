import { CalendarDays, Clock3, Mail, MapPin, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
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
import { dateFormatter, timeFormatter } from '@/utils/date'
import { BookingStatusBadge } from './BookingStatusBadge'

type BookingDetailsCardProps = {
  booking: Booking
  employee?: Employee
  now: Date
  room?: Room
}

export function BookingDetailsCard({
  booking,
  employee,
  now,
  room,
}: BookingDetailsCardProps) {
  const start = new Date(booking.startTime)
  const end = new Date(booking.endTime)

  return (
    <Card className="mt-8">
      <CardHeader className="border-b">
        <CardTitle>Meeting information</CardTitle>
        <CardDescription>Room, organizer, and schedule details.</CardDescription>
        <CardAction>
          <BookingStatusBadge booking={booking} now={now} />
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-7">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">Description</h2>
          <p className="mt-2 leading-6">
            {booking.description || 'No description was provided for this meeting.'}
          </p>
        </div>

        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <CalendarDays aria-hidden="true" size={15} />
              Date
            </dt>
            <dd className="mt-2 font-medium">{dateFormatter.format(start)}</dd>
          </div>

          <div>
            <dt className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <Clock3 aria-hidden="true" size={15} />
              Time
            </dt>
            <dd className="mt-2 font-medium">
              {timeFormatter.format(start)}&ndash;{timeFormatter.format(end)}
            </dd>
          </div>

          <div>
            <dt className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <MapPin aria-hidden="true" size={15} />
              Room
            </dt>
            <dd className="mt-2 font-medium">{room?.name ?? 'Unknown room'}</dd>
            {room ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Floor {room.floor} &middot; Capacity {room.capacity}
              </p>
            ) : null}
          </div>

          <div>
            <dt className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <Users aria-hidden="true" size={15} />
              Organizer
            </dt>
            <dd className="mt-2 font-medium">{employee?.name ?? 'Unknown organizer'}</dd>
            {employee ? (
              <p className="mt-1 text-xs text-muted-foreground">{employee.department}</p>
            ) : null}
          </div>

          <div>
            <dt className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <Mail aria-hidden="true" size={15} />
              Email
            </dt>
            <dd className="mt-2 font-medium">
              {employee ? (
                <a className="hover:underline" href={`mailto:${employee.email}`}>
                  {employee.email}
                </a>
              ) : (
                'Not available'
              )}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Created
            </dt>
            <dd className="mt-2 font-medium">
              {dateFormatter.format(new Date(booking.createdAt))}
            </dd>
          </div>
        </dl>

        {room?.amenities.length ? (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Room amenities</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
