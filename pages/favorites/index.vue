<template>
  <div v-if="loading" class="loader-big">
    <v-progress-circular indeterminate color="#503CC3" />
  </div>
  <section v-else class="fav-page">
    <FiltersMobile v-if="productsInfo.maxPrice" :products-info="productsInfo" :departments="departments" @change-filters="changeFilters($event)" @clear-filters="clearFilters()" />
    <div class="fav-page__header">
      <div class="fav-page__main">
        <h1 class="fav-page__main-title pt-1">
          {{ $i18n.t("header.favorites") }}
        </h1>
      </div>
      <div class="fav-page__toggle-block">
        <v-btn
          :value="'products'"
          :class="[
            'fav-page__page-btn',
            { 'fav-page__page-btn_disabled': tab == 'products' }
          ]"
          :elevation="0"
          :color="tab == 'products' ? '#503CC3' : '#FAFAFA'"
          width="175px"
          height="40px"
          @click="tab = 'products'"
        >
          {{ $i18n.t("fav.products") }}
        </v-btn>
        <v-btn
          :value="'departments'"
          :class="[
            'fav-page__page-btn',
            { 'fav-page__page-btn_disabled': tab == 'departments' }
          ]"
          :elevation="0"
          :color="tab == 'departments' ? '#503CC3' : '#FAFAFA'"
          width="175px"
          height="40px"
          @click="tab = 'departments'"
        >
          {{ $i18n.t("fav.market") }}
        </v-btn>
      </div>
    </div>
    <v-tabs-items v-model="tab">
      <v-tab-item :value="'products'">
        <v-container v-if="!noFav" fluid>
          <v-row>
            <!-- отображение продуктов с фильтрами -->
            <div cols="2" class="fav-page_filters">
              <div v-show="showFilters" class="fav-page_filters_sticky">
                <Filters
                  v-if="productsInfo.maxPrice"
                  :products-info="productsInfo"
                  :departments="departments"
                  @change-filters="changeFilters($event)"
                  @clear-filters="clearFilters()"
                />
              </div>
            </div>
            <v-col>
              <v-row>
                <v-col
                  align-self="center"
                  class="fav-page_products"
                >
                  <ProductCard
                    v-for="product in favProducts"
                    :key="product.providerProductId"
                    :product="product"
                    style="margin-left:5px"
                  />
                </v-col>
                <!-- пагинация -->
                <Pagination :total-pages="FAVORITES.pageableProductsList.totalPages" :active-page="page" :fetching="fetching" @change-page="changePage($event)" />
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <p v-else class="noFavorite">
          {{ $i18n.t("fav.noFav") }} :-(
        </p>
      </v-tab-item>
      <v-tab-item
        :value="'departments'"
        min-height="70vh"
        rounded="lg"
        class="custom-tab"
      >
        <v-card
          v-for="departmentObject in FAVORITES.departmentsList"
          :key="departmentObject.department.id"
          class="brand-block"
          width="450"
          height="220"
          outlined
        >
          <v-list-item
            three-line
            style="display: flex; justify-content: space-between;"
          >
            <v-list-item-avatar tile size="120">
              <v-img
                :lazy-src="
                  'https://ayanmarket.kz/products/images/4770190051347.png'
                "
                :src="
                  departmentObject.image ? departmentObject.image.fileUrl : ''
                "
                :alt="departmentObject.image ? departmentObject.image.alt : ''"
                :title="
                  departmentObject.image ? departmentObject.image.title : ''
                "
                min-height="100%"
                height="100%"
                contain
              />
            </v-list-item-avatar>
            <v-list-item-action style="margin-right: 0px !important;">
              <v-list-item-action-text>
                <v-btn
                  :elevation="0"
                  color="red"
                  icon
                  @click="
                    removeDepartmentFromFavorite(departmentObject.department.id)
                  "
                >
                  <v-icon>
                    mdi-heart
                  </v-icon>
                </v-btn>
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>

          <v-card-actions>
            <p
              class="brand-block_text"
              @click="goToDepartment(departmentObject.department.id)"
            >
              {{
                departmentObject.department.name +
                  " " +
                  departmentObject.department.address.street +
                  " " +
                  departmentObject.department.address.house
              }}
            </p>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from "vuex";
import Pagination from '@/components/Pagination/Pagination'
export default {
  name: "FavoritePage",
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      items: ["products", "departments"],
      tab: "products",
      favProducts: [],
      productsInfo: {},
      page: 0,
      fetching: false,
      noFav: false,
      departments: [],
      filters: {},
      filterMode: false,
      showFilters: true,
      singlePageMode: true
    };
  },
  computed: {
    ...mapGetters({
      FAVORITES: "Favorites/STATE"
    })
  },
  async mounted() {
    // когда удаляем продукт из избранных вызываем список любимых заново
    this.$eventBus.$on("delete-favorite", () => {
      this.clearFilters();
    });
    this.loading = true;
    this.getDepatrments();
    await this.getFav();
    this.renderDeps();
    this.loading = false;
  },
  methods: {
    ...mapActions({
      GET_FAV_DEPARTMENTS: "Favorites/GET_FAV_DEPARTMENTS",
      GET_FAV_PRODUCTS: "Favorites/GET_FAV_PRODUCTS",
      GET_FAV_PRODUCTS_WITH_FILTER: "Favorites/GET_FAV_PRODUCTS_WITH_FILTER",
      REMOVE_DEPARTMENT_FROM_FAV: "Favorites/REMOVE_DEPARTMENT_FROM_FAV"
    }),
    async changePage (page) {
      if (page === undefined) {
        this.page++
        this.singlePageMode = false
      } else {
        this.page = page
        this.singlePageMode = true
      }
      this.fetching = true
      if (this.filterMode) {
          await this.renderFilteredProducts();
      } else {
          await this.getFav();
      }
      // если новая страница то поднимаем вверх
      page && window.scrollTo(0, 0)
      this.fetching = false
    },
    //  перерисовать страницу когда убрали все фильтры
    clearPage() {
      this.page = 0;
      this.favProducts = [];
      this.fetching = false;
    },
    clearFilters() {
      window.scrollTo(0, 0);
      this.filterMode = false;
      this.filters = {};
      this.clearPage();
      this.getFav();
    },
    changeFilters(filters) {
      window.scrollTo(0, 0);
      this.filterMode = true;
      this.filters = filters;
      this.clearPage();
      this.renderFilteredProducts();
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    // получить 1 страницу продуктов с пагинацией
    async getFav() {
      this.fetching = true;
      const productsInfo = await this.GET_FAV_PRODUCTS({
        clientId: this.$cookies.get("clientId"),
        departmentIds: this.$cookies.get("availableDepartments"),
        page: this.page,
        pageSize: 32
      });
      this.productsInfo = productsInfo;
      this.productsInfo.showCategory = true;
      this.fetching = false;
      if (this.singlePageMode) {
        this.favProducts = this.FAVORITES.pageableProductsList.content
      } else {
        this.favProducts = this.favProducts.concat(
          this.FAVORITES.pageableProductsList.content
      );
      }
   
      // если продуктов нет, выдаем сообщение
      if (this.favProducts.length === 0) {
        this.noFav = true;
      } else {
        this.noFav = false;
      }
      this.fetching = false;
    },
    // получить фильтрованные продукты
    async renderFilteredProducts() {
      this.loading = true;
      this.fetching = true;
      await this.GET_FAV_PRODUCTS_WITH_FILTER({
        departmentIds: this.filters.departmentIds.length
            ? this.filters.departmentIds
            : this.departments,
        page: 0,
        size: 150,
        categoryIds: this.filters.categoryIds.length
            ? this.filters.categoryIds
            : [],
        providerIds: this.filters.providerIds,
        featureValues: this.filters.featureValues,
        minPrice: this.filters.price[0],
        maxPrice: this.filters.price[1],
        onlyFavorite: true,
        priceSortAsc: false,
        discount: this.filters.discount
      });
      if (this.singlePageMode) {
        this.favProducts = this.FAVORITES.pageableProductsList.content
      } else {
        this.favProducts = this.favProducts.concat(
          this.FAVORITES.pageableProductsList.content
      );}
      this.loading = false;
      this.fetching = false;
    },
    async renderDeps() {
      await this.GET_FAV_DEPARTMENTS(this.$cookies.get("clientId"));
    },
    async removeDepartmentFromFavorite(departmentId) {
      await this.REMOVE_DEPARTMENT_FROM_FAV(departmentId);
      this.renderDeps();
      this.$eventBus.$emit("removeFavDep");
    },
    goToDepartment(depId) {
      this.$router.push("/profile/" + depId);
    },
    getDepatrments() {
      if (this.$cookies.get("availableDepartments")) {
        this.departments = this.$cookies.get("availableDepartments");
      } else {
        this.departments = [5, 1092, 1093, 1163];
      }
    }
  },
  head() {
    return {
      title: "Избранные",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Избранные"
        }
      ],
      link: [
        {
          rel: "canonical",
          href: `https://ayanmarket.kz${this.$route.path}`
        }
      ]
    };
  }
};
</script>

<style lang="scss">
@import "./style.scss";
</style>