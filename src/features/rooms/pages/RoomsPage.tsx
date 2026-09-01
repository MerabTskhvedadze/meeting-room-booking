import { Building2, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { getRooms } from '../../../services/roomService'
import type { Room } from '../../../types/room'
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
          <p className="text-sm font-semibold text-indigo-600">Spaces</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Meeting rooms</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Find a room that fits your team, floor, and equipment needs.
          </p>
        </div>

        {!isLoading && !error ? (
          <p aria-live="polite" className="text-sm font-medium text-slate-500">
            {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
          </p>
        ) : null}
      </div>

      <RoomFilters rooms={rooms} />

      {isLoading ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading rooms">
          {loadingCards.map((card) => (
            <div
              className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              key={card}
            >
              <div className="size-11 rounded-xl bg-slate-200" />
              <div className="mt-5 h-5 w-2/3 rounded bg-slate-200" />
              <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
              <div className="mt-6 flex gap-2">
                <div className="h-7 w-24 rounded bg-slate-100" />
                <div className="h-7 w-20 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center">
          <p className="font-semibold text-rose-900">{error}</p>
          <button
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm ring-1 ring-rose-200 hover:bg-rose-100"
            onClick={() => {
              setIsLoading(true)
              setError('')
              setLoadAttempt((attempt) => attempt + 1)
            }}
            type="button"
          >
            <RotateCcw aria-hidden="true" size={16} />
            Try again
          </button>
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Building2 aria-hidden="true" size={22} />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No rooms match your filters</h2>
          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or clearing the selected filters.
          </p>
          <button
            className="mt-5 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
            onClick={() => setSearchParams({}, { replace: true })}
            type="button"
          >
            Clear all filters
          </button>
        </div>
      )}
    </section>
  )
}
