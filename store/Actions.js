const state = () => ({
  all: []
})

const getters = {
  STATE: state => state.all
}

const mutations = {
  SET_ALL: (state, data) => {
    state.all = data
  }
}

const actions = {
  async GET_ALL ({ commit }, input) {
    const data = await this.$api.Actions.getAll(input)
    if (data.type !== 'error') {
      commit('SET_ALL', data)
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
