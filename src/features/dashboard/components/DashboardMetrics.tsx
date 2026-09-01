import {
  Building2,
  CalendarCheck2,
  CalendarDays,
  Clock3,
  DoorOpen,
} from 'lucide-react'

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface MetricCardProps {
  description: string
  icon: typeof CalendarDays
  label: string
  value: number
}

function MetricCard({ description, icon: Icon, label, value }: MetricCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
        <CardAction className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon aria-hidden="true" size={16} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="font-heading text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

interface DashboardMetricsProps {
  availableRooms: number
  occupiedRooms: number
  rooms: number
  seats: number
  todayMeetings: number
  upcomingMeetings: number
}

export function DashboardMetrics({
  availableRooms,
  occupiedRooms,
  rooms,
  seats,
  todayMeetings,
  upcomingMeetings,
}: DashboardMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        description="Confirmed meetings scheduled today"
        icon={CalendarCheck2}
        label="Today's meetings"
        value={todayMeetings}
      />
      <MetricCard
        description={`${occupiedRooms} currently in use`}
        icon={DoorOpen}
        label="Rooms available now"
        value={availableRooms}
      />
      <MetricCard
        description="Starting during the next seven days"
        icon={Clock3}
        label="Upcoming meetings"
        value={upcomingMeetings}
      />
      <MetricCard
        description={`${seats} seats across all spaces`}
        icon={Building2}
        label="Meeting rooms"
        value={rooms}
      />
    </div>
  )
}
