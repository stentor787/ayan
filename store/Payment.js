const API = process.env.NUXT_ENV_API_URL
const state = () => ({
  alltype: [],
  creditCards: []
})

const getters = {
  STATE: state => state,
  CREDIT_CARDS: state => state.creditCards
}

const mutations = {
  SET_ALL_TYPE: (state, data) => {
    if (data.type === 'success') {
      state.alltype = data.data.map(item => item.paymentType)
    }
  },
  SET_CREDIT_CARDS: (state, data) => {
    if (data.type !== 'error') {
      state.creditCards = data
    }
  }
}

const actions = {
  async GET_ALL_PAY_TYPE ({ commit }, payload) {
    const body = {
      departmentIds: payload
    }
    const data = await this.$axios.$post(`${API}site/paymentType/all`, body)
    commit('SET_ALL_TYPE', data)
  },
  async GET_ONLINE_PAY_LINK ({ commit }, payload) {
    let Url = 'http://sitetest.ayanmarket.kz/'
    if (process.env.NODE_ENV === 'production') {
      Url = 'https://ayanmarket.kz/'
    }
    const request = {
      orderIds: payload,
      successBackUrl: Url + 'page/successOrder',
      failureBackUrl: Url + 'page/orders'
    }
    try {
      const data = await this.$axios.$post(`${API}airbapay/create/payments`, request)
      if (data.type !== 'error') {
        return data
      }
    } catch {}
  },
  async GET_CREDIT_CARDS ({ commit }, payload) {
    const data = await this.$axios.$get(`${API}airbapay/cards/${payload}`)
    commit('SET_CREDIT_CARDS', data)
  },
  async ADD_CREDIT_CARD ({ commit }, payload) {
    let Url = 'http://sitetest.ayanmarket.kz/'
    if (process.env.NODE_ENV === 'production') {
      Url = 'https://ayanmarket.kz/'
    }
    const request = {
      clientId: payload,
      successBackUrl: Url + 'page/personal-office',
      failureBackUrl: Url + 'page/personal-office'
    }
    const data = await this.$axios.$post(`${API}airbapay/add/card`, request)
    if (data.type !== 'error') {
      return data
    }
  },
  async DELETE_CREDIT_CARD ({ commit }, payload) {
    const data = await this.$axios.$delete(`${API}airbapay/card/delete/${payload}`)
    return data
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
