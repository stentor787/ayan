const state = () => ({
  /**
   * категории для каталога
   * используется в: HoverPanel, MobilePanel
   */
  catalogCategories: [],
  /**
   * список тех самых 18-20 категорий, которые показываются на showcase,
   * в списке хранятся объекты самих категорий, а не только их id.
   * Используется в: showcase,
   */
  showcaseCategories: [],
  // для оптимизации, категории которые уже скачаны, чтобы не деграть лишний раз апишки
  availableCategory: {},
  // отдельный стор для HoverPanel
  hoverPanelCategories: [],
  // отдельный стор для категорий, рендеряться на сервере если нет департамента в куках
  departmentCategories: []
})

const getters = {
  STATE: s => s,
  CATALOG_CATEGORIES: s => s.catalogCategories,
  SHOWCASE_CATEGORIES: s => s.showcaseCategories,
  AVAILABLE: s => s.availableCategory,
  HOVER_PANEL_CATEGORIES: s => s.hoverPanelCategories,
  DEPARTMENT_CATEGORIES: s => s.departmentCategories
}

const mutations = {
  SET_CATALOG_CATEGORIES: (state, data) => {
    state.catalogCategories = data
  },
  SET_SHOWCASE_CATEGORY: (state, data) => {
    state.showcaseCategories = data
  },
  SET_AVAILABLE_CATEGORY: (state, data) => {
    state.availableCategory[data.id] = data
  },
  REMOVE_AVAILABLE_CATEGORY: (state, id) => {
    state.availableCategory[id] = null
  },
  SET_HOVER_PANEL_CATEGORIES: (state, data) => {
    state.hoverPanelCategories = data
  },
  SET_DEPARTMENT_CATEGORIES: (state, data) => {
    state.departmentCategories = data
  }
}

const actions = {
  async GET_HOVER_PANEL_CATEGORIES ({ commit, rootState }, availableDepartments) {
    const availableDeps = availableDepartments || rootState.GEO.info.depIds
    let response = await this.$api.Category.getAllMainCategories(availableDeps)
    response = response.map((category) => {
      if (category.id === 170412) {
        category.children = category.children.filter(cat => cat.id !== 122)
      }
      return category
    })
    // добавляет все категории в доступные, но запросы на отдельные категории все равно дергаются иногда,
    // потому что эти категории грузятся очень медленно, плюс промокатегорий тут нет
    function setAll (category) {
      category.forEach((element) => {
        commit('SET_AVAILABLE_CATEGORY', element)
        if (element.children) {
          setAll(element.children)
        }
      })
    }
    setAll(response)
    commit('SET_CATALOG_CATEGORIES', response)
    commit('SET_HOVER_PANEL_CATEGORIES', response)
    return response
  },

  async GET_SHOWCASE_CATEGORIES ({ commit }, payload) {
    let data = await this.$api.Category.getShowcaseCategories({ departmentsIds: payload })
    data = data.filter(category => category.categoryId !== 122)
    commit('SET_SHOWCASE_CATEGORY', data)
  },

  async GET_GATEGORY_BY_ID ({ commit, rootState }, categoryId) {
    const departments = this.app.$cookies.get('availableDepartments') || rootState.GEO.info.depIds
    const payload = {
      departments,
      categoryId
    }
    const data = await this.$api.Category.getCategoryById(payload)
    if (!data) {
      return
    }
    if (categoryId === 170412) {
      data.children = data.children.filter(cat => cat.id !== 122)
    }
    // детей тоже закидываем в доступные категории, чтобы при переходе верно определсялось древо категорий
    if (data.children && data.children.length) {
      data.children.forEach((children) => {
        commit('SET_AVAILABLE_CATEGORY', children)
      })
    }
    commit('SET_AVAILABLE_CATEGORY', data)
    return data
  },
  async GET_CATEGORIES_BY_DEPARTMENT ({ commit }) {
    const data = await this.$api.Category.getDepartmentCategory()
    commit('SET_DEPARTMENT_CATEGORIES', data)
  },
  REMOVE_FROM_AVAILABLE ({ commit }, id) {
    commit('REMOVE_AVAILABLE_CATEGORY', id)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
