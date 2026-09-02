export const dateFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export const fullDateFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

export const timeFormatter = new Intl.DateTimeFormat('en', {
  hour: 'numeric',
  minute: '2-digit',
})

export function isSameLocalDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

export function toDateTimeLocalValue(value: string) {
  const date = new Date(value)
  const timezoneOffset = date.getTimezoneOffset() * 60_000

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

export function toLocalDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
