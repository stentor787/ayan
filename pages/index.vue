
<template>
  <v-app v-scroll="checkCategory">
    <div class="pt-0 showcase-conteiner">
      <!-- слайдер с баннерами -->
      
     <Banners 
  
  :two-banner="BANNER.two" 
  :main-slider="BANNER.mainSlider" /> <!-- Добавляем новый пропс для основного слайдера -->

      <d-category
        v-if="promo[0]"
        :id="promo[0].categoryId"
        :ref="promo[0].categoryId"
        :key="promo[0].categoryId"
        :title="$i18n.locale === 'ru' ? promo[0].categoryName : promo[0].categoryNameKz"
      >
        <d-product-card
          v-for="product in PRODUCTS.showcaseProducts[promo[0].categoryId].slice(0 ,5)"
          :key="promo[0].categoryId + '/' + product.providerProductId"
          :product="product"
        />
      </d-category>
      <!-- слайдер с промокатегориями -->
      <slider-category :images-arr="serializeCategories(SHOWCASE_CATEGORIES)" />
      <!-- отдельный баннер мобильный-->
      <div v-if="aloneBanner" class="category-banners-mobile">
        <v-img :src="aloneBanner.imageUrl" class="slider_item_img" eager @click="goToCategory(aloneBanner)" />
      </div>
      <d-category
        v-if="promo[1]"
        :id="promo[1].categoryId"
        :ref="promo[1].categoryId"
        :key="promo[1].categoryId"
        :title="$i18n.locale === 'ru' ? promo[1].categoryName : promo[1].categoryNameKz"
      >
        <d-product-card
          v-for="product in PRODUCTS.showcaseProducts[promo[1].categoryId].slice(0 ,5)"
          :key="promo[1].categoryId + '/' + product.providerProductId"
          :product="product"
        />
      </d-category>

      <div v-if="BANNER.one" class="category-banners">
        <v-img :src="BANNER.one.imageUrl" class="slider_item_img" eager @click="goToCategory(BANNER.one)" />
      </div>
      <d-category
        v-if="promo[2]"
        :id="promo[2].categoryId"
        :ref="promo[2].categoryId"
        :key="promo[2].categoryId"
        :title="$i18n.locale === 'ru' ? promo[2].categoryName : promo[2].categoryNameKz"
      >
        <d-product-card
          v-for="product in PRODUCTS.showcaseProducts[promo[2].categoryId].slice(0 ,5)"
          :key="promo[2].categoryId + '/' + product.providerProductId"
          :product="product"
        />
      </d-category>
      <!-- отдельный баннер -->
      <div v-if="aloneBanner" class="category-banners">
        <v-img :src="aloneBanner.imageUrl" class="slider_item_img" eager @click="goToCategory(aloneBanner)" />
      </div>
      <!-- слайдер с баннерами проудктов -->
      <slider-category class="mt-10" :images-arr="BANNER.products" products-type />
      <!-- обычная категория но отдельная -->
      <d-category
        v-if="allCategory[0]"
        :id="allCategory[0].categoryId"
        :ref="allCategory[0].categoryId"
        :key="allCategory[0].categoryId"
        :title="$i18n.locale === 'ru' ? allCategory[0].categoryName : allCategory[0].categoryNameKz"
      >
        <d-product-card
          v-for="product in PRODUCTS.showcaseProducts[allCategory[0].categoryId].slice(0,5)"
          :key="allCategory[0].categoryId + '/' + product.providerProductId"
          :product="product"
        />
      </d-category>
      <!-- специальная категория -->
      <d-category
        v-if="specialCategory"
        :id="specialCategory.categoryId"
        :ref="specialCategory.categoryId"
        :key="specialCategory.categoryId"
        special
        :title="$i18n.locale === 'ru' ? specialCategory.categoryName : specialCategory.categoryNameKz"
      >
        <d-product-card
          v-for="product in PRODUCTS.showcaseProducts[specialCategory.categoryId].slice(0 ,4)"
          :key="specialCategory.categoryId + '/' + product.providerProductId"
          :product="product"
          special
        />
      </d-category>
      <!-- все категории -->
      <d-category
        v-for="category in allCategory.slice(1)"
        :id="category.categoryId"
        :ref="category.categoryId"
        :key="category.categoryId"
        :title="$i18n.locale === 'ru' ? category.categoryName : category.categoryNameKz"
      >
        <d-product-card
          v-for="product in PRODUCTS.showcaseProducts[category.categoryId].slice(0,5)"
          :key="category.categoryId + '/' + product.providerProductId"
          :product="product"
        />
      </d-category>
    </div>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DCategory from '@/components/Category/Category'
import DProductCard from '@/components/ProductCard/ProductCard'
import Slider from '@/components/Slider/Slider.vue'
import SliderCategory from '~/components/SliderCategory/SliderCategory.vue'
import { debounce } from '~/components/Search/DebounceForSearch'
import Banners from '~/components/Banners/Banners.vue'
export default {
  components: {
    DCategory,
    DProductCard,
    Slider,
    SliderCategory,
    Banners
  },
  data () {
    return {
      aloneBanner: null,
      promo: [],
      allCategory: [],
      specialCategory: null,
      aloneCategory: null,
      showPreview: false,
      onWindow: [],
      scroll: 0,
      isSmallScreen: false
    }
  },
  computed: {
    ...mapGetters({
      SHOWCASE_CATEGORIES: 'Category/SHOWCASE_CATEGORIES',
      PRODUCTS: 'Products/STATE',
      GEO: 'GEO/STATE',
      BANNER: 'Static/BANNERS'
    }),
    // возвращает id категорий у которых есть товары
    actualCategoryList () {
      const categoryArr = Object.entries(this.PRODUCTS.showcaseProducts)
        .map((category) => {
          if (category[1].length > 0) {
            return category[0]
          }
        })
      return categoryArr.filter(cat => cat !== undefined)
    }
  },
  created () {
    this.showPreview = true
    this.checkCity()
    this.renderPage()
  },
  mounted () {
    this.checkToken()
    if (this.GEO.activeShop.id) {
      this.REMOVE_ACTIVE_SHOP()
      this.GET_HOVER_PANEL_CATEGORIES(this.$cookies.get('availableDepartments'))
    }
    this.$eventBus.$on('changeDepartment', data => this.renderPage(data))
    if (!process.browser) { return }
    this.isSmallScreen = window.innerWidth < 768
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    ...mapActions({
      GET_SHOWCASE_CATEGORIES: 'Category/GET_SHOWCASE_CATEGORIES',
      GET_SHOWCASE_PRODUCTS: 'Products/GET_SHOWCASE_PRODUCTS',
      GET_DEFAULT_SHOWCASE_PRODUCTS: 'Products/GET_DEFAULT_SHOWCASE_PRODUCTS',
      GET_DEPARTMENT_BY_ADDRESS: 'GEO/GET_DEPARTMENT_BY_ADDRESS',
      REMOVE_ACTIVE_SHOP: 'GEO/REMOVE_ACTIVE_SHOP',
      checkCity: 'GEO/GET_CITY_LOCAL',
      GET_BANNERS: 'Static/GET_BANNERS',
      checkToken: 'Auth/checkToken',
      SET_ACTIVE_SHOP: 'GEO/SET_ACTIVE_SHOP',
      GET_HOVER_PANEL_CATEGORIES: 'Category/GET_HOVER_PANEL_CATEGORIES'
    }),
    async renderPage (changeDep) {
      const promiseArr = []
      if (this.BANNER.slider.length === 0 || changeDep) {
        const payload = {
          cityId: this.$cookies.get('cityId') || 1,
          device: 'desktop'
        }
        promiseArr.push(this.GET_BANNERS(payload))
      }
      const availableDep = this.$cookies.get('availableDepartments')
      // если адресс не указан показываем дефолтную витрину
      if (this.GEO.info.address.save || changeDep) {
        // есть косяк когда адресс сохранен но в куки его нет
        if (availableDep) {
          promiseArr.push(this.GET_SHOWCASE_CATEGORIES(availableDep))
          // если продукты уже есть и филиал не изменяли то ничего не делаем
          if (this.PRODUCTS.showcaseProducts.length === 0 || changeDep) {
            promiseArr.push(this.GET_SHOWCASE_PRODUCTS(availableDep))
          }
        } else {
          // если адрес сохранен в ЛС но в куки его нет, то достаем заново доступные департаменты а если нет то дефолтную геоточку
          await this.GET_DEPARTMENT_BY_ADDRESS(this.GEO.info.address.geo || this.$getGeo(this.GEO.info.activeCity))
          promiseArr.push(this.GET_SHOWCASE_CATEGORIES(availableDep))
          promiseArr.push(this.GET_SHOWCASE_PRODUCTS(availableDep))
        }
      } else {
        // получаем адрес дефолтной геоточки
        await this.GET_DEPARTMENT_BY_ADDRESS(this.$getGeo(this.GEO.info.activeCity))
        promiseArr.push(this.GET_SHOWCASE_CATEGORIES(availableDep))
        promiseArr.push(this.GET_SHOWCASE_PRODUCTS(availableDep))
      }
      await Promise.allSettled(promiseArr)
      if (changeDep) {
        this.promo = []
        this.allCategory = []
        this.specialCategory = null
      }
      // берет первую промокатегорию из списка
      this.serializeCategories(this.SHOWCASE_CATEGORIES).forEach((category) => {
        if (category.promo && this.promo.length < 3) {
          this.promo.push(category)
        } else if (category.specialCategory) {
          this.specialCategory = category
        } else {
          this.allCategory.push(category)
        }
      })
      this.aloneBanner = this.BANNER.alone[0]
      this.$eventBus.$emit('close-bigpreview', false)
      this.$eventBus.$emit('scrollPage')
    },
    //  проверяет у каких категорий есть продукты
    serializeCategories (categoryList) {
      return categoryList.filter(c => this.actualCategoryList.includes(c.categoryId.toString()))
    },
    goToCategory (data) {
      if (data.categoryId) {
        this.$router.push(`/${this.GEO.activeShop.route}/collection/${this.$translit(data.categoryName)}-${data.categoryId}`)
      }
      if (data.storeOpeningDepartment) {
        this.activeShopMode(data.storeOpeningDepartment)
      }
    },
    // переключает сайт в режим одного поставщика
    async activeShopMode (departmentId) {
      // если уже в этом режиме то просто перводим на страницу категорий
      if (this.GEO.activeShop.id === departmentId) {
        this.$router.push(`/${this.GEO.activeShop.route}/collection/vse-categoryy-0/`)
        return
      }
      const dep = this.GEO.info.depEntities.find(dep => dep.id === departmentId)
      if (!dep) {
        return
      }
      const shop = { id: departmentId, route: `shop-${this.$translit(dep.name)}` }
      this.SET_ACTIVE_SHOP(shop)
      await this.GET_HOVER_PANEL_CATEGORIES([departmentId])
      this.$router.push(`/${this.GEO.activeShop.route}/collection/vse-categoryy-0/`)
    },
    handleResize () {
      // Проверяем размер экрана и обновляем флаг isSmallScreen
      this.isSmallScreen = window.innerWidth < 768
    },
    // функция привязана к скролу страницы для вывода gtm евентов
    checkCategory: debounce(function () {
      // массив по которому проверка идет, основан на всех категориях на странице, кроме тех которые уже показались
      const refsArr = this.actualCategoryList.filter(id => !this.onWindow.includes(id.toString()))
      refsArr.forEach((catId) => {
        if (this.$refs[catId]) {
          // либо реф сразу, либо внутри рефа массив
          const ref = this.$refs[catId].$el ? this.$refs[catId].$el : this.$refs[catId][0].$el
          // когда нижний край категории меньше высоты экрана
          if (ref.getBoundingClientRect().bottom < window.innerHeight) {
            this.onWindow.push(catId)
            this.$Ecomerce.itemsList(this.PRODUCTS.showcaseProducts[catId].slice(0, 6))
          }
        }
      })
    }, 500)
  },
  head () {
    return {
      title:
        'Доставка продуктов на дом, сервис доставки еды и товаров для дома в Караганде, Темиртау и Астане | Ayanmarket',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
          `⭐Еда и продукты из супермаркетов АЯН с доставкой на дом.
          Онлайн заказ товаров повседневного спроса. Широкий ассортимент продуктов питания и привлекательные цены.
          Бесплатная доставка при заказе от 5000 тенге за час! Звоните: 8 778 097-07-05`
        }
      ],
      link: [{ rel: 'canonical', href: `https://ayanmarket.kz${this.$route.path}` }]
    }
  }
}
</script>

<style lang="scss">
@import './style.scss';
</style>