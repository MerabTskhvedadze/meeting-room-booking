import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  actionLabel: string
  className?: string
  description: string
  icon: ReactNode
  onAction: () => void
  title: string
}

export function EmptyState({
  actionLabel,
  className,
  description,
  icon,
  onAction,
  title,
}: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed text-center', className)}>
      <CardContent className="py-10">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <Button className="mt-4" onClick={onAction} type="button" variant="outline">
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
