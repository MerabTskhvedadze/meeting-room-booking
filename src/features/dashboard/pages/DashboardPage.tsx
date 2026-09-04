import { CalendarDays, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { LoadError } from '@/components/LoadError'
import { PageHeader } from '@/components/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import { getBookings } from '@/services/bookingService'
import { getEmployees } from '@/services/employeeService'
import { getRooms } from '@/services/roomService'
import type { Booking } from '@/types/booking'
import type { Employee } from '@/types/employee'
import type { Room } from '@/types/room'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { isBookingActive, isBookingUpcoming } from '@/utils/booking'
import { fullDateFormatter, isSameLocalDay } from '@/utils/date'
import { DashboardLoading } from '../components/DashboardLoading'
import { DashboardMetrics } from '../components/DashboardMetrics'
import { RoomStatusCard } from '../components/RoomStatusCard'
import { UpcomingMeetingsCard } from '../components/UpcomingMeetingsCard'
import { getGreeting } from '../utils/date'

export function DashboardPage() {
  useDocumentTitle('Dashboard')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)

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
          setError('Dashboard data could not be loaded. Please try again.')
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
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const confirmedBookings = bookings.filter((booking) => booking.status === 'confirmed')
  const todayBookings = confirmedBookings.filter((booking) =>
    isSameLocalDay(new Date(booking.startTime), now),
  )
  const activeBookings = confirmedBookings.filter((booking) => isBookingActive(booking, now))
  const upcomingBookings = confirmedBookings
    .filter((booking) => isBookingUpcoming(booking, now))
    .sort((first, second) => Date.parse(first.startTime) - Date.parse(second.startTime))
  const upcomingThisWeek = upcomingBookings.filter(
    (booking) => Date.parse(booking.startTime) <= nextWeek.getTime(),
  )
  const occupiedRoomIds = new Set(activeBookings.map((booking) => booking.roomId))
  const totalSeats = rooms.reduce((total, room) => total + room.capacity, 0)

  function retryLoading() {
    setIsLoading(true)
    setError('')
    setLoadAttempt((attempt) => attempt + 1)
  }

  return (
    <section>
      <PageHeader
        actions={
          <>
            <Link className={buttonVariants({ variant: 'outline' })} to="/schedule">
              <CalendarDays aria-hidden="true" />
              View schedule
            </Link>
            <Link className={buttonVariants()} to="/bookings/new">
              <Plus aria-hidden="true" />
              New booking
            </Link>
          </>
        }
        description="See today's room activity and upcoming meetings at a glance."
        eyebrow={fullDateFormatter.format(now)}
        title={getGreeting(now.getHours())}
      />

      <div className="mt-8">
        {isLoading ? (
          <DashboardLoading />
        ) : error ? (
          <LoadError message={error} onRetry={retryLoading} />
        ) : (
          <>
            <DashboardMetrics
              availableRooms={rooms.length - occupiedRoomIds.size}
              occupiedRooms={occupiedRoomIds.size}
              rooms={rooms.length}
              seats={totalSeats}
              todayMeetings={todayBookings.length}
              upcomingMeetings={upcomingThisWeek.length}
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,1fr)]">
              <UpcomingMeetingsCard
                bookings={upcomingBookings}
                employees={employees}
                now={now}
                rooms={rooms}
              />
              <RoomStatusCard
                activeBookings={activeBookings}
                now={now}
                rooms={rooms}
                upcomingBookings={upcomingBookings}
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
