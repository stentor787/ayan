import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ru from '~/lang/ru.json'
import kz from '~/lang/kz.json'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'ru', // default locale
  fallbackLocale: 'ru', // fallback locale
  messages: { ru, kz }
})

export default ({ app }) => {
  app.i18n = i18n
}
