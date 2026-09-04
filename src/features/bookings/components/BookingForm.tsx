import { CalendarDays, CircleCheck, CircleX, Clock3, LoaderCircle, Save } from 'lucide-react'
import { useState, type SubmitEvent } from 'react'
import { Link } from 'react-router-dom'

import { Button, buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Employee } from '@/types/employee'
import type { Room } from '@/types/room'
import { fromLocalDateValue, toLocalDateValue } from '@/utils/date'
import type { AvailabilityStatus, BookingFormValues } from '../types/bookingForm'

type BookingFormProps = {
  availabilityStatus: AvailabilityStatus
  cancelPath: string
  employees: Employee[]
  error: string
  isEditing: boolean
  isSubmitting: boolean
  minimumDateTime: string
  onChange: (name: keyof BookingFormValues, value: string) => void
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void
  rooms: Room[]
  values: BookingFormValues
}

const NO_SELECTION = 'no-selection'

const fieldLabelClassName = 'text-sm font-medium'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'long',
  weekday: 'short',
  year: 'numeric',
})

export function BookingForm({
  availabilityStatus,
  cancelPath,
  employees,
  error,
  isEditing,
  isSubmitting,
  minimumDateTime,
  onChange,
  onSubmit,
  rooms,
  values,
}: BookingFormProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  return (
    <form onSubmit={onSubmit}>
      <Card className="mt-8">
        <CardHeader className="border-b">
          <CardTitle>Meeting details</CardTitle>
          <CardDescription>
            Choose the room, organizer, date, and time for this meeting.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          {error ? (
            <div
              className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm font-medium text-destructive sm:col-span-2"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <label className="space-y-2 sm:col-span-2" htmlFor="booking-title">
            <span className={fieldLabelClassName}>Title</span>
            <Input
              autoComplete="off"
              id="booking-title"
              maxLength={100}
              name="title"
              onChange={(event) => onChange('title', event.target.value)}
              placeholder="For example: Product planning…"
              required
              value={values.title}
            />
          </label>

          <label className="space-y-2 sm:col-span-2" htmlFor="booking-description">
            <span className={fieldLabelClassName}>Description</span>
            <Textarea
              autoComplete="off"
              id="booking-description"
              maxLength={500}
              name="description"
              onChange={(event) => onChange('description', event.target.value)}
              placeholder="Add an agenda or context for attendees…"
              value={values.description}
            />
          </label>

          <div className="space-y-2">
            <label className={fieldLabelClassName} htmlFor="booking-room">
              Room
            </label>
            <Select
              onValueChange={(value) =>
                onChange('roomId', value === NO_SELECTION ? '' : (value ?? ''))
              }
              value={values.roomId || NO_SELECTION}
            >
              <SelectTrigger aria-label="Room" className="w-full" id="booking-room">
                <SelectValue>
                  {(value: string) =>
                    value === NO_SELECTION
                      ? 'Choose a room'
                      : (rooms.find((room) => room.id === value)?.name ?? 'Choose a room')
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_SELECTION}>Choose a room</SelectItem>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} &middot; Floor {room.floor} &middot; {room.capacity} people
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className={fieldLabelClassName} htmlFor="booking-organizer">
              Organizer
            </label>
            <Select
              onValueChange={(value) =>
                onChange('employeeId', value === NO_SELECTION ? '' : (value ?? ''))
              }
              value={values.employeeId || NO_SELECTION}
            >
              <SelectTrigger aria-label="Organizer" className="w-full" id="booking-organizer">
                <SelectValue>
                  {(value: string) =>
                    value === NO_SELECTION
                      ? 'Choose an organizer'
                      : (employees.find((employee) => employee.id === value)?.name ??
                        'Choose an organizer')
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_SELECTION}>Choose an organizer</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} &middot; {employee.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <fieldset className="space-y-4 rounded-xl border bg-muted/20 p-4 sm:col-span-2">
            <legend className="px-1 text-sm font-semibold">Date &amp; time</legend>
            <p className="text-sm text-muted-foreground">
              Select one date, then choose when the meeting starts and ends.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="booking-date">Meeting date</Label>
                <Popover
                  onOpenChange={setIsDatePickerOpen}
                  open={isDatePickerOpen}
                >
                  <PopoverTrigger
                    render={
                      <Button
                        aria-required="true"
                        className="w-full justify-start px-2.5 font-normal"
                        id="booking-date"
                        variant="outline"
                      />
                    }
                  >
                    <CalendarDays aria-hidden="true" />
                    {values.date
                      ? dateFormatter.format(fromLocalDateValue(values.date))
                      : 'Choose a date'}
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      disabled={{ before: fromLocalDateValue(minimumDateTime.slice(0, 10))! }}
                      mode="single"
                      onSelect={(date) => {
                        onChange('date', date ? toLocalDateValue(date) : '')
                        setIsDatePickerOpen(false)
                      }}
                      selected={fromLocalDateValue(values.date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-start-time">Start time</Label>
                <div className="relative">
                  <Clock3
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    autoComplete="off"
                    className="pl-8 tabular-nums"
                    id="booking-start-time"
                    name="startTime"
                    onChange={(event) => onChange('startTime', event.target.value)}
                    required
                    step={900}
                    type="time"
                    value={values.startTime}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-end-time">End time</Label>
                <div className="relative">
                  <Clock3
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    autoComplete="off"
                    className="pl-8 tabular-nums"
                    id="booking-end-time"
                    min={values.startTime}
                    name="endTime"
                    onChange={(event) => onChange('endTime', event.target.value)}
                    required
                    step={900}
                    type="time"
                    value={values.endTime}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {availabilityStatus !== 'idle' && (
            <p
              aria-live="polite"
              className="flex items-center gap-2 text-sm font-medium sm:col-span-2"
              role="status"
            >
              {availabilityStatus === 'checking' && (
                <>
                  <LoaderCircle
                    aria-hidden="true"
                    className="animate-spin text-muted-foreground"
                    size={15}
                  />
                  <span className="text-muted-foreground">Checking availability…</span>
                </>
              )}
              {availabilityStatus === 'available' && (
                <>
                  <CircleCheck
                    aria-hidden="true"
                    className="shrink-0 text-emerald-600 dark:text-emerald-400"
                    size={15}
                  />
                  <span className="text-emerald-700 dark:text-emerald-400">
                    Room is available for this time slot
                  </span>
                </>
              )}
              {availabilityStatus === 'unavailable' && (
                <>
                  <CircleX
                    aria-hidden="true"
                    className="shrink-0 text-destructive"
                    size={15}
                  />
                  <span className="text-destructive">
                    Room is already booked during this time — choose a different slot or room
                  </span>
                </>
              )}
            </p>
          )}
        </CardContent>

        <CardFooter className="justify-end gap-2">
          <Link className={buttonVariants({ variant: 'outline' })} to={cancelPath}>
            Cancel
          </Link>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Save aria-hidden="true" />}
            {isEditing ? 'Save changes' : 'Create booking'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
