import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardLoading() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading dashboard">
        {Array.from({ length: 4 }, (_, index) => (
          <Card aria-hidden="true" key={index} size="sm">
            <CardContent>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-5 h-8 w-14" />
              <Skeleton className="mt-2 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,1fr)]">
        {Array.from({ length: 2 }, (_, index) => (
          <Card aria-hidden="true" key={index}>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
