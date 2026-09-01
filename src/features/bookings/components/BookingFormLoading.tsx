import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function BookingFormLoading() {
  return (
    <Card aria-label="Loading booking form" className="mt-8">
      <CardHeader className="border-b">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-2 h-8 w-full" />
        </div>
        <div className="sm:col-span-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-24 w-full" />
        </div>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-8 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
