<template>
  <div v-if="!loading" class="showcase-conteiner">
    <!-- Рендеринг в режиме групп магазинов -->
    <template v-if="groupView">
      <!-- Если выбран режим "все группы" -->
      <ShopGroups
        v-if="groupId === 'all'"
        :groups="groups"
        :shopRoute="GEO.activeShop.route"
      />
      <!-- Если выбран конкретная группа -->
      <ShopGroup
        v-else
        :group="currentGroup"
        :shopRoute="GEO.activeShop.route"
      />
    </template>

    <!-- Стандартный режим: категории и товары -->
    <template v-else>
      <!-- Баннер категории (стандартный код) -->
      <div v-if="!tileType && !tileTypeChildren" class="showcase-conteiner_banner">
        <v-img
          v-if="banner.length"
          transition="scale-transition"
          :src="banner[deviceType].imageUrl"
          class="showcase-conteiner_img"
          eager
          @click="redirectTo(banner[deviceType], true)"
        />
      </div>

      <ActiveShop v-if="GEO.activeShop.id" />
      <d-breadcrumbs v-if="!isTargetPage" :id="id" />

      <div class="categry-name">
        <h1 v-if="tileTypeChildren" class="hidden">
          {{ $i18n.locale === 'kz' ? mainCategory.nameKz : mainCategory.name }}
        </h1>
        <h1 v-else class="hidden">
          Главные категории
        </h1>
      </div>

      <!-- Отображение плитки категорий -->
      <slider-category
        v-if="isTargetPage && isSmallScreen"
        class="mt-0"
        :images-arr="serializeCategories(SHOWCASE_CATEGORIES)"
      />

      <div v-if="tileType || tileTypeChildren" class="showcase-conteiner_tile">
        <div
          v-for="cat in childrenCategory"
          :key="cat.id"
          class="showcase-conteiner_tile-item"
          @click="redirectTo(cat)"
        >
          <div v-if="!isSmallScreen" class="showcase-conteiner_tile-item_img-block">
            <v-img
              eager
              class="showcase-conteiner_tile-item_img"
              :src="cat.fileUrlSmall ? cat.fileUrlSmall : ''"
            />
          </div>
          <div class="showcase-conteiner_tile-item_name">
            {{ $i18n.locale === 'ru' ? cat.name : cat.nameKz }}
          </div>
          <!-- Дочерние категории для мобилки -->
          <div
            v-if="cat.children && cat.children.length && isSmallScreen"
            class="children_title-item"
          >
            <div
              v-for="child in cat.children"
              :key="child.id"
              class="children_item"
              @click="redirectTo(child)"
            >
              <div class="showcase-conteiner_tile-item_img-block">
                <v-img
                  eager
                  class="children_tile-item_img"
                  :src="child.fileUrlSmall ? child.fileUrlSmall : ''"
                />
              </div>
              <div class="children_title-item_name">
                {{ $i18n.locale === 'ru' ? child.name : child.nameKz }}
              </div>
            </div>
          </div>
          <!-- Если нет дочерних категорий, просто показываем имя -->
          <div v-else class="children_title-item">
            <div class="children_item">
              <div class="showcase-conteiner_tile-item_img-block">
                <v-img
                  eager
                  class="children_tile-item_img"
                  :src="cat.fileUrlSmall ? cat.fileUrlSmall : ''"
                />
              </div>
              <div class="children_title-item_name">
                {{ $i18n.locale === 'ru' ? cat.name : cat.nameKz }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Отображение продуктов с фильтрами (если не плиточный режим) -->
      <div v-else class="showcase-conteiner_category">
        <div class="showcase-conteiner_filters">
          <div class="showcase-conteiner_filters_sticky">
            <div class="sticky-element">
              <d-chip :id="id" :type="$vuetify.breakpoint.smAndUp" />
              <Filters
                v-if="productsInfo.maxPrice"
                :products-info="productsInfo"
                :departments="departments"
                @change-filters="changeFilters($event)"
                @clear-filters="clearFilters()"
              />
            </div>
            <div class="showcase-conteiner_filters_sticky-sibling" />
          </div>
        </div>

        <div class="showcase-conteiner_products">
          <d-category
            :id="mainCategory.id"
            :title="$i18n.locale === 'kz' ? mainCategory.nameKz : mainCategory.name"
            class="mt-4"
          >
            <template v-slot:sort>
              <FiltersMobile
                v-if="productsInfo.maxPrice"
                :products-info="productsInfo"
                :departments="departments"
                @change-filters="changeFilters($event)"
                @clear-filters="clearFilters()"
              />
              <SortOption
                v-if="productsInfo.maxPrice"
                :products-info="productsInfo"
                :departments="departments"
                @change-filters="changeFilters($event)"
                @clear-filters="clearFilters()"
              />
            </template>

            <d-product-card
              v-for="product in serializeProducts(products)"
              :key="product.providerProductId"
              :product="product"
              style="margin-left:5px"
            />
          </d-category>

          <div v-if="products.length === 0 && !fetching" class="ml-2">
            {{ filterMode ? $i18n.t("collection.noProductsFilter") : $i18n.t("collection.noProducts") }}
          </div>
          <Pagination
            :total-pages="totalPages"
            :active-page="activePage"
            :fetching="fetching"
            @change-page="changePage($event)"
          />
        </div>
      </div>

      <Footer v-if="showFooter" />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DCategory from '@/components/Category/Category'
import DProductCard from '@/components/ProductCard/ProductCard'
import DBreadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import DChip from '@/components/Chip/Chip'
import Pagination from '@/components/Pagination/Pagination'
import ActiveShop from '@/components/ActiveShop/ActiveShop'
import ShopGroups from '@/components/ShopGroups/ShopGroups.vue'
import ShopGroup from '@/components/ShopGroup/ShopGroup.vue'

// Импортируем нашу функцию:
import { buildShopsItem } from '@/utils/buildShops' // <-- подкорректируйте путь

export default {
  components: {
    DCategory,
    DProductCard,
    DBreadcrumbs,
    DChip,
    Pagination,
    ActiveShop,
    ShopGroups,
    ShopGroup
  },
  data () {
    return {
      id: 0,
      // Режим групп филиалов
      groupView: false,
      groupId: null,
      loading: false,
      fetching: false,
      deviceType: 1,
      activePage: 0,
      tileType: false,
      tileTypeChildren: false,
      mainCategory: {},
      childrenCategory: [],
      totalPages: 0,
      products: [],
      departments: [],
      filterMode: false,
      filters: {},
      productsInfo: {},
      singlePageMode: true,
      banner: [],
      showFooter: false,
      showSliderCategory: false
    }
  },
  computed: {
    ...mapGetters({
      SHOWCASE_CATEGORIES: 'Category/SHOWCASE_CATEGORIES',
      PRODUCT: 'Products/STATE',
      PRODUCTS: 'Products/PRODUCT_CATEGORY',
      FILTERED_PRODUCTS: 'Products/FILTERED_PRODUCTS',
      SCROLL_PRODUCTS: 'Products/SCROLL_PRODUCTS',
      AvailableCategory: 'Category/AVAILABLE',
      MainCategoryes: 'Category/CATALOG_CATEGORIES',
      GEO: 'GEO/STATE'
    }),
    isTargetPage () {
      // Примерная проверка, корректируйте под нужды
      return this.$route.path === `/${this.GEO.activeShop.route}/collection/vse-categoryy-0`
    },
    isSmallScreen () {
      return process.browser ? window.innerWidth <= 800 : false
    },
    actualCategoryList () {
      const categoryArr = Object.entries(this.PRODUCT.showcaseProducts)
        .map(([key, val]) => {
          if (val.length > 0) return key
        })
      return categoryArr
    },
    // Вместо локального метода buildShopsItem(), здесь используем напрямую импорт
    shopsRoot() {
      return buildShopsItem(this.GEO.info.depEntities)
    },
    groups() {
      return this.shopsRoot.children || []
    },
    currentGroup() {
      return this.shopsRoot.children.find(gr => gr.id === this.groupId) || {}
    }
  },
  async created () {
    this.loading = true
    const param = this.$route.params.id

    // Проверяем, не group ли это
    if (param.startsWith('group-')) {
      this.groupView = true
      if (param === 'group-all') {
        this.groupId = 'all'
      } else {
        this.groupId = parseInt(param.split('-')[1])
      }
    } else {
      this.id = parseInt(param.split('-').pop())
    }

    this.checkDeviceType()
    await this.renderPage()
    this.$Ecomerce.sendPage(this.GEO.activeCityTitle, 'category', this.mainCategory.name)
    this.loading = false

    const timer = setTimeout(() => {
      this.showFooter = true
      clearTimeout(timer)
    }, 3000)
  },
  mounted () {
    this.$eventBus.$on('changeDepartment', (force) => {
      if (this.$route.params.shop) {
        this.renderPage(force)
      }
    })
    this.$eventBus.$on('saveScroll', () => this.saveScroll())
  },
  methods: {
    ...mapActions({
      GET_SHOWCASE_CATEGORIES: 'Category/GET_SHOWCASE_CATEGORIES',
      GET_PRODUCTS_BY_CATEGORY: 'Products/GET_PRODUCTS_BY_CATEGORY',
      getClearProductCategory: 'Products/GET_CLEAR_PRODUCTS',
      GET_FILTER_PRODUCTS: 'Products/GET_FILTER_PRODUCTS',
      getGategory: 'Category/GET_GATEGORY_BY_ID',
      GET_DEPARTMENT_BY_ADDRESS: 'GEO/GET_DEPARTMENT_BY_ADDRESS',
      SAVE_SCROLLING_PRODUCTS: 'Products/SAVE_SCROLLING_PRODUCTS',
      GET_CATEGORY_BANNER: 'Static/GET_CATEGORY_BANNER'
    }),
    serializeCategories (categoryList) {
      return categoryList.filter(c => this.actualCategoryList.includes(c.categoryId.toString()))
    },
    toggleFilters () {
      this.showFilters = !this.showFilters
    },
    async renderPage(force) {
  if (force) {
    this.getClearProductCategory();
    this.products = [];
    this.activePage = 0;
  }
  // -----------------------------
  // РЕЖИМ ГРУПП ФИЛИАЛОВ
  // -----------------------------
  if (this.groupView) {
    // "Все группы"
    if (this.groupId === 'all') {
      // Просто рендерим ShopGroups
      return;
    } else {
      // Конкретная группа, ищем её
      const shopsRoot = buildShopsItem(this.GEO.info.depEntities);
      const group = shopsRoot.children.find(gr => gr.id === this.groupId);
      if (group) {
        // Чтобы ничего не ломать в коде, используем mainCategory
        this.mainCategory = group;
        this.tileTypeChildren = true;
        this.childrenCategory = group.children;
      } else {
        // Если нет такой группы
        this.$router.push(`/${this.GEO.activeShop.route}/collection/group-all`);
      }
      return;
    }
  }

  // -----------------------------
  // СТАНДАРТНАЯ ЛОГИКА КАТЕГОРИЙ
  // -----------------------------
  if (this.id === 0) {
    this.tileType = true;
  }
  if (this.AvailableCategory[this.id]) {
    this.mainCategory = this.AvailableCategory[this.id];
  } else if (!this.tileType) {
    this.mainCategory = await this.getGategory(this.id);
  }

  if (this.mainCategory.type === 'error') {
    this.$router.push('/');
  }
  if (this.tileType && this.MainCategoryes.length === 0) {
    this.$router.push('/');
  }

  const promoCat = this.mainCategory.promo || this.mainCategory.specialCategory;
  if (this.mainCategory.parentId === 0 && !promoCat) {
    this.tileTypeChildren = true;
  }

  // *** Основное изменение: формируем массив карточек и добавляем карточку "Магазины" ***

  if (this.tileTypeChildren) {
    // Если режим плитки с дочерними категориями
    this.childrenCategory = [...this.mainCategory.children];
    
    // Создаем карточку "Магазины"
    const shopsCard = buildShopsItem(this.GEO.info.depEntities);
    shopsCard.isShopGroup = true;       // Флаг, чтобы знать, что это карточка для групп магазинов
    shopsCard.id = 'all';               // При переходе получится group-all
    shopsCard.name = 'Магазины';        // Название карточки (при необходимости можно добавить локализацию)
    
    // Добавляем карточку "Магазины" в начало массива
    this.childrenCategory.unshift(shopsCard);

    // (Опционально) Заполнение пустыми ячейками для ровной сетки
    if (this.childrenCategory.length % 6 !== 0 && !this.isSmallScreen) {
      for (let i = 0; i <= this.childrenCategory.length % 6; i++) {
        this.childrenCategory.push({});
      }
    }
  } else if (this.tileType) {
    // Если плитка без дочерних категорий
    this.childrenCategory = [...this.MainCategoryes];
    
    // Создаем карточку "Магазины"
    const shopsCard = buildShopsItem(this.GEO.info.depEntities);
    shopsCard.isShopGroup = true;
    shopsCard.id = 'all';
    shopsCard.name = 'Магазины';
    
    // Добавляем карточку "Магазины" в начало массива
    this.childrenCategory.unshift(shopsCard);

    if (this.childrenCategory.length % 6 !== 0 && !this.isSmallScreen) {
      for (let i = 0; i <= this.childrenCategory.length % 6; i++) {
        this.childrenCategory.push({});
      }
    }
  } else {
    this.GET_CATEGORY_BANNER(this.id).then(banner => {
      this.banner = banner;
    });
    // Если уже был скролл / сохранённая позиция
    if (this.checkScrollProducts()) {
      return;
    }
    await this.getProductsForMainCategory(force);
  }
}
,
    async getProductsForMainCategory (force) {
      this.fetching = true
      await this.setDepartment(force)
      const productsInfo = await this.GET_PRODUCTS_BY_CATEGORY({
        departmentIds: this.departments,
        categoryId: this.mainCategory.id,
        size: 32,
        page: this.activePage
      })
      if (!productsInfo) {
        this.$router.push(`/${this.GEO.activeShop.route}/collection/vse-categoryy-0/`)
        return
      }
      if (productsInfo.totalPages) {
        this.totalPages = productsInfo.totalPages
      }
      this.productsInfo = productsInfo
      this.productsInfo.showCategory = this.mainCategory.promo
      if (this.singlePageMode) {
        this.products = this.PRODUCTS[this.mainCategory.id]
      } else {
        this.products = this.products.concat(this.PRODUCTS[this.mainCategory.id])
      }
      this.fetching = false
    },
    checkDeviceType () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          this.deviceType = 0
          break
        default:
          this.deviceType = 1
      }
    },
    serializeProducts (productList) {
      return productList
        ? productList.map((product, index) => ({
            ...product,
            image: product.imgMedium,
            index
          }))
        : []
    },
    async changePage (page) {
      if (page === undefined) {
        this.activePage++
        this.singlePageMode = false
      } else {
        this.activePage = page
        this.singlePageMode = true
      }
      if (this.filterMode) {
        await this.getFilterProducts()
      } else {
        await this.getProductsForMainCategory()
      }
      if (page) window.scrollTo(0, 0)
    },
    changeFilters (filters) {
      if (process.browser) window.scrollTo(0, 0)
      this.filterMode = true
      this.filters = filters
      this.clearPage()
      this.getFilterProducts()
    },
    async getFilterProducts () {
      const body = {
        departmentIds: this.filters.departmentIds.length
          ? this.filters.departmentIds
          : this.departments,
        minPrice: this.filters.price[0],
        maxPrice: this.filters.price[1],
        providerIds: this.filters.providerIds,
        categoryIds: this.filters.categoryIds.length
          ? this.filters.categoryIds
          : [this.mainCategory.id],
        categoryIdsPromo: this.mainCategory.promo
          ? [this.mainCategory.id]
          : null,
        featureValues: this.filters.featureValues,
        discount: this.filters.discount,
        page: this.activePage,
        size: 32,
        isPopularitySort: this.filters.isPopularitySort,
        nameSortAsc: this.filters.nameSortAsc,
        isReviewSort: this.filters.isReviewSort,
        isDiscountSort: this.filters.isDiscountSort,
        priceSortAsc: this.filters.priceSortAsc,
        priceSortDesc: this.filters.priceSortDesc,
        newSort: this.filters.newSort,
        nameSortDesc: this.filters.nameSortDesc
      }
      this.fetching = true
      const totalPages = await this.GET_FILTER_PRODUCTS(body)
      this.totalPages = totalPages
      if (this.singlePageMode) {
        this.products = this.FILTERED_PRODUCTS
      } else {
        this.products = this.products.concat(this.FILTERED_PRODUCTS)
      }
      this.fetching = false
    },
    clearFilters () {
      if (!this.filterMode) return
      this.filterMode = false
      window.scrollTo(0, 0)
      this.clearPage()
      this.getProductsForMainCategory()
    },
    async setDepartment (force) {
      if (this.GEO.activeShop.id) {
        this.departments = [this.GEO.activeShop.id]
        return
      }
      const departments = this.$cookies.get('availableDepartments')
      if (this.GEO.info.address.save || force) {
        if (departments) {
          this.departments = departments
        } else {
          await this.GET_DEPARTMENT_BY_ADDRESS(
            this.GEO.info.address.geo || this.$getGeo(this.GEO.info.activeCity)
          )
        }
      } else if (!departments) {
        await this.GET_DEPARTMENT_BY_ADDRESS(
          this.$getGeo(this.GEO.info.activeCity)
        )
      }
      this.departments = this.$cookies.get('availableDepartments')
    },
    clearPage () {
      this.activePage = 0
      this.products = []
    },
    redirectTo (category, banner) {
      if (banner) {
        if (!category.linkedCategoryName) return
        this.$router.push(
          `/${this.GEO.activeShop.route}/collection/${this.$translit(
            category.linkedCategoryName
          )}-${category.linkedCategoryId}`
        )
      } else {
        if (!category) return
        if (category.isShopGroup) {
          this.$router.push(
            `/${this.GEO.activeShop.route}/collection/group-${category.id}`
          )
        } else {
          this.$router.push(
            `/${this.GEO.activeShop.route}/collection/${this.$translit(
              category.name
            )}-${category.id}`
          )
        }
      }
    },
    saveScroll () {
      const payload = {
        products: this.products,
        page: this.activePage,
        totalPages: this.totalPages,
        categoryId: this.id,
        productsInfo: this.productsInfo
      }
      this.SAVE_SCROLLING_PRODUCTS(payload)
    },
    checkScrollProducts () {
      let scroll
      if (process.browser) {
        scroll = localStorage.getItem('scroll')
      }
      if (!scroll || this.SCROLL_PRODUCTS.categoryId !== this.id) {
        this.SAVE_SCROLLING_PRODUCTS({})
        return false
      }
      if (this.SCROLL_PRODUCTS.products && scroll) {
        this.setDepartment()
        this.products = this.SCROLL_PRODUCTS.products
        this.activePage = this.SCROLL_PRODUCTS.page
        this.totalPages = this.SCROLL_PRODUCTS.totalPages
        this.productsInfo = this.SCROLL_PRODUCTS.productsInfo
        this.$eventBus.$emit('scrollPage')
        return true
      }
    }
  },
  head () {
    return {
      title: `${this.mainCategory.name || ''} купить с доставкой на дом по низкой цене | Ayanmarket`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${
            this.mainCategory.name || ''
          } с доставкой на дом. Онлайн заказ товаров для дома. 
          Широкий ассортимент продуктов питания и привлекательные цены. 
          Бесплатная доставка при заказе от 5000 тенге за час! 
          Звоните: 8 778 097-07-05 | Ayanmarket`
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: `https://ayanmarket.kz${this.$route.path}`
        }
      ]
    }
  }
}
</script>

<style lang="scss">
@import "./style.scss";
</style>
