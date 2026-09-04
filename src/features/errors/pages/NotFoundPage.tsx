import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-lg py-16 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        The page you requested does not exist or may have moved.
      </p>
      <Link className={buttonVariants({ className: 'mt-6' })} to="/">
        Return to dashboard
      </Link>
    </section>
  )
}
