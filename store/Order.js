// store/Order.js

const state = () => ({
  // список продуктов которые пойдут в заказ
  orderProducts: [],
  orderDepartments: [],
  cancelTags: [],
  delivery: null,
  lastOrders: [],
  checkResults: []
})

const getters = {
  STATE: state => state,
  TAGS: state => state.cancelTags,
  LAST: state => state.lastOrders
}

const mutations = {
  SET_ORDER_PRODUCTS: (state, data) => {
    state.orderProducts = data
  },
  SET_ORDER_DEPARTMENTS: (state, data) => {
    state.orderDepartments = data
  },
  CLEAR_ORDER_PRODUCTS: (state) => {
    state.orderProducts = []
  },
  CLEAR_ORDER_DEPARTMENTS: (state) => {
    state.orderDepartments = []
  },
  SET_CANCEL_TAGS: (state, data) => {
    state.cancelTags = data
  },
  SET_DELIVERY: (state, data) => {
    state.delivery = data
  },
  SET_LAST_ORDER: (state, data) => {
    state.lastOrders.push(data)
  },
  CLEAR_LAST_ORDER: (state) => {
    state.lastOrders = []
  },
  SET_CHECK_RESULTS: (state, data) => {
    state.checkResults = data
      
    console.log(`1111`,data)
  },
  // -- НОВЫЕ МУТАЦИИ:
  UPDATE_PRODUCT_PRICE(state, { productId, newPrice }) {
    const product = state.orderProducts.find(p => p.productId === productId)
    if (product) {
      product.price = newPrice
      // Пересчитываем totalPrice (если нет скидок/прочего)
      product.totalPrice = newPrice * product.amount
    }
  },
  UPDATE_PRODUCT_DEPARTMENT(state, { productId, newDepartmentId }) {
    const product = state.orderProducts.find(p => p.productId === productId)
    if (product) {
      product.departmentId = newDepartmentId
    }
  }
}


const actions = {
  ADD_PRODUCTS_LIST ({ commit }, input) {
    commit('SET_ORDER_PRODUCTS', input.products)
    commit('SET_ORDER_DEPARTMENTS', input.departments)
  },
  CLEAR_ORDER_LIST: ({ commit }) => {
    commit('CLEAR_ORDER_PRODUCTS')
    commit('CLEAR_ORDER_DEPARTMENTS')
  },
  ADD_LAST_ORDER ({ commit }, input) {
    commit('SET_LAST_ORDER', input)
  },
  CLEAR_LAST_ORDER: ({ commit }) => {
    commit('CLEAR_LAST_ORDER')
  },
   // Новый экшен, который применяет результаты checkResponse к локальным товарам:
   async APPLY_CHECK_RESULTS ({ commit, state }, checkResponse) {
    if (!checkResponse || checkResponse.length === 0) {
      return { type: 'ok' } // Нет изменений
    }

    let hasErrors = false
    const changedPriceProducts = []

    checkResponse.forEach(item => {
      if (item.isAvailable === false) {
        // Товар недоступен
        hasErrors = true
        
      } else {
        // Товар доступен (true или null)
        const oldProduct = state.orderProducts.find(p => p.productId === item.productId)
        if (!oldProduct) return

        // Если филиал сменился
        if (item.newDepartmentId && oldProduct.departmentId !== item.newDepartmentId) {
          commit('UPDATE_PRODUCT_DEPARTMENT', {
            productId: oldProduct.productId,
            newDepartmentId: item.newDepartmentId
          })
        }

        // Если цена изменилась
        if (item.newPrice != null && item.newPrice !== oldProduct.price) {
          changedPriceProducts.push({
            productId: oldProduct.productId,
            oldName: oldProduct.name,
            oldPrice: oldProduct.price,
            newPrice: item.newPrice
          })
          commit('UPDATE_PRODUCT_PRICE', {
            productId: oldProduct.productId,
            newPrice: item.newPrice

          })
        }
      }
    })

    if (hasErrors) {
      return { type: 'error' }
    }
    if (changedPriceProducts.length) {
      return { type: 'changed', changed: changedPriceProducts }
    }
    return { type: 'ok' }
  },
  async CHECK_ORDER({ commit }, input) {
    try {
      const response = await this.$api.Order.checkOrder(input)
      commit('SET_CHECK_RESULTS', response)
      return response
    } catch (error) {
      console.error('Ошибка при проверке заказа:', error)
      if (error.response) {
        console.error('Ответ сервера:', error.response.data)
        this.$notify({
          group: 'appcenterbig',
          type: 'error',
          duration: 5000,
          title: 'Ошибка проверки заказа',
          text: error.response.data.message || 'Непредвиденная ошибка при проверке заказа.'
        })
      }
      throw error
    }
  },
  async SEND_ORDER ({ commit }, input) {
    const data = await this.$api.Order.createOrder(input)
    return data
  },
  async CREATE_ORDER_V2({ commit }, input) { // Новое действие
    try {
      const response = await this.$api.Order.createOrderV2(input)
      return response
    } catch (error) {
      console.error('Ошибка при создании заказа V2:', error)
      if (error.response) {
        console.error('Ответ сервера:', error.response.data)
        this.$notify({
          group: 'appcenterbig',
          type: 'error',
          duration: 5000,
          title: 'Ошибка создания заказа',
          text: error.response.data.message || 'Непредвиденная ошибка при создании заказа.'
        })
      }
      throw error
    }
  },
  async GET_CANCEL_TAGS ({ commit }) {
    const data = await this.$api.Order.getCancelTags()
    commit('SET_CANCEL_TAGS', data)
  },
  async GET_ORDER_DELIVERY ({ commit }, payload) {
    const total = {}
    const resp = payload.products.map((item) => {
      return {
        departmentId: item.depId,
        products: item.products,
        cityId: payload.cityId
      }
    })
    for (let i = 0; i < resp.length; i += 1) {
      const data = await this.$api.Order.getDelivery(resp[i])
      total[resp[i].departmentId] = data
    }
    commit('SET_DELIVERY', total)
  },
  async CANCEL_ORDER ({ commit }, payload) {
    const data = await this.$api.Order.cancelOrder(payload)
    return data
  },
  async DOWNLOAD_CHECK ({ commit }, id) {
    const data = await this.$api.Order.downloadCheck(id, this.$cookies.get('TOKEN'))
    return data
  }
}

export default {
  namespaced: true, // Добавлено для именования модуля
  state,
  getters,
  mutations,
  actions
}
