import { translations } from './translations'

export type Locale = 'en' | 'da'
export type TranslationKeys = keyof typeof translations.en

export const LOCALES = ['da', 'en']

export function t(locale: Locale, key: TranslationKeys, vars: { [key: string]: string }) {
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
