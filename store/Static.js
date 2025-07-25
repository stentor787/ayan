import { i18n } from '~/plugins/i18n'

const state = () => ({
  content: '',
  banners: {
    slider: [],
    alone: [],
    products: [],
    four: [],
    two: [],
    one: null,
    mainSlider: [] // Новый массив для основного слайдера
  },
  payload: ''
})

const getters = {
  STATE: state => state,
  BANNERS: state => state.banners,
  MAIN_SLIDER: state => state.banners.mainSlider // Геттер для основного слайдера
}

const mutations = {
  SET_CONTENT: (state, data) => {
    state.content = data
  },
  SET_BANNERS: (state, data) => {
    const sliderBanners = []
    const categoryBanners = []
    const productBanners = []
    const fourBanners = []
    const twoBanners = []
    let oneBanners = null
    const mainSliderBanners = [] // Массив для основного слайдера

    if (data.type === 'success') {
      data.data.forEach((element) => {
        if (element.bannerType) {
          if (element.bannerType.id === 1) {
            sliderBanners.push(element)
          }
          if (element.bannerType.id === 2) {
            categoryBanners.push(element)
          }
          if (element.bannerType.id === 3) {
            productBanners.push(element)
          }
          if (element.bannerType.id === 6) {
            fourBanners.push(element)
          }
          if (element.bannerType.id === 7) {
            twoBanners.push(element)
          }
          if (element.bannerType.id === 8) {
            oneBanners = element
          }
          if (element.bannerType.id === 9) {  // Обработка основного слайдера
            mainSliderBanners.push(element)
          }
        }
      })
      state.banners.four = fourBanners
      state.banners.two = twoBanners
      state.banners.one = oneBanners
      state.banners.slider = sliderBanners
      state.banners.alone = categoryBanners
      state.banners.products = productBanners
      state.banners.mainSlider = mainSliderBanners // Сохраняем основной слайдер
    }
  },
  SET_PAYLOAD: (state, payload) => {
    state.payload = payload
  }
}

const actions = {
  async GET_PAGE (context, { payload }) {
    try {
      let localization = 'ru'
      const localStorageLocalization = this.app.$cookies.get('localization')
      // Проверяем наличие значения локализации в localStorage
      if (localStorageLocalization === 'kz') {
        localization = localStorageLocalization
        i18n.locale = 'kz'
      }
      const response = await this.$api.Static.getStaticPage(localization, payload)
      context.commit('SET_CONTENT', response.content)
      context.commit('SET_PAYLOAD', payload)
      context.state.payload = payload
    } catch (error) {
      console.error('Error fetching page:', error)
    }
  },
  async GET_BANNERS ({ commit }, payload) {
    const data = await this.$api.Static.getBanners(payload)
    commit('SET_BANNERS', data)
  },
  async GET_CATEGORY_BANNER ({ commit }, categoryId) {
    const data = await this.$api.Static.getGategoryBanner({ categoryId, departments: this.$cookies.get('availableDepartments') || [5] })
    if (data.type !== 'error') {
      return data
    }
    return []
  },
  saveLocalizationToLocalStorage (context, language) {
    this.app.$cookies.set('localization', language)
    i18n.locale = 'kz'
  },

  deleteLocalizationLocalStorage () {
    this.app.$cookies.set('localization', 'ru')
    i18n.locale = 'ru'
  },
  checkLocaleLS () {
    if (this.app.$cookies.get('localization') === 'kz') {
      i18n.locale = 'kz'
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
