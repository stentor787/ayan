
  <template>
  <div style="width: 100%">
    <div
      v-if="searchWrapperShow"
      class="searchFade"
      @click="unsetFocus"
    />
    <div class="search">
      <div class="search_conteiner">
        

        <!-- Wrapper for the input and small block -->
      
          <input
            v-model.trim="searchData"
            class="search_input"
            :placeholder="GEO.activeShop.id ? $i18n.t('search.find0') + GEO.activeShop.info.departmentName : $i18n.t('search.find')"
            outlined
            clearable
            append-icon="mdi-magnify"
            color="#A0A0A0"
            hide-details
            background-color="#e9e9e9"
            style="font-size: 14px;
    padding: 0px 25px 0px 23px;
    border-radius: 38px;
    width: 574px;
    color:#A0A0A0;
    background-color: white;
    max-width: 574px;
    height: 42px;"
            @focus="setFocus"
            @click:clear="clearSearchData"
            @click:append="getSearchPage"
            @keypress.enter="getSearchPage"
          />
          <!-- Small block (5px width) on the right side -->
          <div class="small-block" @click="getSearchPage">
          <i class="icon-search"></i> <!-- Здесь теперь тег <i> -->
          </div>
        
      </div>

      <!-- Rest of the code remains the same -->
      <div v-if="searchWrapperShow" class="searchWrapper" @click.self="unsetFocus">
        <div class="searchContainer">
          <div class="categoryWrapper">
            <div v-if="!ELASTIC_SEARCH.topCategories.length" class="searchTitle category">
              <p>{{ $i18n.t('search.noFind') }}</p>
            </div>
            <div v-if="ELASTIC_SEARCH.topCategories && !!ELASTIC_SEARCH.topCategories.length > 0" class="searchTitle">
              {{ $i18n.t("search.category") }}
            </div>
            <div v-for="category in ELASTIC_SEARCH.topCategories" :key="category.id + category.name" class="category" @click="autoCategory(category)">
              {{ $i18n.locale === 'ru' ? category.name : category.nameKz }}
            </div>
          </div>
          <div class="searchHrLine" />
          <div class="productsWrapper">
            <div v-if="!ELASTIC_SEARCH.topProducts.length" class="productsWrapper__no-data">
              <p class="categoryWrapper_text">{{ $i18n.t('search.noFind') }}</p>
            </div>
            <span v-else class="productsWrapper">
              <d-product-card v-for="product in hideDuplicateProducts(ELASTIC_SEARCH.topProducts.slice(0, 2))" :key="product.providerProductId" :product="product" search />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { debounce } from './DebounceForSearch'
import DProductCard from '@/components/ProductCard/ProductCard'
export default {
  components: {
    DProductCard
  },
  data () {
    return {
      searchFocus: false,
      searchData: null,
      debouncedData: null,
      departments: []
    }
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE',
      ELASTIC_SEARCH: 'ElasticSearch/STATE'
    }),
    searchWrapperShow () {
      if (this.searchFocus) {
        if (this.ELASTIC_SEARCH.topProducts.length > 0 ||
            this.ELASTIC_SEARCH.topCategories.length > 0) {
          return true
        }
        return false
      }
      return false
    }
  },
  watch: {
    searchData: debounce(function (val) {
      if (val !== null) {
        this.debouncedData = val
      }
    }, 500),
    debouncedData (val) {
      if (val.length === 0 || val === null) {
        val = null
        return this.GET_CLEAR_DATA()
      }
      this.GET_DATA_IN_ELASTIC({
        name: val,
        departmentId: this.getDepatrments(),
        productSize: 5,
        categorySize: 5
      })
    }
  },
  mounted () {
    this.GET_CLEAR_DATA()
  },
  methods: {
    ...mapActions({
      GET_CLEAR_DATA: 'ElasticSearch/GET_CLEAR_DATA',
      GET_DATA_IN_ELASTIC: 'ElasticSearch/GET_DATA_IN_ELASTIC',
      REMOVE_ACTIVE_SHOP: 'GEO/REMOVE_ACTIVE_SHOP',
      GET_HOVER_PANEL_CATEGORIES: 'Category/GET_HOVER_PANEL_CATEGORIES'
    }),
    removeShop () {
      this.REMOVE_ACTIVE_SHOP()
      this.GET_HOVER_PANEL_CATEGORIES(this.$cookies.get('availableDepartments'))
      if (this.$route.params.shop) {
        this.$router.push('/')
      }
    },
    clearSearchData () {
      this.searchData = null
      this.GET_CLEAR_DATA()
    },
    autoCategory (category) {
      this.$router.replace({ path: `/${this.GEO.activeShop.route}/collection/${this.$translit(category.name)}-${category.id}/` })
      this.unsetFocus()
    },
    setFocus () {
      this.searchFocus = true
    },
    unsetFocus () {
      const id = setTimeout(() => {
        this.searchFocus = false
        clearTimeout(id)
      }, 100)
    },
    getSearchPage () {
      if (this.searchData) {
        let productName = this.searchData
        if (productName === null || !productName) {
          productName = ''
        }
        this.$router.push({ path: '/' + this.GEO.activeShop.route + '/search/' + productName.replaceAll('/', '_').replaceAll('%', '$') + '/' })
      }
      this.unsetFocus()
    },
    getDepatrments () {
      let departments
      // если режим активного магазина то устанавливаем только 1 департамент
      if (this.GEO.activeShop.id) {
        departments = [this.GEO.activeShop.id]
        return departments
      }
      if (this.$cookies.get('availableDepartments')) {
        departments = this.$cookies.get('availableDepartments')
      } else {
        departments = [5, 1092, 1093, 1163]
      }
      return departments
    },
    // TODO: вынести функцию в миксин, либо как-то еще, он используется в многих компонентах
    hideDuplicateProducts (productList) {
      return productList.filter((thing, index, self) =>
        index === self.findIndex(t => (
          t.providerProductId === thing.providerProductId
        ))
      )
    },
    // TODO: доделать сериализацию, но не в компоненте !!!
    serializeProducts (productList) {
      return productList.map((product) => {
        const { prices, ...rest } = product
        const productKeys = Object.keys(product)
        return {
          ...rest,
          image: productKeys.includes('image') ? product.image[0] : '',
          price: product.prices[this.GEO.departmentId],
          discount: product.discount[this.GEO.departmentId]
        }
      })
    }
  }
}
</script>

<style lang="scss" scope>
  @import './style';
  .icon-search {
  background-image: url("../../assets/img/header/Vector (3).svg");
   width: 21px;
    height: 21px;
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
    cursor: pointer;
}
.small-block {
  margin-left: 532px;
    top: 20px;
    position: absolute;
}
</style>
