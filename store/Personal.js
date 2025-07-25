import Vue from 'vue'
const API = process.env.NUXT_ENV_API_URL

const state = () => ({
  clientAdress: [],
  clientSingle: {},
  clientOrders: [],
  tokenInfo: null,
  isLoggin: false
})

const getters = {
  STATE: state => state
}

const mutations = {
  SET_CLIENT_ADRESS_LIST: (state, data) => {
    if (data.type === 'success') {
      state.clientAdress = data.data
    }
  },
  SET_CLIENT: (state, data) => {
    if (data.type !== 'error') {
      state.clientSingle = data
    }
  },
  SET_ORDERS_LIST: (state, data) => {
    state.clientOrders = data
  },
  SET_CLIENT_INFO: (state, data) => {
    state.tokenInfo = data
  },
  SET_IS_LOGGIN: (state, data) => {
    state.isLoggin = data
  }
}

const actions = {
  async getClientAdress ({ commit }, id) {
    const data = await this.$axios.$get(`${API}client/${id}/address`, {
      headers: {
        TOKEN: this.app.$cookies.get('TOKEN')
      }
    })
    commit('SET_CLIENT_ADRESS_LIST', data)
    return data
  },
  async addClientAdress ({ commit }, input) {
    try {
      return await this.$axios.$post(`${API}client/address/${input.clientId}/add`, input.input, {
        headers: {
          TOKEN: this.app.$cookies.get('TOKEN')
        }
      })
    } catch (error) {
      return {
        type: 'error'
      }
    }
  },
  async deleteClientAdress ({ commit }, addressId) {
    try {
      return await this.$axios.$delete(`${API}client/address/delete/${addressId}`, {
        headers: {
          TOKEN: this.app.$cookies.get('TOKEN')
        }
      })
    } catch (error) {
      return {
        type: 'error'
      }
    }
  },
  async editClient ({ dispatch }, input) {
    try {
      await this.$axios.$put(`${API}client/update`, input, {
        headers: {
          TOKEN: this.app.$cookies.get('TOKEN')
        }
      })
      dispatch('getClient', input.id)
    } catch (error) {
      return {
        type: 'error'
      }
    }
  },
  async getClient ({ commit }, input) {
    const data = await this.$axios.$get(`${API}web/client/${input}`, {
      headers: {
        TOKEN: this.app.$cookies.get('TOKEN')
      }
    })
    commit('SET_CLIENT', data)
  },
  async getClientOrders ({ commit }) {
    const data = await this.$api.Personal.getClientOrders(
      this.app.$cookies.get('TOKEN')
    )
    commit('SET_ORDERS_LIST', data)
  },
  async orderProducts ({ commit }, id) {
    try {
      return await this.$axios.$get(`${API}site/product/order/${id.order}/department/${id.department}`, {
        headers: {
          TOKEN: this.app.$cookies.get('TOKEN')
        }
      })
    } catch (error) {
      return {
        type: 'error'
      }
    }
  },
  async tokenInfo ({ commit }) {
    const data = await this.$axios.$get(`${API}admin/auth/token`, {
      headers: {
        TOKEN: 'Bearer ' + this.app.$cookies.get('TOKEN')
      }
    })
    Vue.prototype.$Ecomerce.authorization(data)
    Vue.prototype.$Ecomerce.authorizationComplete()
    commit('SET_CLIENT_INFO', data)
  },

  LOG_IN_OUT ({ commit }, input) {
    commit('SET_IS_LOGGIN', input)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
