const API = process.env.NUXT_ENV_API_URL
const state = () => ({
  topProducts: {},
  topCategories: {}
})
const getters = {
  STATE: state => state
}
const mutations = {
  SET_TOP_PRODUCTS: (state, data) => {
    if (data !== null && data.length > 0) {
      state.topProducts = data
    } else {
      state.topProducts = {}
    }
  },
  SET_TOP_CATEGORIES: (state, data) => {
    if (data !== null && data.length > 0) {
      state.topCategories = data
    } else {
      state.topCategories = {}
    }
  },
  CLEAR_DATA: (state) => {
    state.tags = {}
    state.topCategories = {}
    state.topProducts = {}
  }
}

const actions = {
  async SEARCH_ALL_IN_ELASTIC ({ commit }, body) {
    const response = await this.$axios.post(`${API}elastic/product/search`, body)
    return response
  },
  async GET_DATA_IN_ELASTIC ({ commit, dispatch }, body) {
    const { data } = await dispatch('SEARCH_ALL_IN_ELASTIC', body)
    commit('SET_TOP_PRODUCTS', data.productData)
    commit('SET_TOP_CATEGORIES', data.categoryData)
  },
  GET_CLEAR_DATA ({ commit }) {
    commit('CLEAR_DATA')
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
