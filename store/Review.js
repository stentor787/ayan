const API = process.env.NUXT_ENV_API_URL
const state = () => ({
  meta: {}
})

const getters = {
  STATE: state => state
}

const mutations = {
  SET_META: (state, data) => {
    if (data.type === 'success') {
      state.meta = data.data
    }
  }
}

const actions = {
  async SEND_REVIEW ({ commit }, payload) {
    try {
      return await this.$axios.post(`${API}client/provider/order/review/post`, payload)
    } catch (error) {
      return {
        type: 'error'
      }
    }
  },
  async GET_TAGS ({ commit }, rating) {
    try {
      return await this.$axios.get(`${API}client/provider/order/review/tags/${rating}`)
    } catch (error) {
      return {
        type: 'error'
      }
    }
  },
  async CREATE_PRODUCT_REVIEW ({ commit }, payload) {
    return await this.$api.Reviews.createReview(payload, this.app.$cookies.get('TOKEN'))
  },
  async GET_REVIEWS ({ commit }, payload) {
    return await this.$api.Reviews.getProductReview(payload, this.app.$cookies.get('TOKEN'))
  },
  async PLUS_LIKE ({ commit }, payload) {
    await this.$api.Reviews.plusLike(payload, this.app.$cookies.get('TOKEN'))
  },
  async MINUS_LIKE ({ commit }, payload) {
    await this.$api.Reviews.minusLike(payload, this.app.$cookies.get('TOKEN'))
  },
  async PLUS_DISLIKE ({ commit }, payload) {
    await this.$api.Reviews.plusDislike(payload, this.app.$cookies.get('TOKEN'))
  },
  async MINUS_DISLIKE ({ commit }, payload) {
    await this.$api.Reviews.minusDislike(payload, this.app.$cookies.get('TOKEN'))
  },
  async DOWNLOAD_REVIEW_FOTO ({ commit }, payload) {
    const data = await this.$api.Reviews.downloadReviewFoto(payload, this.app.$cookies.get('TOKEN'))
    return data
  },
  async CHECK_REVIEW({ commit }, { clientId, productId }) {
    try {
      // вызывает метод checkReview из API-модуля
      const response = await this.$api.Reviews.checkReview(clientId, productId, this.app.$cookies.get('TOKEN'))
      return response // ожидается, что API вернёт true или false
    } catch (error) {
      console.error('Error in CHECK_REVIEW action:', error)
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
