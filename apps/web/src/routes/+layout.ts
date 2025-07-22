import type { Locales } from '$lib/i18n/index.svelte'
import { browser } from '$app/environment'
import { LOCAL_STORAGE_LANGUAGE, locale } from '$lib/i18n/index.svelte'

export const load = async () => {
  if (browser) {
    // We don't want to change the language if being indexed by Googlebot
    const isGooglebot = (window?.navigator?.userAgent ?? '').toLowerCase().includes('googlebot')
    if (isGooglebot) return

    const localStorageLanguage = localStorage.getItem(LOCAL_STORAGE_LANGUAGE)

    if (localStorageLanguage) {
      locale.value = localStorageLanguage as Locales
      return
    }

    const preferredLanguages = window.navigator.languages

    const prefersDanish = preferredLanguages.includes('da')
    const prefersEnglish = preferredLanguages.includes('en') || preferredLanguages.includes('en-US')

    if (prefersDanish && !prefersEnglish) {
      locale.value = 'da'
      localStorage.setItem(LOCAL_STORAGE_LANGUAGE, 'da')
    } else if (prefersEnglish) {
      locale.value = 'en'
    }
  }
}
