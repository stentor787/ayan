
const state = () => ({
  clientAdress: {},
  clientSingle: {},
  clientOrders: {}
})

const getters = {
  STATE: state => state
}

const mutations = {
  SET_CLIENT_ADRESS_LIST: (state, data) => {
    if (data.type === 'success') {
      state.clientAdress = data.data
    }
  }
}

const actions = {
  checkToken ({ commit, dispatch }, input) {
    const tokenData = process.browser ? JSON.parse(localStorage.getItem('refToken')) : this.app.$cookies.get('TOKEN')
    if (tokenData) {
      const expTime = new Date(tokenData.tokenExpirationDate).getTime()
      const expTimeOfRefresh = new Date(
        tokenData.refreshTokenExpirationDate
      ).getTime()
      const curTime = new Date().getTime()
      // если рефреш токен тоже истек удаляем старый токен и лс
      if (expTimeOfRefresh - curTime <= 50000) {
        this.app.$cookies.remove('TOKEN')
        this.app.$cookies.remove('clientId')
        if (process.browser) {
          localStorage.removeItem('refToken')
          localStorage.removeItem('info')
        }
        return
      }
      //  Сравниваем, если разница более 50 секунд - запускаем процедуру получения нового токена из стора
      if (expTime - curTime <= 50000) {
        this.app.$cookies.remove('TOKEN')
        if (process.browser) {
          localStorage.removeItem('refToken')
        }
        return dispatch('refreshToken', { refreshToken: tokenData.refreshToken })
      }
    }
  },
  async singIn ({ commit }, input) {
    try {
      const data = await this.$api.Auth.signIn(input)
      return data
    } catch (error) {
      return {
        type: 'error'
      }
    }
  },
  async refreshToken ({ commit }, input) {
    try {
      const data = await this.$api.Auth.refreshToken(input)
      this.app.$cookies.set('TOKEN', data.token)
      if (process.browser) {
        localStorage.setItem('refToken', JSON.stringify(data))
      }
    } catch (error) {
      this.$cookies.remove('clientId')
      if (process.browser) {
        localStorage.removeItem('info')
      }
      return {
        type: 'error'
      }
    }
  },
  async signUp ({ commit }, input) {
    try {
      return await this.$api.Auth.signUp(input)
    } catch (error) {
      return {
        type: 'error'
      }
    }
  },
  async resetPass ({ commit }, input) {
    try {
      return await this.$api.Auth.resetPass(input)
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
