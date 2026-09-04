import { CalendarX2, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { LoadError } from '@/components/LoadError'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useUrlState } from '@/hooks/use-url-state'
import { useWorkspaceData } from '@/hooks/use-workspace-data'
import type { BookingStatus } from '@/types/booking'
import { BookingFilters } from '../components/BookingFilters'
import { BookingsLoading } from '../components/BookingsLoading'
import { BookingsList } from '../components/BookingsList'

import {
  filterAndSortBookings,
  type BookingPeriod,
} from '../utils/filterBookings'

export function BookingsPage() {
  useDocumentTitle('Bookings')
  const { data, error, isLoading, retry } = useWorkspaceData()
  const { clear: clearFilters, searchParams, setValue: updateFilter } = useUrlState()
  const bookings = data?.bookings ?? []
  const employees = data?.employees ?? []
  const rooms = data?.rooms ?? []
  const filters = {
    period: (searchParams.get('period') ?? '') as BookingPeriod,
    roomId: searchParams.get('room') ?? '',
    search: searchParams.get('search') ?? '',
    status: (searchParams.get('status') ?? '') as BookingStatus | '',
  }
  const now = new Date()
  const filteredBookings = filterAndSortBookings(bookings, rooms, employees, filters, now)


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
        period={filters.period}
        room={filters.roomId}
        rooms={rooms}
        search={filters.search}
        status={filters.status}
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
        <LoadError className="mt-6" message={error} onRetry={retry} />
      ) : filteredBookings.length > 0 ? (
        <BookingsList bookings={filteredBookings} employees={employees} now={now} rooms={rooms} />
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
