import { FilterPanel } from '@/components/FilterPanel'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Room } from '@/types/room'

interface BookingFiltersProps {
  onClear: () => void
  onFilterChange: (
    name: 'search' | 'room' | 'status' | 'period',
    value: string,
  ) => void
  period: string
  room: string
  rooms: Room[]
  search: string
  status: string
}

const ALL_OPTIONS = 'all-options'

export function BookingFilters({
  onClear,
  onFilterChange,
  period,
  room,
  rooms,
  search,
  status,
}: BookingFiltersProps) {
  const hasFilters = Boolean(search || room || status || period)

  return (
    <FilterPanel
      ariaLabel="Booking filters"
      hasFilters={hasFilters}
      onClear={onClear}
      onSearchChange={(value) => onFilterChange('search', value)}
      searchLabel="Search bookings"
      searchPlaceholder="Search meetings, rooms, or organizers"
      searchValue={search}
      title="Find a booking"
    >
        <Select
          onValueChange={(value) =>
            onFilterChange('room', value === ALL_OPTIONS ? '' : (value ?? ''))
          }
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
          onValueChange={(value) =>
            onFilterChange('status', value === ALL_OPTIONS ? '' : (value ?? ''))
          }
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
          onValueChange={(value) =>
            onFilterChange('period', value === ALL_OPTIONS ? '' : (value ?? ''))
          }
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
    </FilterPanel>
  )
}
