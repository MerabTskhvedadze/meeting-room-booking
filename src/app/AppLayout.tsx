import {
  Building2,
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
  Plus,
} from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

const navigation = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Rooms', to: '/rooms', icon: Building2 },
  { label: 'Schedule', to: '/schedule', icon: CalendarRange },
  { label: 'Bookings', to: '/bookings', icon: CalendarDays },
]

function isRouteActive(pathname: string, to: string, end?: boolean) {
  if (end) {
    return pathname === to
  }

  return pathname === to || pathname.startsWith(`${to}/`)
}

function AppSidebar() {
  const { pathname } = useLocation()
  const { setOpenMobile } = useSidebar()

  function closeMobileSidebar() {
    setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === '/'}
              render={<NavLink onClick={closeMobileSidebar} to="/" />}
              size="lg"
              tooltip="Booking"
            >
              <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <CalendarDays aria-hidden="true" />
              </span>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate font-heading font-semibold">Booking</span>
                <span className="truncate text-xs text-sidebar-foreground/65">Meeting rooms</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map(({ end, icon: Icon, label, to }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton
                    isActive={isRouteActive(pathname, to, end)}
                    render={<NavLink end={end} onClick={closeMobileSidebar} to={to} />}
                    tooltip={label}
                  >
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function ShellContent() {
  const { pathname } = useLocation()
  const currentPage =
    navigation.find(({ end, to }) => isRouteActive(pathname, to, end))?.label ?? 'Booking'

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
          <div className="flex w-full items-center gap-3 px-4 sm:px-6 lg:px-8">
            <SidebarTrigger />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{currentPage}</p>
            </div>

            <Link className={buttonVariants()} to="/bookings/new">
              <Plus aria-hidden="true" />
              <span className="hidden sm:inline">New booking</span>
              <span className="sm:hidden">Book</span>
            </Link>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  )
}

export function AppLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <ShellContent />
      </SidebarProvider>
    </TooltipProvider>
  )
}
