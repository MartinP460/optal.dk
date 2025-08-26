import { type Locale, type TranslationKeys, t as i18n } from '@optaldk/i18n'

export const LOCAL_STORAGE_LANGUAGE = 'storedLanguage'
export const fallbackLocale = 'da'

export const locale: { value: Locale } = $state({ value: fallbackLocale })

export function t(key: TranslationKeys, vars = {}) {
  return i18n(locale.value, key, vars)
}
