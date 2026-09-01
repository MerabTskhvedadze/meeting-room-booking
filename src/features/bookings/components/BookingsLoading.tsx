import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function BookingsLoading() {
  return (
    <div className="mt-6 space-y-3" aria-label="Loading bookings">
      {Array.from({ length: 4 }, (_, index) => (
        <Card aria-hidden="true" key={index}>
          <CardContent className="grid gap-4 md:grid-cols-4 md:items-center">
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="mt-2 h-3 w-64 max-w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-36" />
              <Skeleton className="mt-2 h-3 w-28" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
