import Vue from 'vue'
Vue.prototype.$getGeo = (cityId) => {
  // координаты дефолтных геоточек для каждого города, которые будут указываться если адрес не выбран
  const coords = [
    ['49.807853', '73.088881'],
    ['50.058622', '72.952562'],
    ['51.166775', '71.41947']
  ]
  return coords[cityId - 1]
}

export default ({ app }, inject) => {
  // Inject $hello(msg) in Vue, context and store.
  inject('getGeo', (cityId) => {
    // координаты дефолтных геоточек для каждого города, которые будут указываться если адрес не выбран
    const coords = [
      ['49.807853', '73.088881'],
      ['50.058622', '72.952562'],
      ['51.166775', '71.41947']
    ]
    return coords[cityId - 1]
  })
}
