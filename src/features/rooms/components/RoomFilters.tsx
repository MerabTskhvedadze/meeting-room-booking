import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import type { Room } from '../../../types/room'

interface RoomFiltersProps {
  rooms: Room[]
}

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

    if (value) {
      nextParams.set(name, value)
    } else {
      nextParams.delete(name)
    }

    setSearchParams(nextParams, { replace: true })
  }

  return (
    <section
      aria-label="Room filters"
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <SlidersHorizontal aria-hidden="true" size={17} />
          Find the right room
        </div>

        {hasFilters ? (
          <button
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900"
            onClick={() => setSearchParams({}, { replace: true })}
            type="button"
          >
            <X aria-hidden="true" size={15} />
            Clear
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="relative md:col-span-2">
          <span className="sr-only">Search rooms</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:outline-none"
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Search by room or amenity"
            type="search"
            value={search}
          />
        </label>

        <label>
          <span className="sr-only">Floor</span>
          <select
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 hover:border-slate-400 focus:border-indigo-500 focus:outline-none"
            onChange={(event) => updateFilter('floor', event.target.value)}
            value={floor}
          >
            <option value="">Any floor</option>
            {floors.map((floorNumber) => (
              <option key={floorNumber} value={floorNumber}>
                Floor {floorNumber}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Minimum capacity</span>
          <select
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 hover:border-slate-400 focus:border-indigo-500 focus:outline-none"
            onChange={(event) => updateFilter('capacity', event.target.value)}
            value={capacity}
          >
            <option value="">Any capacity</option>
            {capacities.map((roomCapacity) => (
              <option key={roomCapacity} value={roomCapacity}>
                {roomCapacity}+ people
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Amenity</span>
          <select
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 hover:border-slate-400 focus:border-indigo-500 focus:outline-none"
            onChange={(event) => updateFilter('amenity', event.target.value)}
            value={amenity}
          >
            <option value="">Any amenity</option>
            {amenities.map((roomAmenity) => (
              <option key={roomAmenity} value={roomAmenity}>
                {roomAmenity}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  )
}
