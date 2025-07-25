const API = process.env.NUXT_ENV_API_URL
const state = () => ({
  errorsList: []
})

const getters = {
  STATE: state => state,
  SINGLE: state => state.single
}

const mutations = {
  SET_ALL_ERRORS: (state, data) => {
    if (data.type === 'success') {
      state.errorsList = data.data
    }
  }
}

const actions = {
  async GET_ALL_ERRORS ({ commit }) {
    const data = await this.$axios.$get(`${API}site/wrong/product/all/errors`)
    commit('SET_ALL_ERRORS', data)
  },
  async SEND_ERROR ({ commit }, payload) {
    let data = {}
    try {
      data = await this.$axios.$post(`${API}site/wrong/product/add`, payload, {
        headers: {
          TOKEN: 'a'
        }
      })
      if (data.type === 'success') {
        return data
      }
    } catch (error) {
      return 0
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
