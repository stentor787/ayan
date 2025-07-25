const API = process.env.NUXT_ENV_API_URL
const state = () => ({
  all: []
})

const getters = {
  STATE: state => state
}

const mutations = {}

const actions = {
  async CREATE_CLIENT_CODE ({ commit }, input) {
    try {
      return await this.$axios.$post(`${API}site/client/code`, input)
    } catch (error) {
      return error.response.data
    }
  },
  async CODE_VERIFY ({ commit }, input) {
    try {
      return await this.$axios.$post(`${API}site/client/verify`, input)
    } catch (error) {
      return {
        type: 'error'
      }
    }
  },
  async CODE_AUTH ({ commit }, input) {
    try {
      return await this.$axios.$post(`${API}site/client/verify/token`, input)
    } catch (error) {
      return {
        type: 'error',
        text: error.response.data ? error.response.data.text : 'Неверный код'
      }
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
