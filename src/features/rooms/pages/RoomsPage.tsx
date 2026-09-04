import { Building2 } from 'lucide-react'


import { EmptyState } from '@/components/EmptyState'
import { LoadError } from '@/components/LoadError'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useUrlState } from '@/hooks/use-url-state'
import { RoomCard } from '../components/RoomCard'
import { RoomFilters } from '../components/RoomFilters'
import { RoomsLoading } from '../components/RoomsLoading'
import { useRooms } from '../hooks/useRooms'
import { filterRooms } from '../utils/filterRooms'

export function RoomsPage() {
  useDocumentTitle('Rooms')
  const { data: rooms = [], error, isLoading, retry } = useRooms()
  const { clear: clearFilters, searchParams, setValue: updateFilter } = useUrlState()
  const roomList = rooms ?? []
  const filters = {
    amenity: searchParams.get('amenity') ?? '',
    capacity: searchParams.get('capacity') ?? '',
    floor: searchParams.get('floor') ?? '',
    search: searchParams.get('search') ?? '',
  }
  const filteredRooms = filterRooms(roomList, filters)


  return (
    <section>
      <PageHeader
        actions={
          !isLoading && !error ? (
            <Badge aria-live="polite" variant="secondary">
              {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
            </Badge>
          ) : null
        }
        description="Find a room that fits your team, floor, and equipment needs."
        eyebrow="Spaces"
        title="Meeting rooms"
      />

      <RoomFilters
        amenity={filters.amenity}
        capacity={filters.capacity}
        floor={filters.floor}
        onClear={clearFilters}
        onFilterChange={updateFilter}
        rooms={roomList}
        search={filters.search}
      />

      {isLoading ? (
        <RoomsLoading />
      ) : error ? (
        <LoadError className="mt-6" message={error} onRetry={retry} />
      ) : filteredRooms.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <EmptyState
          actionLabel="Clear all filters"
          className="mt-6"
          description="Try changing your search or clearing the selected filters."
          icon={<Building2 aria-hidden="true" size={22} />}
          onAction={clearFilters}
          title="No rooms match your filters"
        />
      )}
    </section>
  )
}
