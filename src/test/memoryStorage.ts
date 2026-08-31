/*
  This module provides an in-memory implementation of the Web Storage API (Storage interface).
  The `createMemoryStorage` function returns a Storage-compatible object that stores key-value
  pairs in a Map instead of the browser's localStorage or sessionStorage. This is useful for
  environments where Web Storage is unavailable (e.g., Node.js, server-side rendering, or testing).

  The returned object implements all standard Storage methods:
  - `length`     : Returns the number of stored key-value pairs.
  - `clear()`    : Removes all key-value pairs from the store.
  - `getItem()`  : Retrieves the value associated with the given key, or null if not found.
  - `key()`      : Returns the key at the given index, or null if the index is out of range.
  - `removeItem()`: Deletes the key-value pair associated with the given key.
  - `setItem()`  : Adds or updates the value for the given key.
*/

export function createMemoryStorage(): Storage {
  const values = new Map<string, string>()

  return {
    get length() {
      return values.size
    },

    clear() {
      values.clear()
    },

    getItem(key) {
      return values.get(key) ?? null
    },

    key(index) {
      return [...values.keys()][index] ?? null
    },

    removeItem(key) {
      values.delete(key)
    },

    setItem(key, value) {
      values.set(key, value)
    },
  }
}

