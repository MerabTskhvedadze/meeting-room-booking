import { FilterPanel } from '@/components/FilterPanel'
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
    <FilterPanel
      ariaLabel="Room filters"
      hasFilters={hasFilters}
      onClear={onClear}
      onSearchChange={(value) => onFilterChange('search', value)}
      searchLabel="Search rooms"
      searchPlaceholder="Search by room or amenity"
      searchValue={search}
      title="Find the right room"
    >
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
    </FilterPanel>
  )
}
