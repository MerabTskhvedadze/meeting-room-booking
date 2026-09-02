import { Building2, CalendarDays, Clock3, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Room } from '@/types/room'

export type ScheduleView = 'day' | 'week'
export const ALL_ROOMS_VALUE = 'all'

type ScheduleControlsProps = {
  onRoomChange: (roomId: string) => void
  onViewChange: (view: ScheduleView) => void
  room?: Room
  roomValue: string
  rooms: Room[]
  view: ScheduleView
}

export function ScheduleControls({
  onRoomChange,
  onViewChange,
  room,
  roomValue,
  rooms,
  view,
}: ScheduleControlsProps) {
  return (
    <Card className="mt-6">
      <CardContent className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-4 sm:grid-cols-[minmax(220px,320px)_1fr] sm:items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="schedule-room">
              Meeting room
            </label>
            <Select
              onValueChange={(value) => onRoomChange(value ?? ALL_ROOMS_VALUE)}
              value={roomValue}
            >
              <SelectTrigger
                aria-label="Meeting room"
                className="w-full"
                id="schedule-room"
              >
                <SelectValue>
                  {(value: string) =>
                    value === ALL_ROOMS_VALUE
                      ? 'All meeting rooms'
                      : rooms.find((candidate) => candidate.id === value)?.name
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_ROOMS_VALUE}>All meeting rooms</SelectItem>
                {rooms.map((candidate) => (
                  <SelectItem key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {room ? (
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays aria-hidden="true" size={15} />
                Floor {room.floor}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users aria-hidden="true" size={15} />
                Up to {room.capacity} people
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 aria-hidden="true" size={15} />
                Empty slots are available
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Building2 aria-hidden="true" size={15} />
                {rooms.length} meeting rooms
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 aria-hidden="true" size={15} />
                Choose a room to check exact availability
              </span>
            </div>
          )}
        </div>

        <div aria-label="Schedule view" className="flex gap-1" role="group">
          <Button
            aria-pressed={view === 'day'}
            onClick={() => onViewChange('day')}
            type="button"
            variant={view === 'day' ? 'default' : 'outline'}
          >
            Day
          </Button>
          <Button
            aria-pressed={view === 'week'}
            onClick={() => onViewChange('week')}
            type="button"
            variant={view === 'week' ? 'default' : 'outline'}
          >
            Week
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
