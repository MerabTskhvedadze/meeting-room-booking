import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function RoomsLoading() {
  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading rooms">
      {Array.from({ length: 3 }, (_, index) => (
        <Card aria-hidden="true" className="h-72" key={index}>
          <CardContent>
            <Skeleton className="size-10 rounded-lg" />
            <Skeleton className="mt-5 h-5 w-2/3" />
            <Skeleton className="mt-4 h-4 w-1/2" />
            <div className="mt-6 flex gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
