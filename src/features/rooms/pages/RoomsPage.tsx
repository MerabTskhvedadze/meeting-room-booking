import { Building2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { LoadError } from '@/components/LoadError'
import { Badge } from '@/components/ui/badge'
import { getRooms } from '@/services/roomService'
import type { Room } from '@/types/room'
import { RoomCard } from '../components/RoomCard'
import { RoomFilters } from '../components/RoomFilters'
import { RoomsLoading } from '../components/RoomsLoading'

export function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    let shouldUpdate = true

    getRooms()
      .then((loadedRooms) => {
        if (shouldUpdate) {
          setRooms(loadedRooms)
        }
      })
      .catch(() => {
        if (shouldUpdate) {
          setError('Rooms could not be loaded. Please try again.')
        }
      })
      .finally(() => {
        if (shouldUpdate) {
          setIsLoading(false)
        }
      })

    return () => {
      shouldUpdate = false
    }
  }, [loadAttempt])

  const search = (searchParams.get('search') ?? '').trim().toLowerCase()
  const floor = Number(searchParams.get('floor'))
  const minimumCapacity = Number(searchParams.get('capacity'))
  const amenity = searchParams.get('amenity') ?? ''

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      !search ||
      room.name.toLowerCase().includes(search) ||
      room.amenities.some((item) => item.toLowerCase().includes(search))
    const matchesFloor = !floor || room.floor === floor
    const matchesCapacity = !minimumCapacity || room.capacity >= minimumCapacity
    const matchesAmenity = !amenity || room.amenities.includes(amenity)

    return matchesSearch && matchesFloor && matchesCapacity && matchesAmenity
  })

  function retryLoading() {
    setIsLoading(true)
    setError('')
    setLoadAttempt((attempt) => attempt + 1)
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">Spaces</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Meeting rooms</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Find a room that fits your team, floor, and equipment needs.
          </p>
        </div>

        {!isLoading && !error ? (
          <Badge aria-live="polite" variant="secondary">
            {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
          </Badge>
        ) : null}
      </div>

      <RoomFilters rooms={rooms} />

      {isLoading ? (
        <RoomsLoading />
      ) : error ? (
        <LoadError className="mt-6" message={error} onRetry={retryLoading} />
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
          onAction={() => setSearchParams({}, { replace: true })}
          title="No rooms match your filters"
        />
      )}
    </section>
  )
}
