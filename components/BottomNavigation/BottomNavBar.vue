<template>
  <div class="navbar-mobile">
    <nav class="navbar">
      <!--Главная-->
      <v-btn
        color="#3c393d"
        nuxt
        icon
        to="/"
      >
        <div class="d-flex flex-column align-center">
          <v-icon>mdi-home-variant-outline</v-icon>
          <span class="smaller_text">{{ $i18n.t("button.main") }}</span>
        </div>
      </v-btn>
      <!--Каталог-->
      <v-btn
        color="#3c393d"
        icon
        @click="openCategories"
      >
        <div class="d-flex flex-column align-center">
          <v-icon>mdi-text-search-variant</v-icon>
          <span class="smaller_text">{{ $i18n.t("button.catalog") }}</span>
        </div>
      </v-btn>
      <!-- Акции -->
      <v-btn
        icon
        color="#302a31"
        @click="$router.push('/actions')"
      >
        <div class="d-flex flex-column align-center">
          <v-icon>mdi-sale-outline</v-icon>
          <span class="smaller_text">Акции</span>
        </div>
      </v-btn>
      <!-- корзина -->
      <v-badge
        :value="CART.details.totalLength > 0"
        :content="CART.details.totalLength"
        color="#8CCD28"
        overlap
        bordered
      >
        <v-btn
          color="#302a31"
          nuxt
          icon
          to="/basket"
        >
          <div class="d-flex flex-column align-center">
            <v-icon>mdi-cart-outline</v-icon>
            <span class="smaller_text">{{ $i18n.t("header.cart") }}</span>
          </div>
        </v-btn>
      </v-badge>

      <!--Избранные-->
      <v-btn
        icon
        color="#302a31"
        @click="openFavorites"
      >
        <div class="d-flex flex-column align-center">
          <v-icon>mdi-heart-outline</v-icon>
          <span class="smaller_text">{{ $i18n.t("header.favorites") }}</span>
        </div>
      </v-btn>
      <!--Аккаунт-->
      <v-btn
        v-if="!PERSONAL.isLoggin"
        icon
        color="#302a31"
        @click="openLogin"
      >
        <div class="d-flex flex-column align-center">
          <v-icon>mdi-account-outline</v-icon>
          <span class="smaller_text">Профиль</span>
        </div>
      </v-btn>
      <div v-else>
        <v-menu offset-y left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="#302a31"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <div class="d-flex flex-column align-center">
                <v-icon>mdi-account-check</v-icon>
                <span class="smaller_text"> {{ PERSONAL.clientSingle.name || 'Профиль' }}</span>
              </div>
            </v-btn>
          </template>
          <v-list>
            <v-list-item :to="`/page/personal-office`">
              <v-list-item-icon><v-icon>mdi-account-outline</v-icon></v-list-item-icon>
              <v-list-item-title>{{ $i18n.t("header.private") }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
              <v-list-item-title>{{ $i18n.t("button.logOut") }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </nav>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
  },
  data () {
    return {
      opensearch: false,
      searchData: '',
      searchItems: [],
      searchLoaded: false,
      searchProductVal: '',
      searchSyncVal: null,
      headScroll: false,
      IputSearchData: '',
      input: {
        search: ''
      },
      productCartCount: 0,
      inClient: false,
      cart: false,
      show: true,
      cartPreviewVisibility: false
    }
  },
  computed: {
    ...mapGetters({
      CART: 'Cart/STATE',
      GEO: 'GEO/STATE',
      PERSONAL: 'Personal/STATE'
    }),
    path () {
      if (this.$route.fullPath !== '/' &&
              this.$route.fullPath !== '/temirtau/' &&
              this.$route.fullPath !== '/temirtau' &&
              this.$route.fullPath !== '/nur-sultan' &&
              this.$route.fullPath !== '/nur-sultan/') {
        return true
      }
      return false
    }
  },
  async mounted () {
    this.$eventBus.$on('cartAmount', (data) => {
      this.productCartCount = data
    })
    if (this.$cookies.get('TOKEN')) {
      await this.LOG_IN_OUT(true)
    } else {
      await this.LOG_IN_OUT(false)
    }
    this.inClient = true
  },
  methods: {
    ...mapActions({
      SEARCH_PRODUCT: 'Products/SEARCH_PRODUCT',
      LOG_IN_OUT: 'Personal/LOG_IN_OUT',
      CLEAR_CART_PRODUCTS: 'Cart/CLEAR_CART_PRODUCTS'
    }),
    openLogin () {
      this.$eventBus.$emit('openDialog', true)
    },
    showOrders () {
      this.$router.push('/page/orders/')
      // Перенаправляем на страницу с заказами
    },
    openCategories () {
      this.$router.push(`/${this.GEO.activeShop.route}/collection/vse-categoryy-0`)
    },
    getDownloadLink () {
      window.open('/page/app/redirect/')
    },
    async logout () {
      this.$cookies.remove('TOKEN')
      this.$cookies.remove('clientId')
      localStorage.removeItem('refToken')
      await this.LOG_IN_OUT(false)
      this.CLEAR_CART_PRODUCTS()
    },
    open_left_main () {
      this.$eventBus.$emit('leftMainStatus', true)
    },
    handleScroll () {
      if (!process.browser) {
        return
      }
      this.headScroll = (window.scrollY > 0)
      this.$eventBus.$emit('up_btn', this.headScroll)
    },
    editaddress () {
      this.$eventBus.$emit('editAddress', true)
    },
    editcity () {
      this.$eventBus.$emit('editCity', true)
    },
    openFavorites () {
      const clientId = this.$cookies.get('clientId')
      const availableDepartments = this.$cookies.get('availableDepartments')
      if (!clientId) {
        this.openLogin()
      } else if (!availableDepartments) {
        this.editaddress()
      } else {
        this.$router.push('/favorites')
      }
    },
    async searchProduct (val) {
      if (typeof val === 'object') {
        val = this.IputSearchData
      }
      if (!val) {
        return
      }
      if (val === null) {
        return
      }
      if (this.searchProductVal === val) {
        return
      }
      if (val.length >= 3) {
        if (this.searchLoaded === false) { // Если не идет загрузка то мы её можем запустить
          this.searchLoaded = true
          // Здесь await на поиск
          const data = await this.SEARCH_PRODUCT({
            name: val,
            departmentId: this.GEO.departmentId,
            page: 0,
            pageSize: 40
          })
          if (data.type === 'success') {
            this.$set(this, 'searchItems', data.data)
          }
          const id = setTimeout(() => {
            this.searchLoaded = false
            if (val !== this.searchProductVal) {
              this.searchProduct(this.searchProductVal) // Ищем то что не могли найти так как были в ожидании
            }
            clearTimeout(id)
          }, 2000)
        } else {
          this.searchProductVal = val
        }
      }
    },
    changeProduct (val) {
      if (typeof val === 'undefined') { return }
      if (val.length > 0) {
        this.searchLoaded = true
        this.searchLoaded = false
        this.searchProductVal = ''
        this.searchData = ''
        this.searchSyncVal = null
        this.$router.replace({ path: '/product/' + val })
      }
    },
    // check_work_time () {
    //   this.cart = true
    //   document.body.style.overflowY = 'hidden'
    // },
    closeCart () {
      this.cart = false
      document.body.style.overflowY = 'auto'
    },
    syncIputSearchData (val) {
      this.IputSearchData = val
    },
    getSearchPage () {
      if (this.searchData) {
        this.$router.replace({ path: this.GEO.activeShop.route + '/search/' + this.searchData + '/' })
      }
    },
    async changeLocalization () {
      if (this.$i18n.locale === 'kz') {
        this.$i18n.locale = 'ru'
        await this.$store.dispatch('Static/deleteLocalizationLocalStorage')
      } else {
        this.$i18n.locale = 'kz'
        await this.$store.dispatch('Static/saveLocalizationToLocalStorage', 'kz')
      }
    }
  }
}
</script>

    <style lang="scss">
      @import './style';
    </style>
