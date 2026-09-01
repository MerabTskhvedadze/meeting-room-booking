import { ArrowRight, Building2, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Room } from '@/types/room'

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card
      aria-labelledby={`room-${room.id}-title`}
      className="group h-full transition hover:-translate-y-0.5 hover:ring-primary/20 hover:shadow-md"
      role="article"
    >
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2 aria-hidden="true" size={21} />
        </div>
        <CardAction>
          <Badge variant="secondary">Meeting room</Badge>
        </CardAction>
        <CardTitle className="mt-3 text-lg" id={`room-${room.id}-title`}>
          {room.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden="true" size={16} />
            Floor {room.floor}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users aria-hidden="true" size={16} />
            Up to {room.capacity}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" aria-label="Room amenities">
          {room.amenities.map((amenity) => (
            <Badge key={amenity} variant="outline">
              {amenity}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Link
          className={buttonVariants({ variant: 'ghost' })}
          to={`/schedule?room=${room.id}`}
        >
          Check schedule
          <ArrowRight
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </CardFooter>
    </Card>
  )
}
