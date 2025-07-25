const API = process.env.NUXT_ENV_API_URL

const actions = {
  async LOGIN ({ _ }, body) {
    try {
      const data = await this.$axios.post(`${API}loyalty/activatedLoyalty/${this.$cookies.get('clientId')}`, body)
      return data
    } catch {
      return { type: 'error' }
    }
  },

  async REGISTRATION ({ _ }, body) {
    try {
      const data = await this.$axios.post(`${API}loyalty/activateClientService/${this.$cookies.get('clientId')}`, body)
      return data
    } catch {
      return { type: 'error' }
    }
  },

  async GET_CARDS () {
    try {
      const response = await this.$axios.get(`${API}loyalty/getClientLoyaltyData/${this.$cookies.get('clientId')}`)
      return response.data
    } catch {
      return { type: 'error' }
    }
  }
}

export default {
  actions
}
