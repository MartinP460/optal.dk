import { writable } from 'svelte/store'
import { browser } from '$app/environment'

export function createLocalStorageState(name: string, defaultValue: string) {
  const initialValue = browser ? window.localStorage.getItem(name) ?? defaultValue : defaultValue

  const localStorageState = writable<string>(initialValue)

  localStorageState.subscribe((value) => {
    if (browser) {
      window.localStorage.setItem(name, value)
    }
  })

  return localStorageState
}
