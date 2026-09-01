import { Search, SlidersHorizontal, X } from 'lucide-react'

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
  amenity: string
  capacity: string
  floor: string
  onClear: () => void
  onFilterChange: (
    name: 'search' | 'floor' | 'capacity' | 'amenity',
    value: string,
  ) => void
  rooms: Room[]
  search: string
}

const ALL_OPTIONS = 'all-options'

export function RoomFilters({
  amenity,
  capacity,
  floor,
  onClear,
  onFilterChange,
  rooms,
  search,
}: RoomFiltersProps) {
  const floors = [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b)
  const capacities = [...new Set(rooms.map((room) => room.capacity))].sort(
    (a, b) => a - b,
  )
  const amenities = [...new Set(rooms.flatMap((room) => room.amenities))].sort()
  const hasFilters = Boolean(search || floor || capacity || amenity)

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
              onClick={onClear}
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
            onChange={(event) => onFilterChange('search', event.target.value)}
            placeholder="Search by room or amenity"
            type="search"
            value={search}
          />
        </label>

        <Select
          onValueChange={(value) =>
            onFilterChange('floor', value === ALL_OPTIONS ? '' : (value ?? ''))
          }
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
          onValueChange={(value) =>
            onFilterChange('capacity', value === ALL_OPTIONS ? '' : (value ?? ''))
          }
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
          onValueChange={(value) =>
            onFilterChange('amenity', value === ALL_OPTIONS ? '' : (value ?? ''))
          }
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
