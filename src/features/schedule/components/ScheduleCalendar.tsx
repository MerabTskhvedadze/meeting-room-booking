import FullCalendar, {
  type DatesSetInfo,
  type EventClickInfo,
  type EventInput,
} from '@fullcalendar/react'
import listPlugin from '@fullcalendar/react/list'
import timeGridPlugin from '@fullcalendar/react/timegrid'
import themePlugin from '@fullcalendar/react/themes/classic'
import { useEffect, useMemo, useState } from 'react'

import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/classic/theme.css'
import '@fullcalendar/react/themes/classic/palette.css'
import type { Booking } from '@/types/booking'
import type { Room } from '@/types/room'
import { timeFormatter, toLocalDateValue } from '@/utils/date'
import type { ScheduleView } from './ScheduleControls'
import './schedule-calendar.css'

type ScheduleCalendarProps = {
  bookings: Booking[]
  date: string
  onDateChange: (date: string) => void
  onOpenBooking: (bookingId: string) => void
  roomName: string
  rooms: Room[]
  showRoomNames: boolean
  view: ScheduleView
}

const compactScheduleQuery = '(max-width: 639px)'

function getIsCompactSchedule() {
  return window.matchMedia(compactScheduleQuery).matches
}

export function ScheduleCalendar({
  bookings,
  date,
  onDateChange,
  onOpenBooking,
  roomName,
  rooms,
  showRoomNames,
  view,
}: ScheduleCalendarProps) {
  const [isCompact, setIsCompact] = useState(getIsCompactSchedule)

  useEffect(() => {
    const mediaQuery = window.matchMedia(compactScheduleQuery)
    const updateLayout = (event: MediaQueryListEvent) => setIsCompact(event.matches)

    mediaQuery.addEventListener('change', updateLayout)

    return () => mediaQuery.removeEventListener('change', updateLayout)
  }, [])

  const calendarView = view === 'day' ? 'timeGridDay' : isCompact ? 'listWeek' : 'timeGridWeek'
  const events = useMemo<EventInput[]>(() => {
    const roomNames = new Map(rooms.map((room) => [room.id, room.name]))

    return bookings.map((booking) => ({
      id: booking.id,
      title: showRoomNames
        ? `${booking.title} · ${roomNames.get(booking.roomId) ?? 'Unknown room'}`
        : booking.title,
      start: booking.startTime,
      end: booking.endTime,
      url: `/bookings/${booking.id}`,
    }))
  }, [bookings, rooms, showRoomNames])

  function handleDatesSet(info: DatesSetInfo) {
    const nextDate = toLocalDateValue(info.view.currentStart)

    if (nextDate !== date) {
      onDateChange(nextDate)
    }
  }

  function handleEventClick(info: EventClickInfo) {
    info.jsEvent.preventDefault()
    onOpenBooking(info.event.id)
  }

  return (
    <div className="schedule-calendar mt-6" aria-label={`${roomName} schedule`}>
      <FullCalendar
        allDaySlot={false}
        datesSet={handleDatesSet}
        dayHeaderFormat={{ weekday: 'short', month: 'short', day: 'numeric' }}
        eventClick={handleEventClick}
        eventDidMount={(info) => {
          const start = info.event.start
          const end = info.event.end

          if (start && end) {
            info.el.title = `${info.event.title}, ${timeFormatter.format(start)}-${timeFormatter.format(end)}`
          }
        }}
        eventInteractive
        events={events}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
        height="auto"
        initialDate={date}
        initialView={calendarView}
        key={`${calendarView}-${date}`}
        noEventsContent={
          showRoomNames
            ? 'No bookings during this period.'
            : 'No bookings for this room during this period.'
        }
        nowIndicator
        plugins={[themePlugin, timeGridPlugin, listPlugin]}
        listItemEventClass="schedule-list-event"
        listItemEventTimeClass="schedule-list-event-time"
        listItemEventTitleClass="schedule-list-event-title"
        slotDuration="00:30:00"
        slotHeaderFormat={{ hour: 'numeric', minute: '2-digit' }}
        slotHeaderInterval="01:00:00"
        slotMaxTime="19:00:00"
        slotMinTime="08:00:00"
        toolbarTitleClass="schedule-toolbar-title"
        views={{
          list: {
            className: 'schedule-list-view',
          },
          timeGrid: {
            slotHeaderClass: 'schedule-slot-header',
            slotHeaderInnerClass: 'schedule-slot-header-inner',
            slotLaneClass: 'schedule-slot-lane',
          },
        }}
      />
    </div>
  )
}
