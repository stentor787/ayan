import Vue from 'vue'
Vue.prototype.$ruNumString = (number, variants) => {
  const cases = [2, 0, 1, 1, 1, 2]
  return variants[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
}
