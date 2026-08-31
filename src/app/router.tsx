import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './AppLayout'
import { BookingDetailsPage } from '../features/bookings/pages/BookingDetailsPage'
import { BookingFormPage } from '../features/bookings/pages/BookingFormPage'
import { BookingsPage } from '../features/bookings/pages/BookingsPage'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { NotFoundPage } from '../features/errors/pages/NotFoundPage'
import { RoomsPage } from '../features/rooms/pages/RoomsPage'
import { SchedulePage } from '../features/schedule/pages/SchedulePage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'rooms', Component: RoomsPage },
      { path: 'schedule', Component: SchedulePage },
      { path: 'bookings', Component: BookingsPage },
      { path: 'bookings/new', Component: BookingFormPage },
      { path: 'bookings/:bookingId', Component: BookingDetailsPage },
      { path: 'bookings/:bookingId/edit', Component: BookingFormPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
