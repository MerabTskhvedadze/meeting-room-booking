import { useCallback, useEffect, useState } from 'react'

export type AsyncQueryResult<T> = {
  data: T | null
  error: string
  isLoading: boolean
  retry: () => void
}

export function useAsyncQuery<T>(
  query: () => Promise<T>,
  errorMessage: string,
): AsyncQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true

    query()
      .then((result) => {
        if (active) setData(result)
      })
      .catch(() => {
        if (active) setError(errorMessage)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [attempt, errorMessage, query])

  const retry = useCallback(() => {
    setIsLoading(true)
    setError('')
    setAttempt((current) => current + 1)
  }, [])

  return { data, error, isLoading, retry }
}
