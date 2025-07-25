/* eslint-disable */
const axios = require('axios')
const translit = require('./translit')

module.exports = async function generateCategory () {
  try{
    let routes = []
    //  достаем все категории
    const categoryArr = await axios.get('https://ayanmarketapi.kz/api/site/providerCategory/getCategoryNames?departmentIds=5')
    //  делаем из них массив путей
    routes = categoryArr.data.map(cat => `shop/collection/${translit(cat.name)}-${cat.id}`)
    return routes
  } catch (e) {
    return []
  }
}
