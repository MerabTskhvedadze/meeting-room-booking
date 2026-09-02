import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ScheduleLoading() {
  return (
    <div aria-label="Loading room schedule" className="mt-6 space-y-6">
      <Card aria-hidden="true">
        <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-64 max-w-full" />
          </div>
          <Skeleton className="h-8 w-28" />
        </CardContent>
      </Card>

      <Card aria-hidden="true">
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="mt-5 h-[520px] w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
