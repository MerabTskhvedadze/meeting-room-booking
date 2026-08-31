import { Link, useParams } from 'react-router-dom'

export function BookingDetailsPage() {
  const { bookingId } = useParams()

  return (
    <section>
      <p className="text-sm font-semibold text-indigo-600">Booking details</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{bookingId}</h1>
      <Link
        className="mt-6 inline-flex text-sm font-semibold text-indigo-700 hover:text-indigo-800"
        to={`/bookings/${bookingId}/edit`}
      >
        Edit booking
      </Link>
    </section>
  )
}
