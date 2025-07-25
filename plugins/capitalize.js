import Vue from 'vue'
Vue.prototype.$capitalize = (str) => {
  if (!str) { return }
  return str[0] + str.slice(1).toLowerCase()
}
