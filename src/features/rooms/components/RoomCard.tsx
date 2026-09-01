import { ArrowRight, Building2, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Room } from '../../../types/room'

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
          <Building2 aria-hidden="true" size={21} />
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          Meeting room
        </span>
      </div>

      <h2 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">
        {room.name}
      </h2>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <MapPin aria-hidden="true" size={16} />
          Floor {room.floor}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users aria-hidden="true" size={16} />
          Up to {room.capacity}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" aria-label="Room amenities">
        {room.amenities.map((amenity) => (
          <span
            className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
            key={amenity}
          >
            {amenity}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 transition-colors hover:text-indigo-900"
          to={`/schedule?room=${room.id}`}
        >
          Check schedule
          <ArrowRight
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
            size={16}
          />
        </Link>
      </div>
    </article>
  )
}
