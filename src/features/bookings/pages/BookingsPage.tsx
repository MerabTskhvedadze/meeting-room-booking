import { CalendarX2, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { LoadError } from '@/components/LoadError'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { getBookings } from '@/services/bookingService'
import { getEmployees } from '@/services/employeeService'
import { getRooms } from '@/services/roomService'
import type { Booking } from '@/types/booking'
import type { Employee } from '@/types/employee'
import type { Room } from '@/types/room'
import { isBookingPast } from '@/utils/booking'
import { BookingFilters } from '../components/BookingFilters'
import { BookingsLoading } from '../components/BookingsLoading'
import { BookingsList } from '../components/BookingsList'

export function BookingsPage() {
  useDocumentTitle('Bookings')
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
  const searchValue = searchParams.get('search') ?? ''
  const selectedRoom = searchParams.get('room') ?? ''
  const selectedStatus = searchParams.get('status') ?? ''
  const selectedPeriod = searchParams.get('period') ?? ''
  const search = searchValue.trim().toLowerCase()
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
      const bookingIsPast = isBookingPast(booking, now)
      const matchesPeriod =
        !selectedPeriod ||
        (selectedPeriod === 'upcoming' && !bookingIsPast) ||
        (selectedPeriod === 'past' && bookingIsPast)

      return matchesSearch && matchesRoom && matchesStatus && matchesPeriod
    })
    .sort((first, second) => {
      const firstIsCurrentOrUpcoming = !isBookingPast(first, now)
      const secondIsCurrentOrUpcoming = !isBookingPast(second, now)

      if (firstIsCurrentOrUpcoming !== secondIsCurrentOrUpcoming) {
        return firstIsCurrentOrUpcoming ? -1 : 1
      }

      return firstIsCurrentOrUpcoming
        ? Date.parse(first.startTime) - Date.parse(second.startTime)
        : Date.parse(second.startTime) - Date.parse(first.startTime)
    })

  function retryLoading() {
    setIsLoading(true)
    setError('')
    setLoadAttempt((attempt) => attempt + 1)
  }

  function updateFilter(name: string, value: string) {
    const nextParams = new URLSearchParams(searchParams)

    if (value) {
      nextParams.set(name, value)
    } else {
      nextParams.delete(name)
    }

    setSearchParams(nextParams, { replace: true })
  }

  function clearFilters() {
    setSearchParams({}, { replace: true })
  }

  return (
    <section>
      <PageHeader
        actions={
          <Link className={buttonVariants()} to="/bookings/new">
            <Plus aria-hidden="true" />
            New booking
          </Link>
        }
        description="Search, review, and manage scheduled meetings."
        eyebrow="Meetings"
        title="Bookings"
      />

      <BookingFilters
        onClear={clearFilters}
        onFilterChange={updateFilter}
        period={selectedPeriod}
        room={selectedRoom}
        rooms={rooms}
        search={searchValue}
        status={selectedStatus}
      />

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
          onAction={clearFilters}
          title="No bookings match your filters"
        />
      )}
    </section>
  )
}
