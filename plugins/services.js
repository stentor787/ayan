// TODO: доделать функционал для сервисов
import Vue from 'vue'

// Плагин созданный для сервисов
import { apiPlugin } from '@/api/index'
// import { localStoragePlugin } from '@/services/localStorage/index'

export default ({ $axios }, inject) => {
  // для подключения функций-сервисов
  // const allMethods = {
  //   // e.g.:
  //   $productServices: ($axios) => { ... }
  // }
  // const methods = Object.keys(allMethods)
  // methods.forEach((method) => {
  //   // inject для привязки функции к контексту Vue
  //   inject(method, allMethods[method])
  // })
  Vue.prototype.$api = apiPlugin($axios)
}
