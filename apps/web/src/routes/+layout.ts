import '$lib/i18n'
import { browser } from '$app/environment'
import { locale, LOCAL_STORAGE_LANGUAGE } from '$lib/i18n'
import type { Locales } from '$lib/i18n'

export const load = async () => {
  if (browser) {
    const localStorageLanguage = localStorage.getItem(LOCAL_STORAGE_LANGUAGE)

    if (localStorageLanguage) {
      locale.set(localStorageLanguage as Locales)
      return
    }

    const preferredLanguage = window.navigator.language

    if (preferredLanguage.includes('da')) {
      locale.set('da')
    } else {
      locale.set('en')
    }
  }
}
