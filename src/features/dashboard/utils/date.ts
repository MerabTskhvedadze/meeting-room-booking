import { isSameLocalDay } from '@/utils/date'

const meetingDateFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

export function getGreeting(hour: number) {
  if (hour < 12) {
    return 'Good morning'
  }

  if (hour < 18) {
    return 'Good afternoon'
  }

  return 'Good evening'
}

export function formatMeetingDay(date: Date, today: Date) {
  return isSameLocalDay(date, today) ? 'Today' : meetingDateFormatter.format(date)
}
