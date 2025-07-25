import Vue from 'vue'
const API = process.env.NUXT_ENV_API_URL

const state = () => ({
  allCitiesList: [],           // список всех городов
  allCitiesListById: [],
  allCitiesListByKeyName: {},
  cityId: null,                // текущий id города
  activeShop: {
    id: null,
    route: 'shop'
  },
  activeCityTitle: '',
  departmentWorkTime: {
    startWorkDay: '9:00',
    endWorkDay: '21:00'
  },
  // Основной объект с информацией об адресе и филиалах
  info: {
    activeCity: 1,
    changeCity: false,
    depEntities: [],         // массив объектов филиалов (департаментов)
    depIds: [],
    address: {
      street: '',
      geo: [],
      save: false
    }
  }
})

const getters = {
  STATE: s => s,
  INFO: s => s.info
}

const mutations = {
  SET_ALL_CITY: (state, data) => {
    if (data.type !== 'success') return
    const arr = []
    for (let i = 0; i < data.data.length; i++) {
      arr.push(data.data[i])
    }
    state.allCitiesList = arr

    const allCitiesListById = []
    const allCitiesListByKeyName = {}
    for (let i = 0; i < data.data.length; i++) {
      allCitiesListById[data.data[i].id] = data.data[i]
      allCitiesListByKeyName[data.data[i].nameEn] = data.data[i]
    }
    state.allCitiesListById = allCitiesListById
    state.allCitiesListByKeyName = allCitiesListByKeyName
  },
  SET_ALL_LOCAL: (state) => {
    let info
    if (process.client) {
      info = localStorage.getItem('info')
    }
    if (info) {
      state.info = JSON.parse(info)
    } else if (process.client) {
      localStorage.setItem(
        'info',
        JSON.stringify({
          activeCity: 1,
          changeCity: false,
          depEntities: [],
          address: {
            street: '',
            geo: [],
            save: false
          }
        })
      )
    }
  },
  SET_DEPARTMENT: (state, data) => {
    state.departmentId = data
  },
  UPDATE_CITY: (state) => {
    if (process.client) {
      localStorage.setItem('info', JSON.stringify(state.info))
    }
  },
  CHANGE_CITY: (state, cityId) => {
    state.cityId = cityId
    state.activeCityTitle = state.allCitiesListById[cityId].name
    state.info.activeCity = cityId
    if (state.info.changeCity === false) {
      state.info.changeCity = true
    }
  },
  CHANGE_ADDRESS_STATUS: (state, status) => {
    state.info.address.save = status
    if (status === false) {
      state.info.address.street = ''
      state.info.address.geo = ''
      state.info.activeDepartment = 0
    }
  },
  SAVE_ADDRESS: (state, data) => {
    state.info.address.street = data.street
    state.info.address.geo = data.geo
    state.info.activeDepartment = data.department
  },
  CLEAR_ADDRESS: (state) => {
    state.info.address.street = ''
    state.info.address.geo = ''
    state.info.address.save = false
  },
  SET_DEPARTMENTS_LIST: (state, data) => {
    state.info.depEntities = data.depEntities
    state.info.depIds = data.depIds
  },
  CITY_TITLE: (state, data) => {
    state.activeCityTitle = data
  },
  ACTIVE_SHOP: (state, data) => {
    state.activeShop = data
  },
  CLEAR_ACTIVE_SHOP: (state) => {
    state.activeShop.id = null
    state.activeShop.route = 'shop'
  }
}

const actions = {
  async GET_ALL_CITY ({ commit }) {
    const data = await this.$axios.$get(`${API}site/city/cities`)
    commit('SET_ALL_CITY', data)
    return data
  },
  async GET_DEPARTMENT_BY_ADDRESS ({ commit }, pointCoords) {
    if (!pointCoords) return
    try {
      const data = await this.$api.GEO.getDepartmentInfoByAddress({ pointCoords }, this.app.$cookies.get('TOKEN'))
      if (data && data.type === 'success') {
        const copy = JSON.parse(JSON.stringify(data.data))
        const depIds = copy.map(dep => dep.id)
        // В маппинге добавляем departmentGroup
        const depEntities = copy.map((dep) => {
          return {
            id: dep.id,
            departmentId: dep.id,
            name: dep.name,
            address: dep.address.street + ' ' + dep.address.house,
            minOrderSum: dep.minOrderSum,
            minOrderSumDelivery: dep.minOrderSumDelivery,
            totalDeliveryPrice: dep.totalDeliveryPrice,
            departmentIsAyan: dep.isAyan,
            departmentIsFavorite: dep.departmentIsFavorite,
            paymentType: dep.paymentType[0],
            packetStep: dep.packagePriceStep,
            img: dep.departmentImage,
            departmentGroup: dep.departmentGroup  // Добавляем поле для группировки
          }
        })
        commit('CLEAR_ACTIVE_SHOP')
        commit('SET_DEPARTMENTS_LIST', { depIds, depEntities })
        commit('UPDATE_CITY')
        this.app.$cookies.set('availableDepartments', depIds)
      }
      return data
    } catch {
      if (process.client) {
        Vue.notify({
          group: 'app',
          type: 'error',
          duration: 2000,
          title: 'Внимание',
          text: 'Произошла ошибка выбора адреса, попробуйте еще раз пожалуйста'
        })
      }
    }
  },
  GET_CITY_LOCAL ({ commit }) {
    commit('SET_ALL_LOCAL')
  },
  CHANGE_CITY ({ commit }, id) {
    commit('CHANGE_CITY', id)
    commit('CLEAR_ADDRESS')
    commit('UPDATE_CITY')
  },
  CHANGE_ADDRESS_STATUS ({ commit }, status) {
    commit('CHANGE_ADDRESS_STATUS', status)
    commit('UPDATE_CITY')
  },
  SAVE_ADDRESS ({ commit }, data) {
    commit('SAVE_ADDRESS', data)
    commit('UPDATE_CITY')
  },
  SET_CITY_TITLE ({ commit }, data) {
    commit('CITY_TITLE', data)
  },
  async SET_ACTIVE_SHOP ({ commit }, data) {
    const resp = await this.$axios.$get(`${API}site/provider/department/profile/${data.id}`)
    data.info = resp
    commit('ACTIVE_SHOP', data)
  },
  REMOVE_ACTIVE_SHOP ({ commit }) {
    commit('CLEAR_ACTIVE_SHOP')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
