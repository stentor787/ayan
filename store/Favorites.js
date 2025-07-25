/* eslint-disable */

const state = () => ({
  pageableProductsList: {},
  departmentsList: []
});

const getters = {
  STATE: s => s,
  FAVORITE_DEPARTMENTS: s => s.departmentsList,
  FAVORITE_PRODUCTS: s => s.pageableProductsList
};

const mutations = {
  SET_PRODUCTS: (state, data) => {
    state.pageableProductsList = data;
  },
  REMOVE_PRODUCT: (state, data) => {
    state.pageableProductsList?.content.splice(data, 1);
  },
  SET_DEPARTMENTS: (state, data) => {
    state.departmentsList = data;
  }
};

const actions = {
  // достает избранные департаменты, по токену определяет пользователя
  async GET_FAV_DEPARTMENTS({ commit }, clientId) {
    const response = await this.$api.Favorites.getDepartments(
      clientId,
      this.app.$cookies.get("TOKEN")
    );
    commit("SET_DEPARTMENTS", response);
    return response;
  },
  async ADD_DEPARTMENT_TO_FAV({ commit }, input) {
    const response = await this.$api.Favorites.addDepartment(
      input,
      this.app.$cookies.get("TOKEN")
    );
    return response;
  },
  async REMOVE_DEPARTMENT_FROM_FAV({ commit }, input) {
    const response = await this.$api.Favorites.deleteDepartment(
      input,
      this.app.$cookies.get("TOKEN")
    );
    return response;
  },

  // достает фильтрованные избранные продукты в объекте пагинации,
  // по токену определяет пользователя
  async GET_FAV_PRODUCTS_WITH_FILTER({ commit }, input) {
    const response = await this.$api.Favorites.getProductsWithFilter(
      input,
      this.app.$cookies.get("TOKEN")
    );
    commit("SET_PRODUCTS", response);
    return response;
  },
  // достает избранные продукты в объекте пагинации,
  // по токену определяет пользователя
  async GET_FAV_PRODUCTS({ commit }, input) {
    const response = await this.$api.Favorites.getProducts(
      input,
      this.app.$cookies.get("TOKEN")
    );
    commit("SET_PRODUCTS", response.searchResult);
    const productsInfo = {
      maxPrice: response.maxPrice,
      providerIds: response.providerIds,
      categoryIds: response.categoryIdsForDiscount,
      departmentIds: response.departmentIds || [],
      feature: response.feature || []
    }
    return productsInfo;
  },
  async ADD_PRODUCT_TO_FAV({ commit }, productId) {
    const response = await this.$api.Favorites.addProduct(
      productId,
      this.app.$cookies.get("TOKEN")
    );
    return response;
  },
  async REMOVE_PRODUCT_FROM_FAV({ commit, state }, productId) {
    const response = await this.$api.Favorites.deleteProduct(
      productId,
      this.app.$cookies.get("TOKEN")
    );
    if (!response && state.pageableProductsList.content) {
      const idInList = state.pageableProductsList.content.findIndex(
        el => productId === el.providerProductId
      );
      if (idInList > -1) {
        commit("REMOVE_PRODUCT", idInList);
      }
    }
    return response;
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
