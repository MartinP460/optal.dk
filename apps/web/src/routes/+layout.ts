import type { Locales } from '$lib/i18n'
import { browser } from '$app/environment'
import { LOCAL_STORAGE_LANGUAGE, locale } from '$lib/i18n'

export const load = async () => {
  if (browser) {
    const localStorageLanguage = localStorage.getItem(LOCAL_STORAGE_LANGUAGE)

    if (localStorageLanguage) {
      locale.set(localStorageLanguage as Locales)
      return
    }

    const preferredLanguage = window.navigator.language

    if (preferredLanguage.includes('en')) {
      locale.set('en')
    } else {
      locale.set('da')
    }
  }
}
