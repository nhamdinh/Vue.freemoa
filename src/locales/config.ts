import { createI18n } from 'vue-i18n-lite'

import enLang from '@/locales/en/translation.json'
import koLang from '@/locales/ko/translation.json'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: enLang,
    ko: koLang
  }
})
// i18n.changeLocale('ko')
export default i18n
