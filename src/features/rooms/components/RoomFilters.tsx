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

interface RoomFiltersProps {
  rooms: Room[]
}

const ALL_OPTIONS = 'all-options'

export function RoomFilters({ rooms }: RoomFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const floor = searchParams.get('floor') ?? ''
  const capacity = searchParams.get('capacity') ?? ''
  const amenity = searchParams.get('amenity') ?? ''

  const floors = [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b)
  const capacities = [...new Set(rooms.map((room) => room.capacity))].sort(
    (a, b) => a - b,
  )
  const amenities = [...new Set(rooms.flatMap((room) => room.amenities))].sort()
  const hasFilters = Boolean(search || floor || capacity || amenity)

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
    <Card aria-label="Room filters" className="mt-8" role="region">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal aria-hidden="true" size={17} />
          Find the right room
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
          <span className="sr-only">Search rooms</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 z-10 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            className="pl-9"
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Search by room or amenity"
            type="search"
            value={search}
          />
        </label>

        <Select
          onValueChange={(value) => updateFilter('floor', value ?? '')}
          value={floor || ALL_OPTIONS}
        >
          <SelectTrigger aria-label="Floor" className="w-full">
            <SelectValue>
              {(value: string) => (value === ALL_OPTIONS ? 'Any floor' : `Floor ${value}`)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTIONS}>Any floor</SelectItem>
            {floors.map((floorNumber) => (
              <SelectItem key={floorNumber} value={String(floorNumber)}>
                Floor {floorNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => updateFilter('capacity', value ?? '')}
          value={capacity || ALL_OPTIONS}
        >
          <SelectTrigger aria-label="Minimum capacity" className="w-full">
            <SelectValue>
              {(value: string) =>
                value === ALL_OPTIONS ? 'Any capacity' : `${value}+ people`
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTIONS}>Any capacity</SelectItem>
            {capacities.map((roomCapacity) => (
              <SelectItem key={roomCapacity} value={String(roomCapacity)}>
                {roomCapacity}+ people
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => updateFilter('amenity', value ?? '')}
          value={amenity || ALL_OPTIONS}
        >
          <SelectTrigger aria-label="Amenity" className="w-full">
            <SelectValue>
              {(value: string) => (value === ALL_OPTIONS ? 'Any amenity' : value)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTIONS}>Any amenity</SelectItem>
            {amenities.map((roomAmenity) => (
              <SelectItem key={roomAmenity} value={roomAmenity}>
                {roomAmenity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
