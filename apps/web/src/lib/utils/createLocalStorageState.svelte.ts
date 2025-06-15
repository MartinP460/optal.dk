import { browser } from '$app/environment'

export function createLocalStorageState(name: string, defaultValue: string) {
  const initialValue = browser ? window.localStorage.getItem(name) ?? defaultValue : defaultValue

  // Set up a watcher to sync state changes to localStorage
  const sync = (newState: string) => {
    if (browser) {
      window.localStorage.setItem(name, newState)
    }
  }

  return { initialValue, sync }
}
