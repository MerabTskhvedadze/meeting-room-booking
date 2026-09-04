import { Building2, Plus } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { LoadError } from '@/components/LoadError'
import { PageHeader } from '@/components/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useUrlState } from '@/hooks/use-url-state'
import { indexById } from '@/utils/collection'
import { toLocalDateValue } from '@/utils/date'
import { ScheduleBookingDrawer } from '../components/ScheduleBookingDrawer'
import { ScheduleCalendar } from '../components/ScheduleCalendar'
import {
  ALL_ROOMS_VALUE,
  ScheduleControls,
  type ScheduleView,
} from '../components/ScheduleControls'
import { ScheduleLoading } from '../components/ScheduleLoading'
import { useScheduleData } from '../hooks/useScheduleData'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

function isValidDateValue(value: string) {
  if (!datePattern.test(value)) return false
  const date = new Date(`${value}T00:00:00`)
  return !Number.isNaN(date.getTime()) && toLocalDateValue(date) === value
}

export function SchedulePage() {
  useDocumentTitle('Schedule')
  const navigate = useNavigate()
  const { searchParams, setSearchParams, setValue: updateSchedule } = useUrlState()
  const { data, error, isLoading, retry } = useScheduleData()
  const bookings = useMemo(() => data?.bookings ?? [], [data?.bookings])
  const employees = useMemo(() => data?.employees ?? [], [data?.employees])
  const rooms = useMemo(() => data?.rooms ?? [], [data?.rooms])

  useEffect(() => {
    if (!data) return

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)
      const requestedRoom = nextParams.get('room') ?? ''
      const requestedView = nextParams.get('view')
      const requestedDate = nextParams.get('date') ?? ''
      const requestedBooking = nextParams.get('booking') ?? ''

      if (
        requestedRoom !== ALL_ROOMS_VALUE &&
        !rooms.some((room) => room.id === requestedRoom)
      ) {
        nextParams.set('room', ALL_ROOMS_VALUE)
      }
      if (requestedView !== 'day' && requestedView !== 'week') {
        nextParams.set('view', 'week')
      }
      if (!isValidDateValue(requestedDate)) {
        nextParams.set('date', toLocalDateValue(new Date()))
      }
      if (requestedBooking && !bookings.some((booking) => booking.id === requestedBooking)) {
        nextParams.delete('booking')
      }

      return nextParams
    }, { replace: true })
  }, [bookings, data, rooms, setSearchParams])

  const roomValue = searchParams.get('room') ?? ALL_ROOMS_VALUE
  const view: ScheduleView = searchParams.get('view') === 'day' ? 'day' : 'week'
  const requestedDate = searchParams.get('date') ?? ''
  const date = isValidDateValue(requestedDate)
    ? requestedDate
    : toLocalDateValue(new Date())
  const roomById = useMemo(() => indexById(rooms), [rooms])
  const employeeById = useMemo(() => indexById(employees), [employees])
  const selectedRoom = roomById.get(roomValue)
  const selectedBooking = bookings.find(
    (booking) => booking.id === (searchParams.get('booking') ?? ''),
  ) ?? null
  const isAllRooms = roomValue === ALL_ROOMS_VALUE
  const visibleBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.status === 'confirmed' &&
          (isAllRooms || booking.roomId === selectedRoom?.id),
      ),
    [bookings, isAllRooms, selectedRoom?.id],
  )


  function changeView(nextView: ScheduleView) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)
      nextParams.set('view', nextView)

      if (nextView === 'day') {
        nextParams.set('date', toLocalDateValue(new Date()))
      }

      return nextParams
    }, { replace: true })
  }

  return (
    <section>
      <PageHeader
        actions={
          <Link
            className={buttonVariants()}
            to={selectedRoom ? `/bookings/new?room=${selectedRoom.id}` : '/bookings/new'}
          >
            <Plus aria-hidden="true" />
            New booking
          </Link>
        }
        description="Review confirmed meetings and find open time for each room."
        eyebrow="Availability"
        title="Room schedule"
      />

      {isLoading ? (
        <ScheduleLoading />
      ) : error ? (
        <LoadError className="mt-6" message={error} onRetry={retry} />
      ) : rooms.length === 0 ? (
        <EmptyState
          actionLabel="View rooms"
          className="mt-6"
          description="Add a meeting room before opening the schedule."
          icon={<Building2 aria-hidden="true" size={22} />}
          onAction={() => navigate('/rooms')}
          title="No rooms available"
        />
      ) : (
        <>
          <ScheduleControls
            onRoomChange={(value) => updateSchedule('room', value)}
            onViewChange={changeView}
            room={selectedRoom}
            roomValue={roomValue}
            rooms={rooms}
            view={view}
          />
          <ScheduleCalendar
            bookings={visibleBookings}
            date={date}
            onDateChange={(value) => updateSchedule('date', value)}
            onOpenBooking={(bookingId) => updateSchedule('booking', bookingId)}
            roomName={selectedRoom?.name ?? 'All meeting rooms'}
            rooms={rooms}
            showRoomNames={isAllRooms}
            view={view}
          />
        </>
      )}

      <ScheduleBookingDrawer
        booking={selectedBooking}
        employee={selectedBooking ? employeeById.get(selectedBooking.employeeId) : undefined}
        onClose={() => updateSchedule('booking', '')}
        room={selectedBooking ? roomById.get(selectedBooking.roomId) : undefined}
      />
    </section>
  )
}
