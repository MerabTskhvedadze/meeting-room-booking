import { LoaderCircle, Save } from 'lucide-react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

export type BookingFormValues = {
  description: string
  employeeId: string
  endTime: string
  roomId: string
  startTime: string
  title: string
}

type BookingFormProps = {
  cancelPath: string
  employees: Employee[]
  error: string
  isEditing: boolean
  isSubmitting: boolean
  minimumDateTime: string
  onChange: (name: keyof BookingFormValues, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  rooms: Room[]
  values: BookingFormValues
}

const NO_SELECTION = 'no-selection'

const fieldLabelClassName = 'text-sm font-medium'

export function BookingForm({
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
  return (
    <form onSubmit={onSubmit}>
      <Card className="mt-8">
        <CardHeader className="border-b">
          <CardTitle>Meeting details</CardTitle>
          <CardDescription>
            Choose the room, organizer, and time for this meeting.
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
              autoFocus
              id="booking-title"
              maxLength={100}
              onChange={(event) => onChange('title', event.target.value)}
              placeholder="For example: Product planning"
              required
              value={values.title}
            />
          </label>

          <label className="space-y-2 sm:col-span-2" htmlFor="booking-description">
            <span className={fieldLabelClassName}>Description</span>
            <Textarea
              id="booking-description"
              maxLength={500}
              onChange={(event) => onChange('description', event.target.value)}
              placeholder="Add an agenda or context for attendees"
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

          <label className="space-y-2" htmlFor="booking-start-time">
            <span className={fieldLabelClassName}>Starts</span>
            <Input
              id="booking-start-time"
              min={minimumDateTime}
              onChange={(event) => onChange('startTime', event.target.value)}
              required
              type="datetime-local"
              value={values.startTime}
            />
          </label>

          <label className="space-y-2" htmlFor="booking-end-time">
            <span className={fieldLabelClassName}>Ends</span>
            <Input
              id="booking-end-time"
              min={values.startTime || minimumDateTime}
              onChange={(event) => onChange('endTime', event.target.value)}
              required
              type="datetime-local"
              value={values.endTime}
            />
          </label>
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
