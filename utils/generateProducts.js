/* eslint-disable */
const axios = require('axios')
const translit = require('./translit')

module.exports = async function generateProducts () {
  try {
    let routes = []
    //    достаем продукты с сервера
    const productsArr = await axios.get('https://ayanmarketapi.kz/api/site/provider/product/get/all/products')
    //    возвращем все пути продуктов вытащив их из своих массивов
    routes = productsArr.data.map(product => `product/${translit(product.name)}-${product.id}`)

    return routes
  } catch (e) {
    return []
  }
}
