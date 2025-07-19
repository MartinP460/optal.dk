import { translations } from './translations'

export type Locales = 'en' | 'da'
type TranslationKeys = keyof typeof translations.en

export const LOCAL_STORAGE_LANGUAGE = 'storedLanguage'
export const fallbackLocale = 'da'

export const locale: { value: Locales } = $state({ value: fallbackLocale })
export const locales = Object.keys(translations)

function translate(locale: Locales, key: TranslationKeys, vars: { [key: string]: string }) {
  // Grab the translation from the translations object.
  let text = translations[locale][key]

  if (!text) return key

  // Replace any passed in variables in the translation string.
  Object.keys(vars).map((k) => {
    const regex = new RegExp(`{{${k}}}`, 'g')
    text = text.replace(regex, vars[k])
  })

  return text
}

export function t(key: TranslationKeys, vars = {}) {
  return translate(locale.value, key, vars)
}
