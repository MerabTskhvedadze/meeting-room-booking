import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const setValue = useCallback(
    (name: string, value: string) => {
      const next = new URLSearchParams(searchParams)
      if (value) {
        next.set(name, value)
      } else {
        next.delete(name)
      }
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const clear = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  return { clear, searchParams, setSearchParams, setValue }
}
