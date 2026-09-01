import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Room } from '@/types/room'

interface BookingFiltersProps {
  rooms: Room[]
}

const ALL_OPTIONS = 'all-options'

export function BookingFilters({ rooms }: BookingFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const room = searchParams.get('room') ?? ''
  const status = searchParams.get('status') ?? ''
  const period = searchParams.get('period') ?? ''
  const hasFilters = Boolean(search || room || status || period)

  function updateFilter(name: string, value: string) {
    const nextParams = new URLSearchParams(searchParams)

    if (value && value !== ALL_OPTIONS) {
      nextParams.set(name, value)
    } else {
      nextParams.delete(name)
    }

    setSearchParams(nextParams, { replace: true })
  }

  return (
    <Card aria-label="Booking filters" className="mt-8" role="region">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal aria-hidden="true" size={17} />
          Find a booking
        </CardTitle>

        {hasFilters ? (
          <CardAction>
            <Button
              onClick={() => setSearchParams({}, { replace: true })}
              size="sm"
              type="button"
              variant="ghost"
            >
              <X aria-hidden="true" />
              Clear
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>

      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="relative md:col-span-2">
          <span className="sr-only">Search bookings</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 z-10 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            className="pl-9"
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Search meetings, rooms, or organizers"
            type="search"
            value={search}
          />
        </label>

        <Select
          onValueChange={(value) => updateFilter('room', value ?? '')}
          value={room || ALL_OPTIONS}
        >
          <SelectTrigger aria-label="Room" className="w-full">
            <SelectValue>
              {(value: string) =>
                value === ALL_OPTIONS
                  ? 'Any room'
                  : (rooms.find((item) => item.id === value)?.name ?? 'Any room')
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTIONS}>Any room</SelectItem>
            {rooms.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => updateFilter('status', value ?? '')}
          value={status || ALL_OPTIONS}
        >
          <SelectTrigger aria-label="Status" className="w-full">
            <SelectValue>
              {(value: string) => {
                if (value === 'confirmed') return 'Confirmed'
                if (value === 'cancelled') return 'Cancelled'
                return 'Any status'
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTIONS}>Any status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => updateFilter('period', value ?? '')}
          value={period || ALL_OPTIONS}
        >
          <SelectTrigger aria-label="Time period" className="w-full">
            <SelectValue>
              {(value: string) => {
                if (value === 'upcoming') return 'Upcoming & active'
                if (value === 'past') return 'Past'
                return 'Any time'
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTIONS}>Any time</SelectItem>
            <SelectItem value="upcoming">Upcoming &amp; active</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
