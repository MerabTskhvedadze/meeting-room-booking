import { Ban, LoaderCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type CancelBookingPanelProps = {
  error: string
  isCancelling: boolean
  isConfirming: boolean
  onCancel: () => void
  onClose: () => void
  onOpen: () => void
}

export function CancelBookingPanel({
  error,
  isCancelling,
  isConfirming,
  onCancel,
  onClose,
  onOpen,
}: CancelBookingPanelProps) {
  if (!isConfirming) {
    return (
      <div className="mt-6 flex justify-end">
        <Button onClick={onOpen} type="button" variant="destructive">
          <Ban aria-hidden="true" />
          Cancel booking
        </Button>
      </div>
    )
  }

  return (
    <Card className="mt-6 border-destructive/20 bg-destructive/5 ring-destructive/20">
      <CardContent className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-semibold">Cancel this booking?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The meeting will remain visible with a cancelled status.
          </p>
          {error ? (
            <p className="mt-2 text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button disabled={isCancelling} onClick={onClose} type="button" variant="outline">
            Keep booking
          </Button>
          <Button disabled={isCancelling} onClick={onCancel} type="button" variant="destructive">
            {isCancelling ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
            Confirm cancellation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
