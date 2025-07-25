const API = process.env.NUXT_ENV_API_URL

const state = () => ({
  all: []
})

const getters = {
  STATE: state => state
}

const mutations = {
  SET_PROVIDERS: (state, data) => {
    state.all = data
  }
}
const actions = {
  async GET_PROVIDERS ({ commit }) {
    const { data } = await this.$axios.get(`${API}site/provider/getAll`)
    commit('SET_PROVIDERS', data)
    return data
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
