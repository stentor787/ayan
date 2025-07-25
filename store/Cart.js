import Vue from 'vue'
import { i18n } from '~/plugins/i18n'
const API = process.env.NUXT_ENV_API_URL
const state = () => ({
  // список с объектами продуктов(NOTICE: не путать с продуктами в сторе Order, которые входят в заказ клиента)
  all: [],
  details: {
    // общее количество по весу (количество по-штучно тоже считается, пример: 1шт + 0.1кг = 1.1)
    totalAmount: 0,
    // общая цена
    totalPrice: 0,
    // количество продуктов в корзине
    totalLength: 0
  }
})

const getters = {
  STATE: state => state,
  CART_DETAILS: state => state.details
}

const mutations = {
  SET_ALL_PRODUCTS_IN_CART: (state, data) => {
    if (data !== null) {
      state.all = data
    } else if (process.client) {
      // для сохранения заказа у незареганного клиента, лень настраивать этот функционал
      localStorage.setItem('orders', '[]')
    }
  },

  // обновить дополнительные данные (details) корзины на основе списка продуктов
  SET_UPDATED_CART_DETAILS: (state) => {
    let amount = 0
    let price = 0
    for (let i = 0; i < state.all.length; i++) {
      amount = amount + parseFloat(state.all[i].amount)
      price = parseFloat(price) + parseFloat(state.all[i].amount) * parseFloat(state.all[i].price ? state.all[i].price : state.all[i].totalPrice)
    }
    state.details.totalAmount = amount
    state.details.totalPrice = Math.ceil(price)
    state.details.totalLength = state.all.length
  },

  // добавление продукта в список корзины
  SET_NEW_ADDED_PRODUCT: (state, data) => {
    const index = state.all.findIndex(item => item.productId === data.productId)
    if (index !== -1) {
      state.all.splice(index, 1, data)
    } else {
      state.all.push(data)
    }
  },

  // удаление продукта из списка корзины
  SET_REMOVED_PRODUCT: (state, data) => {
    state.all = state.all.filter(product => product.productId !== data)
  },

  // очистка всех продуктов
  SET_CLEARED_CART_PRODUCTS: (state) => {
    state.all = []
    if (process.client) {
      localStorage.setItem('orders', '[]')
    }
  }
}

const actions = {
  // достает корзину клиента с бекенда: устанавливает CART.all
  async GET_CLIENT_CART ({ commit }, { clientId, departmentIds }) {
    const data = await this.$api.Cart.getBasket({ clientId, departmentIds }, this.$cookies.get('TOKEN'))
    commit('SET_ALL_PRODUCTS_IN_CART', data)
    commit('SET_UPDATED_CART_DETAILS')
  },

  // обнуляет корзину для неавторизованного пользователя
  CLEAR_CART_PRODUCTS ({ commit, dispatch, state }, payload) {
    // если купили тоже количество товара что и в корзине, то обнуляем ее
    if (!payload || payload.length === state.all.length) {
      commit('SET_CLEARED_CART_PRODUCTS')
      commit('SET_UPDATED_CART_DETAILS')
      // удаляем корзину клиента на сервере если он зареган
      if (this.$cookies.get('TOKEN')) {
        const body = {
          clientId: this.$cookies.get('clientId'),
          departmentIds: this.$cookies.get('availableDepartments')
        }
        this.$api.Cart.clearClientCart(body, this.$cookies.get('TOKEN'))
      }
    } else {
      // если нет, удаляем только купленные товары
      dispatch('REMOVE_IN_CART', payload)
    }
  },

  ADD_PACKET ({ commit, dispatch, state }, input) {
    let amountPacket = 1
    const price = state.all.reduce((acc, product) => {
      if (product.departmentIsAyan) {
        acc += product.totalDiscountPrice || product.totalPrice
      }
      return acc
    }, 0)
    if (price > input.packetStep) {
      const amount = price / input.packetStep
      if (amount > 1) {
        amountPacket = Math.floor(amount) + 1
      }
    }
    // разные департаменты для продукта в зависимости от города
    let providerId = 2435
    if (input.departmentId === 35) {
      providerId = 2431
    }
    const packet = {
      amount: amountPacket,
      amountStep: 1,
      departmentId: input.departmentId,
      departmentName: input.departmentName,
      img: 'https://ayanmarket.kz/products/images/image_2022-04-29-07-33-584974000_Безымянный-12.jpg',
      measureType: 'шт',
      price: 15,
      productId: 748749,
      providerId,
      productName: 'ПАКЕТ АЯН',
      productNameKz: 'ПАКЕТ АЯН',
      balance: 1000,
      categoryId: 303,
      departmentIsAyan: true,
      isFavorite: false,
      forPacket: true // флаг для пакета чтобы не вызывал сам себя NEW_AMOUNT
    }
    const inCart = state.all.some(product => product.productId === packet.productId)
    // если последний продукт это пакет то очищаем корзину
    if (inCart && state.all.length === 1) {
      commit('SET_CLEARED_CART_PRODUCTS')
      commit('SET_UPDATED_CART_DETAILS')
      return
    }
    if (inCart) {
      dispatch('NEW_AMOUNT', packet)
    } else {
      packet.totalPrice = amountPacket * packet.price
      commit('SET_NEW_ADDED_PRODUCT', packet)
    }
  },

  ADD_TO_CART ({ commit, dispatch }, input) {
    input.totalPrice = Math.floor(+input.amount * input.price)
    input.totalDiscountPrice = input.discountPrice ? Math.floor(+input.amount * input.discountPrice) : null
    commit('SET_NEW_ADDED_PRODUCT', JSON.parse(JSON.stringify(input)))
    let gtmAmount = input.amount
    if (input.amountStep === '0.1' || input.measureStep === 0.1) {
      gtmAmount = gtmAmount * 10
    }
    dispatch('SET_COMMERCE_ADD_PRODUCT', {
      ...input,
      amount: gtmAmount
    })
    commit('SET_UPDATED_CART_DETAILS')
    if (input.departmentIsAyan) {
      dispatch('ADD_PACKET', input)
    }
  },
  // отправка и получение корзины с сервера, если клиент зареган
  async CHANGE_CLIENT_CART ({ dispatch }, input) {
    const clientId = this.$cookies.get('clientId')
    const response = await this.$axios.put(`${API}client/providerBasket/edit`, {
      amount: parseFloat(input.amount),
      clientId,
      departmentId: input.departmentId,
      productId: input.productId,
      providerId: parseFloat(input.providerId)
    })
    if (response.status === 200) {
      response.data.forEach((item) => {
        if (item.overWeight) {
          Vue.notify({
            group: 'app',
            type: 'warning',
            duration: 3000,
            title: i18n.t('errors.atention'),
            text: `На филиале ${item.departmentName}, превышен лимит веса на ${item.overWeight} кг из ${item.limit}.
            Доставка будет только до подъезда.`
          })
        }
      })
    }
    return true
  },

  NEW_AMOUNT ({ commit, dispatch, state }, input) {
    const product = state.all.find(product => product.productId === input.productId)
    const oldProductData = JSON.parse(JSON.stringify(product))
    if (
      product.productId === input.productId &&
      product.providerId === input.providerId &&
      product.departmentId === input.departmentId
    ) {
      const amount = parseFloat(input.amount)
      let gtmAmount = 0
      // условие на удаление товара в корзине
      if (oldProductData.amount > parseFloat(input.amount)) {
        gtmAmount = oldProductData.amount - amount
        if (product.amountStep === '0.1' || product.measureStep === 0.1) {
          gtmAmount = gtmAmount.toFixed(1) * 10
        }
        dispatch('SET_COMMERCE_REMOVE_PRODUCT', {
          ...product,
          amount: gtmAmount // Сколько удалили
        })
        // условие на добавление товара в корзину
      } else {
        gtmAmount = amount - oldProductData.amount
        // для gtm только целое количество товара
        if (product.amountStep === '0.1' || product.measureStep === 0.1) {
          gtmAmount = gtmAmount.toFixed(1) * 10
        }
        dispatch('SET_COMMERCE_ADD_PRODUCT', {
          ...product,
          amount: gtmAmount // Сколько добавили
        })
      }
      if (!oldProductData.packetStep) {
        oldProductData.packetStep = input.packetStep
      }
      oldProductData.amount = parseFloat(input.amount)
      oldProductData.totalPrice = Math.floor(+input.amount * oldProductData.price)
      oldProductData.totalDiscountPrice = oldProductData.discountPrice ? Math.floor(+input.amount * oldProductData.discountPrice) : null
      commit('SET_NEW_ADDED_PRODUCT', oldProductData)
      commit('SET_UPDATED_CART_DETAILS')
      // для аяна добавляем пакет если экшн вызвал не сам пакет
      if (oldProductData.departmentIsAyan && !input.forPacket) {
        dispatch('ADD_PACKET', oldProductData)
      }
    }
    return true
  },
  // удаляет  продукты из корзины
  REMOVE_IN_CART ({ commit, dispatch, state }, input) {
    const ids = input.map(product => product.productId)
    const oldProducts = state.all.filter(product => ids.includes(product.productId))
    // для gtm аналитики
    oldProducts.forEach((product) => {
      let gtmAmount = product.amount
      if (product.amountStep === '0.1' || product.measureStep === 0.1) {
        gtmAmount = parseFloat(gtmAmount).toFixed(1) * 10
      }
      // передаем удаленный продукт в gtm аналитику
      dispatch('SET_COMMERCE_REMOVE_PRODUCT', {
        ...product,
        amount: gtmAmount
      })
      // удаляем локально на сайте
      commit('SET_REMOVED_PRODUCT', product.productId)
      if (product.departmentIsAyan) {
        dispatch('ADD_PACKET', product)
      }
    })

    if (this.$cookies.get('TOKEN')) {
      this.$api.Cart.removeProduct(input, this.$cookies.get('TOKEN'))
    }
    commit('SET_UPDATED_CART_DETAILS')
  },

  // обновить детали коризны, такие, как: totalAmount, totalLength, ...
  UPDATE_CART_DETAILS ({ commit }) {
    commit('SET_UPDATED_CART_DETAILS')
  },
  // проверка веса получившейся корзины при переходе на оформление заказа
  async CHECK_WEIGHT ({ commit }, payload) {
    const response = await this.$axios.post(`${API}client/providerBasket/calculate`, payload)
    if (response.status === 200) {
      response.data.forEach((item) => {
        if (item.overWeight) {
          Vue.notify({
            group: 'app',
            type: 'warning',
            duration: 3000,
            title: i18n.t('errors.atention'),
            text: `На филиале ${item.departmentName}, превышен лимит веса на ${item.overWeight} кг из ${item.limit}.
            Доставка будет только до подъезда.`
          })
        }
      })
    }
  },

  // отслеживание коммерции при добавлении продукта из корзины
  SET_COMMERCE_ADD_PRODUCT: (state, data) => {
    Vue.prototype.$Ecomerce.add_to_cart(data)
  },

  // отслеживание коммерции при удалении продукта из корзины
  SET_COMMERCE_REMOVE_PRODUCT: (state, data) => {
    Vue.prototype.$Ecomerce.remove_to_cart(data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
