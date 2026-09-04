import { Building2, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { LoadError } from '@/components/LoadError'
import { PageHeader } from '@/components/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import { getBookings } from '@/services/bookingService'
import { getRooms } from '@/services/roomService'
import type { Booking } from '@/types/booking'
import type { Room } from '@/types/room'
import { toLocalDateValue } from '@/utils/date'
import { ScheduleCalendar } from '../components/ScheduleCalendar'
import {
  ALL_ROOMS_VALUE,
  ScheduleControls,
  type ScheduleView,
} from '../components/ScheduleControls'
import { ScheduleLoading } from '../components/ScheduleLoading'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

function isValidDateValue(value: string) {
  if (!datePattern.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00`)

  return !Number.isNaN(date.getTime()) && toLocalDateValue(date) === value
}

export function SchedulePage() {
  useDocumentTitle('Schedule')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    let shouldUpdate = true

    Promise.all([getRooms(), getBookings()])
      .then(([loadedRooms, loadedBookings]) => {
        if (!shouldUpdate) {
          return
        }

        setRooms(loadedRooms)
        setBookings(loadedBookings)

        setSearchParams((currentParams) => {
          const nextParams = new URLSearchParams(currentParams)
          const requestedRoom = nextParams.get('room') ?? ''
          const requestedView = nextParams.get('view')
          const requestedDate = nextParams.get('date') ?? ''

          if (
            requestedRoom !== ALL_ROOMS_VALUE &&
            !loadedRooms.some((room) => room.id === requestedRoom)
          ) {
            nextParams.set('room', ALL_ROOMS_VALUE)
          }

          if (requestedView !== 'day' && requestedView !== 'week') {
            nextParams.set('view', 'week')
          }

          if (!isValidDateValue(requestedDate)) {
            nextParams.set('date', toLocalDateValue(new Date()))
          }

          return nextParams
        }, { replace: true })
      })
      .catch(() => {
        if (shouldUpdate) {
          setError('The room schedule could not be loaded. Please try again.')
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
  }, [loadAttempt, setSearchParams])

  const roomValue = searchParams.get('room') ?? ALL_ROOMS_VALUE
  const view: ScheduleView = searchParams.get('view') === 'day' ? 'day' : 'week'
  const requestedDate = searchParams.get('date') ?? ''
  const date = isValidDateValue(requestedDate)
    ? requestedDate
    : toLocalDateValue(new Date())
  const selectedRoom = rooms.find((room) => room.id === roomValue)
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

  function retryLoading() {
    setIsLoading(true)
    setError('')
    setLoadAttempt((attempt) => attempt + 1)
  }

  function updateSchedule(name: 'date' | 'room' | 'view', value: string) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set(name, value)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <section>
      <PageHeader
        actions={
          <Link
            className={buttonVariants()}
            to={
              selectedRoom ? `/bookings/new?room=${selectedRoom.id}` : '/bookings/new'
            }
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
        <LoadError className="mt-6" message={error} onRetry={retryLoading} />
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
            onViewChange={(value) => updateSchedule('view', value)}
            room={selectedRoom}
            roomValue={roomValue}
            rooms={rooms}
            view={view}
          />
          <ScheduleCalendar
            bookings={visibleBookings}
            date={date}
            onDateChange={(value) => updateSchedule('date', value)}
            onOpenBooking={(bookingId) => navigate(`/bookings/${bookingId}`)}
            roomName={selectedRoom?.name ?? 'All meeting rooms'}
            rooms={rooms}
            showRoomNames={isAllRooms}
            view={view}
          />
        </>
      )}
    </section>
  )
}
