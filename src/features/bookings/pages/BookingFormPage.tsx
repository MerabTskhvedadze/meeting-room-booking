import { useParams } from 'react-router-dom'

export function BookingFormPage() {
  const { bookingId } = useParams()
  const isEditing = bookingId !== undefined

  return (
    <section>
      <p className="text-sm font-semibold text-indigo-600">
        {isEditing ? 'Update meeting' : 'Schedule a meeting'}
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">
        {isEditing ? 'Edit booking' : 'New booking'}
      </h1>
      <p className="mt-2 text-slate-600">
        {isEditing
          ? 'Change the meeting details or choose another room.'
          : 'Choose the right room and time for your team.'}
      </p>
    </section>
  )
}
