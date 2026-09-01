import { Building2, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getRooms } from '@/services/roomService'
import type { Room } from '@/types/room'
import { RoomCard } from '../components/RoomCard'
import { RoomFilters } from '../components/RoomFilters'

const loadingCards = ['loading-1', 'loading-2', 'loading-3']

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
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading rooms">
          {loadingCards.map((card) => (
            <Card aria-hidden="true" className="h-72" key={card}>
              <CardContent>
                <Skeleton className="size-10 rounded-lg" />
                <Skeleton className="mt-5 h-5 w-2/3" />
                <Skeleton className="mt-4 h-4 w-1/2" />
                <div className="mt-6 flex gap-2">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="mt-6 border-destructive/20 bg-destructive/5 text-center ring-destructive/20">
          <CardContent className="py-6">
            <p className="font-semibold text-destructive">{error}</p>
            <Button
              className="mt-4"
              onClick={() => {
                setIsLoading(true)
                setError('')
                setLoadAttempt((attempt) => attempt + 1)
              }}
              type="button"
              variant="destructive"
            >
              <RotateCcw aria-hidden="true" />
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : filteredRooms.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <Card className="mt-6 border-dashed text-center">
          <CardContent className="py-10">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Building2 aria-hidden="true" size={22} />
            </div>
            <h2 className="mt-4 text-lg font-semibold">No rooms match your filters</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or clearing the selected filters.
            </p>
            <Button
              className="mt-4"
              onClick={() => setSearchParams({}, { replace: true })}
              type="button"
              variant="outline"
            >
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
