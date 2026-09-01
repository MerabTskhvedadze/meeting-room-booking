import { RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type LoadErrorProps = {
  className?: string
  message: string
  onRetry: () => void
}

export function LoadError({ className, message, onRetry }: LoadErrorProps) {
  return (
    <Card
      className={cn(
        'border-destructive/20 bg-destructive/5 text-center ring-destructive/20',
        className,
      )}
    >
      <CardContent className="py-8">
        <p className="font-medium text-destructive">{message}</p>
        <Button className="mt-4" onClick={onRetry} variant="destructive">
          <RotateCcw aria-hidden="true" />
          Try again
        </Button>
      </CardContent>
    </Card>
  )
}
