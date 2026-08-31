import {
  Building2,
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
  Plus,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Rooms', to: '/rooms', icon: Building2 },
  { label: 'Schedule', to: '/schedule', icon: CalendarRange },
  { label: 'Bookings', to: '/bookings', icon: CalendarDays },
]

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <CalendarDays aria-hidden="true" size={20} />
          </div>
          <div>
            <p className="font-semibold tracking-tight">Booking</p>
          </div>
        </div>

        <nav aria-label="Primary navigation" className="flex-1 space-y-1 p-4">
          {navigation.map(({ end, icon: Icon, label, to }) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`
              }
              end={end}
              key={to}
              to={to}
            >
              <Icon aria-hidden="true" size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
            <NavLink className="flex items-center gap-2 font-semibold lg:hidden" to="/">
              <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <CalendarDays aria-hidden="true" size={18} />
              </span>
            </NavLink>

            <p className="hidden text-sm text-slate-500 lg:block">
              Internal meeting room booking
            </p>

            <NavLink
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
              to="/bookings/new"
            >
              <Plus aria-hidden="true" size={17} />
              <span className="hidden sm:inline">New booking</span>
              <span className="sm:hidden">Book</span>
            </NavLink>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </main>

        <nav
          aria-label="Mobile navigation"
          className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
          {navigation.map(({ end, icon: Icon, label, to }) => (
            <NavLink
              className={({ isActive }) =>
                `flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium ${
                  isActive ? 'text-indigo-700' : 'text-slate-500'
                }`
              }
              end={end}
              key={to}
              to={to}
            >
              <Icon aria-hidden="true" size={19} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
