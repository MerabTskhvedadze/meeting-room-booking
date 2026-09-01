import { CalendarX2, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { LoadError } from '@/components/LoadError'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { getBookings } from '@/services/bookingService'
import { getEmployees } from '@/services/employeeService'
import { getRooms } from '@/services/roomService'
import type { Booking } from '@/types/booking'
import type { Employee } from '@/types/employee'
import type { Room } from '@/types/room'
import { BookingFilters } from '../components/BookingFilters'
import { BookingsLoading } from '../components/BookingsLoading'
import { BookingsList } from '../components/BookingsList'

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    let shouldUpdate = true

    Promise.all([getBookings(), getRooms(), getEmployees()])
      .then(([loadedBookings, loadedRooms, loadedEmployees]) => {
        if (shouldUpdate) {
          setBookings(loadedBookings)
          setRooms(loadedRooms)
          setEmployees(loadedEmployees)
        }
      })
      .catch(() => {
        if (shouldUpdate) {
          setError('Bookings could not be loaded. Please try again.')
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

  const now = new Date()
  const search = (searchParams.get('search') ?? '').trim().toLowerCase()
  const selectedRoom = searchParams.get('room') ?? ''
  const selectedStatus = searchParams.get('status') ?? ''
  const selectedPeriod = searchParams.get('period') ?? ''
  const roomById = new Map(rooms.map((room) => [room.id, room]))
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]))

  const filteredBookings = bookings
    .filter((booking) => {
      const room = roomById.get(booking.roomId)
      const employee = employeeById.get(booking.employeeId)
      const searchableText = [
        booking.title,
        booking.description,
        room?.name,
        employee?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const matchesSearch = !search || searchableText.includes(search)
      const matchesRoom = !selectedRoom || booking.roomId === selectedRoom
      const matchesStatus = !selectedStatus || booking.status === selectedStatus
      const matchesPeriod =
        !selectedPeriod ||
        (selectedPeriod === 'upcoming' && Date.parse(booking.endTime) > now.getTime()) ||
        (selectedPeriod === 'past' && Date.parse(booking.endTime) <= now.getTime())

      return matchesSearch && matchesRoom && matchesStatus && matchesPeriod
    })
    .sort((first, second) => {
      const firstIsUpcoming = Date.parse(first.endTime) > now.getTime()
      const secondIsUpcoming = Date.parse(second.endTime) > now.getTime()

      if (firstIsUpcoming !== secondIsUpcoming) {
        return firstIsUpcoming ? -1 : 1
      }

      return firstIsUpcoming
        ? Date.parse(first.startTime) - Date.parse(second.startTime)
        : Date.parse(second.startTime) - Date.parse(first.startTime)
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
          <p className="text-sm font-semibold text-primary">Meetings</p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">Bookings</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Search, review, and manage scheduled meetings.
          </p>
        </div>

        <Link className={buttonVariants()} to="/bookings/new">
          <Plus aria-hidden="true" />
          New booking
        </Link>
      </div>

      <BookingFilters rooms={rooms} />

      {!isLoading && !error ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">Sorted by meeting time</p>
          <Badge aria-live="polite" variant="secondary">
            {filteredBookings.length}{' '}
            {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
          </Badge>
        </div>
      ) : null}

      {isLoading ? (
        <BookingsLoading />
      ) : error ? (
        <LoadError className="mt-6" message={error} onRetry={retryLoading} />
      ) : filteredBookings.length > 0 ? (
        <BookingsList
          bookings={filteredBookings}
          employees={employees}
          now={now}
          rooms={rooms}
        />
      ) : (
        <EmptyState
          actionLabel="Clear all filters"
          className="mt-6"
          description="Try changing your search or clearing the selected filters."
          icon={<CalendarX2 aria-hidden="true" size={22} />}
          onAction={() => setSearchParams({}, { replace: true })}
          title="No bookings match your filters"
        />
      )}
    </section>
  )
}
