export function readStoredJson<T>(key: string, fallback: T): T {
  try {
    const storedValue = window.localStorage.getItem(key)

    if (storedValue === null) {
      return fallback
    }

    return JSON.parse(storedValue) as T
  } catch {
    return fallback
  }
}

export function writeStoredJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    throw new Error('Your booking could not be saved in this browser.')
  }
}
