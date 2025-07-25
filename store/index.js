
import { apiStorePlugin } from '~/api'

const plugins = [apiStorePlugin]

const actions = {
  async nuxtServerInit ({ dispatch, state }) {
    try {
      // Добавил вызовы апи которые необходимы для формирования верстки
      const promiseArray = []
      promiseArray.push(await dispatch('GEO/GET_ALL_CITY')) // достаем все города из апи
      promiseArray.push(await dispatch('Category/GET_CATEGORIES_BY_DEPARTMENT'))
      // Гео-точка на основе сохранного или дефолтного города
      const geoCoords = this.app.$cookies.get('cityId')
        ? this.app.$getGeo(this.app.$cookies.get('cityId'))
        : this.app.$getGeo(state.GEO.info.activeCity)
      promiseArray.push(await dispatch('GEO/GET_DEPARTMENT_BY_ADDRESS', geoCoords))
      promiseArray.push(await dispatch('Category/GET_HOVER_PANEL_CATEGORIES', state.GEO.info.depIds))
      // promiseArray.push(await dispatch('Products/GET_SHOWCASE_PRODUCTS', state.GEO.info.depIds))

      await Promise.all(promiseArray).catch((err) => {
        console.log('serverInit error', err)
      })
      // Пока убрал все старые методы
      // let department = this.app.$cookies.get('departmentId')
      // let availableDepartments = this.app.$cookies.get('availableDepartments')
      // дефолтный филиал если другой не был задан
      // if (typeof department === 'undefined') {
      //   department = state.GEO.allCitiesListById[1].departments[0].id
      // }

      // if (
      //   typeof availableDepartments === 'undefined' ||
      //   availableDepartments?.length <= 0
      // ) {
      //   availableDepartments = [
      //     state.GEO.allCitiesListById[1].departments[0].id
      //   ]
      // }
      // const client = this.app.$cookies.get('clientId')
      // const token = this.app.$cookies.get('TOKEN')
      // if (typeof client !== 'undefined' && token) {
      //   await dispatch('Cart/GET_CLIENT_CART', {
      //     clientId: client,
      //     departmentIds: availableDepartments
      //   })
      // }
    } catch (err) {
      console.error('Error on nuxtServerInit action.' + err)
    }
  }
}

export default {
  actions,
  plugins
}
