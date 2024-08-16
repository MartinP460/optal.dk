import type { Locales } from '$lib/i18n'
import { browser } from '$app/environment'
import { LOCAL_STORAGE_LANGUAGE, locale } from '$lib/i18n'

export const load = async () => {
  if (browser) {
    // We don't want to change the language if being indexed by Googlebot
    const isGooglebot = (window?.navigator?.userAgent ?? '').toLowerCase().includes('googlebot')
    if (isGooglebot) return

    const localStorageLanguage = localStorage.getItem(LOCAL_STORAGE_LANGUAGE)

    if (localStorageLanguage) {
      locale.set(localStorageLanguage as Locales)
      return
    }

    const preferredLanguage = window.navigator.language

    if (preferredLanguage.includes('en')) {
      locale.set('en')
      localStorage.setItem(LOCAL_STORAGE_LANGUAGE, 'en')
    } else {
      locale.set('da')
    }
  }
}
