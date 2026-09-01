import { ArrowRight, CalendarDays, Clock3, MapPin, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Booking } from '@/types/booking'
import type { Employee } from '@/types/employee'
import type { Room } from '@/types/room'
import { dateFormatter, timeFormatter } from '@/utils/date'

interface BookingCardProps {
  booking: Booking
  employee?: Employee
  now: Date
  room?: Room
}

function getBookingState(booking: Booking, now: Date) {
  if (booking.status === 'cancelled') {
    return { label: 'Cancelled', variant: 'destructive' as const }
  }

  if (Date.parse(booking.endTime) <= now.getTime()) {
    return { label: 'Past', variant: 'outline' as const }
  }

  if (Date.parse(booking.startTime) <= now.getTime()) {
    return { label: 'In progress', variant: 'default' as const }
  }

  return { label: 'Upcoming', variant: 'secondary' as const }
}

export function BookingCard({ booking, employee, now, room }: BookingCardProps) {
  const start = new Date(booking.startTime)
  const end = new Date(booking.endTime)
  const bookingState = getBookingState(booking, now)

  return (
    <Card className="group transition hover:ring-primary/20 hover:shadow-sm">
      <CardContent>
        <Link
          aria-label={`View ${booking.title}`}
          className="grid gap-4 md:grid-cols-[minmax(11rem,0.8fr)_minmax(0,1.6fr)_minmax(10rem,0.8fr)_auto] md:items-center"
          to={`/bookings/${booking.id}`}
        >
          <div>
            <p className="flex items-center gap-2 text-sm font-medium">
              <CalendarDays aria-hidden="true" className="text-muted-foreground" size={16} />
              {dateFormatter.format(start)}
            </p>
            <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock3 aria-hidden="true" size={15} />
              {timeFormatter.format(start)}&ndash;{timeFormatter.format(end)}
            </p>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate font-heading text-base font-medium group-hover:underline">
                {booking.title}
              </h2>
              <Badge variant={bookingState.variant}>{bookingState.label}</Badge>
            </div>
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
              {booking.description || 'No description provided.'}
            </p>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin aria-hidden="true" size={16} />
              <span className="truncate">{room?.name ?? 'Unknown room'}</span>
            </p>
            <p className="flex items-center gap-2">
              <UserRound aria-hidden="true" size={16} />
              <span className="truncate">{employee?.name ?? 'Unknown organizer'}</span>
            </p>
          </div>

          <ArrowRight
            aria-hidden="true"
            className="hidden text-muted-foreground transition-transform group-hover:translate-x-0.5 md:block"
            size={18}
          />
        </Link>
      </CardContent>
    </Card>
  )
}
