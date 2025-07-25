
import Vue from 'vue'
const API = process.env.NUXT_ENV_API_URL
const state = () => ({
  all: {},
  /**
   Тут хранятся категории с ключом равным id этой категории
   */
  productCategory: {},
  /**
   * список категорий видимо по которым идет поиск среди productCategory
   */
  showcaseProducts: [],
  // тут хранятся найденные продукты используется на старнице поиска
  findingProducts: [],
  shareProduct: {},
  filteredProducts: [],
  // объект с продуктами которые проскролили, и со страницей на которой остановились
  scrollProducts: {},
  // недавно просмотренные продукты
  viewProducts: [],
  // фотографии с отзывов
  imagesProviderProduct: []
})

const getters = {
  STATE: state => state,
  ALL: state => state.all,
  PRODUCT_CATEGORY: state => state.productCategory,
  SHOWCASE_PRODUCTS: state => state.showcaseProducts,
  FINDING_PRODUCTS: state => state.findingProducts,
  SHARE_PRODUCT: state => state.shareProduct,
  FILTERED_PRODUCTS: state => state.filteredProducts,
  SCROLL_PRODUCTS: state => state.scrollProducts,
  VIEW_PRODUCTS: state => state.viewProducts,
  IMAGES_PROVIDER_PRODUCT: state => state.imagesProviderProduct
}

const mutations = {
  SET_IMAGES_PROVIDER_PRODUCT: (state, images) => {
    state.imagesProviderProduct = images
  },
  SET_PRODUCTS_BY_CATEGORY: (state, data) => {
    // товары по запрещенным в этой апи фильтруются с бэка
    state.productCategory[data.key] = data.content
    if (data.content.length) {
      Vue.prototype.$Ecomerce.itemsList(data.content)
    }
  },
  SET_SHOWCASE_PRODUCTS: (state, data) => {
    const deprecatedIds = [122, 295, 136, 614, 131, 132, 130, 135, 127, 123, 613, 124, 126, 125, 147, 142, 143, 610, 609, 608, 792, 128, 134, 133, 611, 612, 304, 607, 606]
    // в категории скидки 60% могут прийти запрещенные товары, поэтому фильтруем ее до вывода
    if (data[170554]) {
      data[170554] = data[170554].filter(product => !deprecatedIds.includes(product.categoryId))
    }
    state.showcaseProducts = data
  },
  SET_PRODUCTS_SEARCH: (state, data) => {
    if (data.searchResult) {
      state.findingProducts = data.searchResult
      // если поиск не пустой вызываем событие просмотра GTM
      if (data.searchResult.content.length) {
        Vue.prototype.$Ecomerce.itemsList(data.searchResult.content)
      }
    } else {
      state.findingProducts = []
    }
  },
  SET_FILTER_PRODUCTS: (state, data) => {
    if (data) {
      state.filteredProducts = data.content
      if (data.content.length) {
        Vue.prototype.$Ecomerce.itemsList(data.content)
      }
    } else {
      state.filteredProducts = []
    }
  },
  CLEAR_PRODUCTS_CATEGORY: (state) => {
    state.productCategory = {}
  },
  SET_SHARE_PRODUCTS: (state, data) => {
    state.shareProduct = data
  },
  SET_SCROLLING_PRODUCTS: (state, data) => {
    state.scrollProducts = data
  },
  SET_VIEW_PRODUCTS: (state, data) => {
    const index = state.viewProducts.findIndex(product => product.providerProductId === data.providerProductId)
    if (index === -1) {
      if (state.viewProducts.length === 6) {
        state.viewProducts.pop()
        state.viewProducts.unshift(data)
      } else {
        state.viewProducts.unshift(data)
      }
    }
  }
}

const actions = {
  // input: { categories, size, page, departmentId, direction, priceFrom, priceTo, sortType, productName }
  async GET_PRODUCTS_BY_FILTER_WITH_PAGINATION ({ commit }, input) {
    const data = await this.$api.Products.findProductsByFilterWithPagination(input)
    commit('SET_PRODUCTS_SEARCH', data)
    const productsInfo = {
      maxPrice: data.maxPrice,
      providerIds: data.providerIds,
      categoryIds: data.categoryIdsForDiscount,
      departmentIds: data.departmentIds || [],
      feature: data.feature || []
    }
    return productsInfo
  },

  // in collection:
  async GET_PRODUCTS_BY_CATEGORY ({ commit }, payload) {
    const data = await this.$api.Products.getProductsByCategory(payload, this.app.$cookies.get('TOKEN'))
    if (data.status === 'error') {
      return
    }
    commit('SET_PRODUCTS_BY_CATEGORY', { key: payload.categoryId, ...data.searchResult })
    const productsInfo = {
      maxPrice: data.maxPrice,
      totalPages: data.searchResult.totalPages,
      providerIds: data.providerIds,
      categoryIds: data.categoryIdsForDiscount,
      departmentIds: data.departmentIds,
      feature: data.features
    }
    return productsInfo
  },

  // in showcase:
  async GET_SHOWCASE_PRODUCTS ({ commit }, input) {
    const data = await this.$api.Products.getShowcaseProducts(
      { departmentsIds: input },
      this.app.$cookies.get('TOKEN')
    )
    commit('SET_SHOWCASE_PRODUCTS', data)
    return data
  },

  async GET_DEFAULT_SHOWCASE_PRODUCTS ({ commit }) {
    const data = await this.$api.Products.getDefaultShowcaseProducts()
    commit('SET_SHOWCASE_PRODUCTS', data)
  },

  async FIND_PRODUCT_BY_ID ({ commit }, { productId, providerId, departmentId }) {
    const data = await this.$axios.$post(
      `${API}site/provider/product/get`,
      { productId, providerId, departmentId }
    )
    return data
  },

  // in search + header:
  async SEARCH_PRODUCT ({ commit }, input) {
    try {
      const response = await this.$axios.$post(
        `${API}site/product/find/products`,
        {
          departmentId: input.departmentId,
          name: input.name,
          page: input.page,
          pageSize: input.pageSize
        }
      )
      return response
    } catch (error) {
      return {
        type: 'error'
      }
    }
  },
  GET_CLEAR_PRODUCTS ({ commit }) {
    commit('CLEAR_PRODUCTS_CATEGORY')
  },
  // страница продукта
  async GET_SHARE_PRODUCT ({ commit }, body) {
    try {
      const data = await this.$axios.$post(
        `${API}site/provider/product/get/shared`,
        body,
        {
          headers: {
            TOKEN: this.app.$cookies.get('TOKEN')
          }
        }
      )
      commit('SET_SHARE_PRODUCTS', data)
    } catch {
      commit('SET_SHARE_PRODUCTS', {})
    }
  },
  async GET_IMAGES_PROVIDER_PRODUCT ({ commit, state }, { providerProductId }) {
    try {
      const response = await this.$axios.get(`${API}site/provider/review/get/images/${providerProductId}`)
      const images = response.data
      commit('SET_IMAGES_PROVIDER_PRODUCT', images)
      return images
    } catch (error) {
      console.error('Ошибка при загрузке изображений продукта', error)
      throw error
    }
  },
  async GET_FILTER_PRODUCTS ({ commit }, filters) {
    const data = await this.$api.Products.getFilteredProducts(filters, this.app.$cookies.get('TOKEN'))
    commit('SET_FILTER_PRODUCTS', data)
    return data.totalPages
  },
  SAVE_SCROLLING_PRODUCTS ({ commit }, products) {
    commit('SET_SCROLLING_PRODUCTS', products)
  },
  SAVE_TO_VIEW_PRODUCTS ({ commit }, product) {
    commit('SET_VIEW_PRODUCTS', product)
  },
  SEND_BROKEN_IMAGE ({ _ }, productId) {
    try {
      this.$axios.$post(`${API}brokenImageProduct/add/${productId}`)
    } catch {}
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
