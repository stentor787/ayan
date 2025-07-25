<template>
  <div class="mb-6">
    <div class="showcase-conteiner__main">
      <h1 class="showcase-conteiner__main-title">
        {{ $i18n.t("header.search") }}
      </h1>
    </div>
    <ActiveShop v-if="GEO.activeShop.id" />
    <FiltersMobile v-if="productsInfo.maxPrice" :products-info="productsInfo" :departments="departments" @change-filters="changeFilters($event)" @clear-filters="clearFilters()" />
    <!-- Если нет результатов поиска -->
    <div class="showcase-conteiner_no-results">
      <div v-if="noResults && $route.params.id" class="ml-2">
        {{ $i18n.t("search.result") }} "{{ searchText }}" {{ $i18n.t("search.noResults2") }}
      </div>
      <div v-else-if="!$route.params.id" class="ml-2">
        {{ $i18n.t("search.noResults") }}
      </div>
      <div v-else class="ml-2">
        {{ $i18n.t("search.result") }} "{{ searchText }}"
      </div>
    </div>
    <div v-if="loading" class="loader-big">
      <v-progress-circular indeterminate color="#503CC3" />
    </div>
    <!-- Основной блок -->
    <div v-else class="showcase-conteiner_category">
      <!-- фильтры -->
      <div class="showcase-conteiner_filters">
        <div class="showcase-conteiner_filters_sticky">
          <div class="sticky-element">
            <Filters v-if="productsInfo.maxPrice" :products-info="productsInfo" :departments="departments" @change-filters="changeFilters($event)" @clear-filters="clearFilters()" />
          </div>
        </div>
        <!-- чтобы работал липкий элемент нужны соседи -->
        <div class="showcase-conteiner_filters_sticky-sibling" />
      </div>
      <!-- Продукты -->
      <div class="showcase-conteiner_products">
        <d-product-card
          v-for="product in products"
          :key="product.providerProductId"
          :product="product"
          style="margin-left:5px"
          class="d-flex card_body_width"
        />
        <!-- пагинация -->
        <Pagination :total-pages="PRODUCTS.totalPages" :active-page="activePage" :fetching="fetching" @change-page="changePage($event)" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DProductCard from '@/components/ProductCard/ProductCard'
import Pagination from '@/components/Pagination/Pagination'
import ActiveShop from '@/components/ActiveShop/ActiveShop'
export default {
  components: {
    DProductCard,
    Pagination,
    ActiveShop
  },
  data () {
    return {
      activePage: 0,
      noResults: false,
      loading: false,
      products: [],
      fetching: false,
      searchText: '',
      productsInfo: {},
      departments: [],
      singlePageMode: false,
      filters: {
        departmentIds: [],
        categoryIds: []
      }
    }
  },
  computed: {
    ...mapGetters({
      PRODUCTS: 'Products/FINDING_PRODUCTS',
      GEO: 'GEO/STATE'
    })
  },
  async mounted () {
    this.$eventBus.$on('changeDepartment', () => this.$router.push('/'))
    this.searchText = this.$route.params.id.replaceAll('_', '/').replaceAll('$', '%')
    this.getDepatrments()
    await this.getpage()
    if (this.products.length === 0) {
      this.noResults = true
    }
  },
  methods: {
    ...mapActions({
      GET_PRODUCTS_BY_FILTER_WITH_PAGINATION: 'Products/GET_PRODUCTS_BY_FILTER_WITH_PAGINATION'
    }),
    async getpage () {
      if (!this.fetching) {
        this.loading = true
      }
      const productsInfo = await this.GET_PRODUCTS_BY_FILTER_WITH_PAGINATION({
        categories: this.filters.categoryIds.length ? this.filters.categoryIds : [],
        size: 32,
        page: this.activePage,
        departmentIds: this.filters.departmentIds.length ? this.filters.departmentIds : this.departments,
        featureValues: this.filters.featureValues,
        providerIds: this.filters.providerIds,
        direction: 'DESC',
        priceFrom: this.filters.price ? this.filters.price[0] : 0,
        priceTo: this.filters.price ? this.filters.price[1] : 100000,
        sortType: '',
        productName: this.searchText,
        discount: this.filters.discount
      })
      this.productsInfo = productsInfo
      this.productsInfo.showCategory = true
      if (this.PRODUCTS.content) {
        // складываем продукты или обновляем
        if (this.singlePageMode) {
          this.products = this.PRODUCTS.content
        } else {
          this.products = this.products.concat(this.PRODUCTS.content)
        }
        this.noResults = false
      } else {
        this.products = []
      }
      this.loading = false
    },
    async changePage (page) {
      if (page === undefined) {
        this.activePage++
        this.singlePageMode = false
      } else {
        this.activePage = page
        this.singlePageMode = true
      }
      this.fetching = true
      await this.getpage()
      // если новая страница то поднимаем вверх
      page && window.scrollTo(0, 0)
      this.fetching = false
    },
    serializeProducts (productList) {
      return productList.map((product) => {
        const productKeys = Object.keys(product)
        return {
          ...product,
          image: productKeys.includes('image') ? product.image[0] : '',
          barcode: productKeys.includes('productBarcode') ? product.productBarcode[0] : 'no-value',
          price: product.prices[this.GEO.departmentId],
          discount: product.discount[this.GEO.departmentId]
        }
      })
    },
    getDepatrments () {
      // если режим активного магазина то устанавливаем только 1 департамент
      if (this.GEO.activeShop.id) {
        this.departments = [this.GEO.activeShop.id]
        return
      }
      if (this.$cookies.get('availableDepartments')) {
        this.departments = this.$cookies.get('availableDepartments')
      } else {
        this.departments = [5, 1092, 1093, 1163]
      }
    },
    clearFilters () {
      window.scrollTo(0, 0)
      this.filters = {
        departmentIds: [],
        categoryIds: []
      }
      this.clearPage()
      this.getpage()
    },
    changeFilters (filters) {
      window.scrollTo(0, 0)
      this.filters = filters
      this.clearPage()
      this.getpage()
    },
    clearPage () {
      this.activePage = 0
      this.products = []
      this.fetching = false
    }
  },
  head () {
    return {
      title: `Поиск по запросу ${this.searchText}`,
      meta: [
        {
          hid: 'description',
          title: 'description',
          content: `Страница поиска товаров по запросу ${this.searchText} | Ayanmarket`
        },
        { name: 'robots', content: 'noindex' }
      ]
    }
  }
}
</script>
<style lang="scss">
  @import './style.scss';
</style>
