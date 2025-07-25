
const state = () => ({
  UTM: {}
})

const getters = {
  UTM: state => state.UTM
}

const mutations = {
  SET_UTM_DATA: (state, data) => {
    state.UTM = data
  }
}

const actions = {
  SET_SEO_UTM ({ commit }, data) {
    commit('SET_UTM_DATA', data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
