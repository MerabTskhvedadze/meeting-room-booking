import { CalendarDays, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LoadError } from '@/components/LoadError'
import { PageHeader } from '@/components/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useWorkspaceData } from '@/hooks/use-workspace-data'
import { fullDateFormatter } from '@/utils/date'
import { DashboardLoading } from '../components/DashboardLoading'
import { DashboardMetrics } from '../components/DashboardMetrics'
import { RoomStatusCard } from '../components/RoomStatusCard'
import { UpcomingMeetingsCard } from '../components/UpcomingMeetingsCard'

import { getGreeting } from '../utils/date'
import { buildDashboardViewModel } from '../utils/dashboardViewModel'

export function DashboardPage() {
  useDocumentTitle('Dashboard')
  const { data, error, isLoading, retry } = useWorkspaceData()
  const now = new Date()
  const bookings = data?.bookings ?? []
  const employees = data?.employees ?? []
  const rooms = data?.rooms ?? []
  const dashboard = buildDashboardViewModel(bookings, rooms, now)

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
          <LoadError message={error} onRetry={retry} />
        ) : (
          <>
            <DashboardMetrics
              availableRooms={dashboard.availableRooms}
              occupiedRooms={dashboard.occupiedRooms}
              rooms={rooms.length}
              seats={dashboard.seats}
              todayMeetings={dashboard.todayMeetings}
              upcomingMeetings={dashboard.upcomingMeetings}
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,1fr)]">
              <UpcomingMeetingsCard
                bookings={dashboard.upcomingBookings}
                employees={employees}
                now={now}
                rooms={rooms}
              />
              <RoomStatusCard
                activeBookings={dashboard.activeBookings}
                now={now}
                rooms={rooms}
                upcomingBookings={dashboard.upcomingBookings}
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
