import { CalendarDays, Plus, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getBookings } from '@/services/bookingService'
import { getEmployees } from '@/services/employeeService'
import { getRooms } from '@/services/roomService'
import type { Booking } from '@/types/booking'
import type { Employee } from '@/types/employee'
import type { Room } from '@/types/room'
import { DashboardLoading } from '../components/DashboardLoading'
import { DashboardMetrics } from '../components/DashboardMetrics'
import { RoomStatusCard } from '../components/RoomStatusCard'
import { UpcomingMeetingsCard } from '../components/UpcomingMeetingsCard'
import { fullDateFormatter, getGreeting, isSameLocalDay } from '../utils/date'

export function DashboardPage() {
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
  const activeBookings = confirmedBookings.filter(
    (booking) =>
      Date.parse(booking.startTime) <= now.getTime() &&
      Date.parse(booking.endTime) > now.getTime(),
  )
  const upcomingBookings = confirmedBookings
    .filter((booking) => Date.parse(booking.startTime) > now.getTime())
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
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">{fullDateFormatter.format(now)}</p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
            {getGreeting(now.getHours())}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            See today&apos;s room activity and upcoming meetings at a glance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link className={buttonVariants({ variant: 'outline' })} to="/schedule">
            <CalendarDays aria-hidden="true" />
            View schedule
          </Link>
          <Link className={buttonVariants()} to="/bookings/new">
            <Plus aria-hidden="true" />
            New booking
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <DashboardLoading />
        ) : error ? (
          <Card className="border-destructive/20 bg-destructive/5 text-center ring-destructive/20">
            <CardContent className="py-8">
              <p className="font-medium text-destructive">{error}</p>
              <Button className="mt-4" onClick={retryLoading} variant="destructive">
                <RotateCcw aria-hidden="true" />
                Try again
              </Button>
            </CardContent>
          </Card>
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
