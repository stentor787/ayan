const API = process.env.NUXT_ENV_API_URL
const state = () => ({
  all: []
})

const getters = {
  STATE: state => state
}

const mutations = {}

const actions = {
  async GET_LINK ({ commit }, redirectId) {
    try {
      return await this.$axios.$get(`${API}site/redirect/single/${redirectId}`)
    } catch (error) {
      return {
        type: 'error'
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
