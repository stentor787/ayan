// функция, которая создает экземпляр от текущего установленного $axios
import { setClient } from './core/request'

// modules imports: ...
import Actions from './modules/Actions'
import Auth from './modules/Auth'
import Cart from './modules/Cart'
import Category from './modules/Category'
import ElasticSearch from './modules/ElasticSearch'
import Error from './modules/Error'
import GEO from './modules/GEO'
import Order from './modules/Order'
import Payment from './modules/Payment'
import Personal from './modules/Personal'
import Products from './modules/Products'
import Redirect from './modules/Redirect'
import Reviews from './modules/Reviews'
import SEO from './modules/SEO'
import SMS from './modules/SMS'
import Static from './modules/Static'
import Favorites from './modules/Favorites'

// Объект откуда берутся все модули с запросами и эндпоинтами
const api = {
  Actions,
  Auth,
  Cart,
  Category,
  ElasticSearch,
  Error,
  GEO,
  Order,
  Payment,
  Personal,
  Products,
  Redirect,
  Reviews,
  SEO,
  SMS,
  Static,
  Favorites
}

export const name = 'API'

// это для плагина в стор
export const apiStorePlugin = (store) => {
  try {
    store.$api = api
  } catch (e) {
    // eslint-disable-next-line
    console.error('Ошибка при подключении плагина ' + name + ' | reason: ' + e)
  }
}

// это для глобального плагина nuxt
// TODO: доделать глобальный плагин для сервиса
export const apiPlugin = ($axios) => {
  setClient($axios)
  return api
}
