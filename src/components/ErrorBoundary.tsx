import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

import { buttonVariants } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null, hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error, hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="mx-auto max-w-lg py-16 text-center">
          <p className="text-sm font-semibold text-destructive">Unexpected error</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Something went wrong</h1>
          <p className="mt-3 text-muted-foreground">
            {this.state.error?.message ?? 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            className={buttonVariants({ className: 'mt-6' })}
            onClick={() => this.setState({ error: null, hasError: false })}
            type="button"
          >
            Try again
          </button>
        </section>
      )
    }

    return this.props.children
  }
}
