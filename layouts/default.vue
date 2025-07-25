
    
<template>
  <v-app>
    <!-- Header отображается только после загрузки страницы -->
    <Header v-if="headerLoaded" />

    <!-- Прочие компоненты -->
    <Preview v-if="showPreview" @close-preview="showPreview = false" />
    <download-app v-if="showDownloadApp" :show-download-app="showDownloadApp" @close-download-app="showDownloadApp = false" />
    <d-mobile-panel class="d_visible_menu_mobile" :value="leftMainVisible" />
    <EmailForm dialog />

    <!-- Панель с категориями для пк -->
    <HoverPanel class="d_visible_menu_desk" :value="leftMainVisible" />
    <!-- КОНТЕЙНЕР -->
    <div class="d-flex justify-center main-block">
      <div class="center_block">
        <nuxt />
      </div>
    </div>

    <!-- Диалоговое окно авторизации -->
    <d-authorization-dialog
      :value="authDialog"
      @closedialog="authDialog = false"
    />

    <!-- Диалоговое окно подтверждения сохраненного(в локалсторедже кодом, не юзером) по времени адреса с последнего раза -->
    <d-time-address-dialog
      :time-address-dialog="timeAddressDialog"
      @change-address="
        $eventBus.$emit('editAddress', true);
        timeAddressDialog = false;
      "
      @save-current-address="saveCurrentAdress()"
    />

    <!-- Диалоговое окно выбора города для пк -->
    <d-city-select-dialog
      :city-dialog="cityDialog"
      @cancel-dialog="cityDialog = false"
      @change-city-id="(e, cityID) => cityId = cityID"
    />

    <!-- Диалоговое окно с яндекс картой для выбора адреса -->
    <YandexMapDialog
      :city-id="cityId"
      @editCity="cityDialog = true"
      @cancel-dialog="cityDialog = false"
    />

    <!-- блоки уведомлений -->
    <client-only>
      <notifications
        position="bottom right"
        group="app"
        :width="300"
        class="appbottomright"
        ignore-duplicates
      />
      <notifications
        position="center center"
        group="appcenterbig"
        class="appcenterbig"
        ignore-duplicates
      />
      <notifications position="center center" group="bigapp" class="bigapp">
        <template slot="body" slot-scope="props">
          <div class="branch-error_notification__wrapper">
            <div class="notification-title">
              {{ props.item.title }}
            </div>
            <div class="notification-content">
              {{ props.item.text }}
            </div>
            <v-btn
              absolute
              right
              top
              color="white"
              icon
              @click="props.close"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </template>
      </notifications>
      <notifications
        group="cartnotification"
        style="top: 123px; left:47.5%; width: 385px; z-index: 200"
        :max="1"
        :speed="0"
        ignore-duplicates
      >
        <template slot="body" slot-scope="props">
          <div class="cartnotification">
            <div style="width: 42px !important" class="ma-3">
              <v-img
                :src="JSON.parse(props.item.text).img || 'https://ayanmarket.kz/products/images/4770190051347.png'"
                width="42"
                height="42"
                contain
              />
            </div>
            <div>
              <span>{{ $capitalize(props.item.title) }}</span><br>
              <span>
                {{
                  JSON.parse(props.item.text).amount +
                    " " +
                    JSON.parse(props.item.text).measure
                }}
              </span>
            </div>
          </div>
        </template>
      </notifications>
    </client-only>

    <!-- Кнопка поднятия на верх -->
    <v-btn v-if="up_btn" color="white" fab class="btn_up" @click="totop">
      <v-icon large color="#503CC3">
        mdi-chevron-up
      </v-icon>
    </v-btn>
    <bottom-nav-bar />
    <Footer v-if="!activePageCart()" />
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DMobilePanel from '@/components/MobilePanel/MobilePanel'
import DAuthorizationDialog from '@/components/Authorization/Login'
import DTimeAddressDialog from '@/components/TimeAddressDialog/TimeAddressDialog.vue'
import DCitySelectDialog from '@/components/CitySelectDialog/CitySelectDialog.vue'
import YandexMapDialog from '@/components/YandexMapDialog/YandexMapDialog.vue'
import Preview from '~/components/Preview/Preview.vue'
import BottomNavBar from '~/components/BottomNavigation/BottomNavBar.vue'
import DownloadApp from '~/components/DownloadApp/DownloadApp.vue'
import EmailForm from '~/components/EmailForm/EmailForm.vue'
import Header from '@/components/Header/Header.vue'

export default {
  components: {
    DMobilePanel,
    DAuthorizationDialog,
    YandexMapDialog,
    DTimeAddressDialog,
    DCitySelectDialog,
    Preview,
    BottomNavBar,
    DownloadApp,
    EmailForm,
    Header
  },

  data () {
    return {
      headerLoaded: false, // Флаг для контроля отображения Header
      showDownloadApp: false,
      showPreview: false,
      leftMainVisible: false,
      timeAddressDialog: false,
      up_btn: false,
      cityDialog: false,
      authDialog: false,
      cityId: null,
      isMobile: false,
      scroll: 0
    }
  },

  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE',
      CART: 'Cart/STATE'
    })
  },

  created () {
    // Задержка на 100ms перед тем как показать Header
    setTimeout(() => {
      this.headerLoaded = true
    }, 100)

    // Добавляем события для управления состоянием
    this.$eventBus.$on('leftMainStatus', (data) => {
      this.leftMainVisible = data
      document.body.style.overflow = "hidden"; // eslint-disable-line
    })
    this.$eventBus.$on('up_btn', (data) => {
      this.up_btn = data
    })

    // Закрытие превью
    this.$eventBus.$on('close-bigpreview', (data) => {
      const id = setTimeout(() => { this.showPreview = data; clearTimeout(id) }, 2000)
    })
  },

  async beforeMount () {
    // Проверка локали
    this.checkLocaleLS()

    // Достаем из localStorage данные и устанавливаем их как можно раньше
    await this.GET_CITY_LOCAL()

    // Проверка города
    if (!this.$cookies.get('cityId')) {
      const info = localStorage.getItem('info')
      if (!info) {
        // По умолчанию первый город в позиции
        this.$cookies.set('cityId', 1)
        this.SET_CITY_TITLE(this.GEO.allCitiesListById[1].name)
      } else {
        this.$cookies.set('cityId', JSON.parse(info).activeCity)
        this.SET_CITY_TITLE(this.GEO.allCitiesListById[JSON.parse(info).activeCity].name)
      }
    } else {
      this.SET_CITY_TITLE(this.GEO.allCitiesListById[this.$cookies.get('cityId')].name)
    }
  },

  async mounted () {
    // Чтобы превью работало только на главной странице
    if (this.$route.path === '/') {
      this.showPreview = true
    }
    
    this.$eventBus.$on('saveScroll', () => this.saveScroll())
    this.$eventBus.$on('scrollPage', () => {
      const id = setTimeout(() => { this.scrollPage(); clearTimeout(id) }, 200)
    })
    this.UPDATE_CART_DETAILS()

    if (this.$cookies.get('clientId') && this.$cookies.get('availableDepartments')) {
      await this.GET_CLIENT_CART({
        clientId: this.$cookies.get('clientId'),
        departmentIds: this.$cookies.get('availableDepartments')
      })
    }

    this.$eventBus.$on('notSEO', () => {})

    this.$eventBus.$on('openDialog', (data) => {
      this.authDialog = data
      this.$Ecomerce.authorizationOpen()
    })

    if (this.GEO.info.address.street === '') {
      if (this.GEO.info.address.save === true) {
        this.CHANGE_ADDRESS_STATUS(false)
      }
    }

    if (this.GEO.info.changeCity === false) {
      this.cityDialog = true
    }

    if (this.$route.name === 'share') {
      this.cityDialog = false
    }

    if (this.GEO.info.address.save) {
      let addressTimeCreate = parseInt(this.$cookies.get('addressTimeCreate'))
      if (addressTimeCreate === 'undefined' || addressTimeCreate === null) {
        addressTimeCreate = Math.floor(Date.now() / 1000)
      }
      const difference = Math.floor(Date.now() / 1000) - addressTimeCreate
      if (difference > 60 * 60 * 6) {
        this.timeAddressDialog = true
      }
    }

    const id = this.$cookies.get('clientId')
    if (typeof id !== 'undefined' && id !== null && id !== '' && id !== 0) {
      await this.getClientAdress(this.$cookies.get('clientId'))
    }
    this.getUtmParams()

    // Показ окна для скачивания приложения
    if (this.$route.path === '/') {
      this.updateShowDownloadApp()
    }
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.updateShowDownloadApp)
  },

  methods: {
    ...mapActions({
      UPDATE_CART_DETAILS: 'Cart/UPDATE_CART_DETAILS',
      GET_CITY_LOCAL: 'GEO/GET_CITY_LOCAL',
      CHANGE_ADDRESS_STATUS: 'GEO/CHANGE_ADDRESS_STATUS',
      SET_CITY_TITLE: 'GEO/SET_CITY_TITLE',
      getClientAdress: 'Personal/getClientAdress',
      GET_CLIENT_CART: 'Cart/GET_CLIENT_CART',
      checkLocaleLS: 'Static/checkLocaleLS',
      SAVE_TO_VIEW_PRODUCTS: 'Products/SAVE_TO_VIEW_PRODUCTS',
      GET_DEPARTMENT_BY_ADDRESS: 'GEO/GET_DEPARTMENT_BY_ADDRESS',
      SET_SEO_UTM: 'SEO/SET_SEO_UTM'
    }),

    updateShowDownloadApp () {
      if (process.browser) {
        const lastShown = localStorage.getItem('downloadAppLastShown')
        const currentTime = new Date().getTime()
        const oneDay = 24 * 60 * 60 * 1000 // окно для скачивания будет появляться только на следующий день

        if (!lastShown || currentTime - lastShown > oneDay) {
          const isMobile = window.innerWidth < 800
          if (isMobile) {
            this.showDownloadApp = true
            localStorage.setItem('downloadAppLastShown', currentTime.toString())
          }
        }
      }
    },

    totop () {
      if (process.browser) {
        window.scrollTo(0, 0)
      }
    },

    saveCurrentAdress () {
      this.$cookies.set('addressTimeCreate', Math.floor(Date.now() / 1000))
      this.timeAddressDialog = false
      // подтягиваем адресс все равно, если вдруг изменились пересечения филиалов
      this.GET_DEPARTMENT_BY_ADDRESS(this.GEO.info.address.geo)
    },

    // Находимся ли мы на странице корзины
    activePageCart () {
      const list = ['basket', 'collection-id']
      return list.includes(this.$route.name)
    },

    // передает данные для страницы GTM
    setGTMPage (page) {
      let pageType = 'other'
      switch (page.name) {
        case 'index': pageType = 'home'
          break
        case 'search-id': pageType = 'searchresults'
          break
        case 'collection-id': return
        case 'basket': pageType = 'cart'
          this.$Ecomerce.viewCart(this.CART.all)
          break
        case 'newOrder': pageType = 'cart'
          this.$Ecomerce.viewNewOrder(this.CART.all)
          break
        default: break
      }
      this.$Ecomerce.sendPage(this.GEO.activeCityTitle, pageType)
    },

    // сброс ls и куки если происходят изменения в ls нужно добавлять функцию
    checkForNewSite () {
      if (process.browser) {
        if (!localStorage.getItem('ayanNew')) {
          localStorage.clear()
          this.$cookies.removeAll()
          localStorage.setItem('ayanNew', true)
        }
      }
    },

    saveScroll () {
      if (process.browser) {
        this.scroll = window.scrollY
        localStorage.setItem('scroll', this.scroll)
      }
    },

    scrollPage () {
      const scroll = localStorage.getItem('scroll')
      if (scroll && process.browser) {
        window.scrollTo(0, parseFloat(scroll))
        localStorage.removeItem('scroll')
      }
    },

    // получает начальные параметры перехода на сайт для crm системы, эти данные передаются в create_order
    getUtmParams () {
      if (!process.browser) {
        return
      }
      // если есть поисковые параметры то это UTM метки передаем их
      const params = new URL(window.location).searchParams
      if (params.size) {
        params.utm_source = params.get('utm_source')
        params.utm_medium = params.get('utm_medium')
        params.utm_campaign = params.get('utm_campaign')
        params.utm_content = params.get('utm_content')
        params.utm_term = params.get('utm_term')
        this.SET_SEO_UTM(params)
        return
      }
      // если поисковых параметров нет но проверяем реферрер, чтобы определить откуда был переход
      const referrer = document.referrer
      if (!referrer) {
        params.utm_source = 'direct'
        params.utm_medium = 'none'
        params.utm_campaign = null
        params.utm_content = null
        params.utm_term = null
        this.SET_SEO_UTM(params)
        return
      }
      // если реферрер есть то проверяем на принадлежность к поисковой системе
      const searchSistem = ['ya', 'google', 'bing', 'rambler']
      searchSistem.forEach((system) => {
        if (referrer.includes(system)) {
          if (system === 'ya') {
            params.utm_source = 'yandex'
          } else {
            params.utm_source = system
          }
          params.utm_medium = 'organic'
          params.utm_campaign = null
          params.utm_content = null
          params.utm_term = null
        }
      })
      this.SET_SEO_UTM(params)
    }
  }
}
</script>


<style lang="scss">
@import "./style";
</style>

