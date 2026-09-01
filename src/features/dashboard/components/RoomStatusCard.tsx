import { Users } from 'lucide-react'

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
import type { Room } from '@/types/room'
import { timeFormatter } from '@/utils/date'
import { formatMeetingDay } from '../utils/date'

interface RoomStatusCardProps {
  activeBookings: Booking[]
  now: Date
  rooms: Room[]
  upcomingBookings: Booking[]
}

export function RoomStatusCard({
  activeBookings,
  now,
  rooms,
  upcomingBookings,
}: RoomStatusCardProps) {
  const occupiedRoomIds = new Set(activeBookings.map((booking) => booking.roomId))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room status</CardTitle>
        <CardDescription>Current availability and the next meeting.</CardDescription>
        <CardAction>
          <Badge variant="secondary">
            {rooms.length - occupiedRoomIds.size}/{rooms.length} free
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {rooms.map((room) => {
          const activeBooking = activeBookings.find((booking) => booking.roomId === room.id)
          const nextBooking = upcomingBookings.find((booking) => booking.roomId === room.id)

          return (
            <div className="flex items-center gap-3" key={room.id}>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Users aria-hidden="true" size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{room.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  Floor {room.floor} &middot;{' '}
                  {nextBooking ? (
                    <>
                      Next {formatMeetingDay(new Date(nextBooking.startTime), now)} at{' '}
                      {timeFormatter.format(new Date(nextBooking.startTime))}
                    </>
                  ) : (
                    'No upcoming bookings'
                  )}
                </p>
              </div>
              <Badge variant={activeBooking ? 'default' : 'secondary'}>
                {activeBooking ? 'In use' : 'Available'}
              </Badge>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
