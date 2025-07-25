<template>
  <v-container  v-if="!fetchingCategory" class="basket" >
    <header class="basket__header">
      <div class="basket__title-block">
        <h1 class="basket__title">
          {{ $i18n.t("cart.cart") }}
        </h1>
        <p class="basket__subtitle">
          <span class="basket__order-amount-text">
            {{ departmentsWithProducts.length }}
            {{ $i18n.locale === 'ru' ?
              $ruNumString(departmentsWithProducts.length, [
                "заказ",
                "заказа",
                "заказов"
              ]) : 'тапсырыс'
            }}
          </span>
        </p>
      </div>
      <v-alert
        v-if="departmentsWithProducts.length > 1"
        class="basket__message ma-0 mt-5"
        color="#F4F6FA"
      >
        <template v-slot:prepend>
          <v-icon class="alert-message__prepend-icon" color="#32C8F0">
            mdi-information-outline
          </v-icon>
        </template>
        <template v-slot:default>
          <div class="alert-message__text alert-message__text_small">
            {{ $i18n.t("cart.separation") }}
          </div>
        </template>
      </v-alert>
    </header>
    <main class="basket__body">
      <v-container
        v-for="department in departmentsWithProducts"
        :key="department.id"
        class="department-block basket__department-block"
      >
        <v-row no-gutters>
          <!-- MAIN_CONTENT -->
          <v-col cols="14" md="11" class="department-block__list">
            <!-- header of department -->
            <v-row class="department-block__header" no-gutters>
              <v-col auto class="department-block__title">
                <div class="department-block__box">
                  <div class="department-block__title-img">
                    <img :src="department.img || require('@/assets/img/shop.png')" alt="department_logo" style="max-height: 90%">
                  </div>
                  <div class="department-block__title-block">
                    <h2
                      class="department-block__title"
                    >
                      {{ $i18n.t("cart.deliveryFrom") }}
                      «
                      <span v-if="department.departmentIsAyan" class="department-block__title-name">АЯН</span>
                      <span v-else class="department-block__title-name">{{ department.name }}</span>
                      »
                    </h2>
                    <span v-if="fetchingCategory">
                      <v-progress-circular indeterminate color="#503CC3" />
                    </span>
                    <span class="department-block__address-title">
                      {{ department.address }}
                    </span>
                    <span class="department-block__shop-link" @click="activeShopMode(department)">В магазин</span>
                  </div>
                </div>

                <!-- minimal order price message -->
                <div v-if="showMinSum(department, 'проверка')" class="alert-message">
                  <p class="alert-message__subtitle">
                    {{ $i18n.t("cart.minSum3") }} -
                    <span class="alert-message__title">{{ (showMinSum(department, 'минимум')).toLocaleString('ru') }}</span> тг.
                    <span>
                      {{ $i18n.t("cart.minSum2") }}
                      <span class="alert-message__title">
                        {{ (showMinSum(department, 'разница')).toLocaleString('ru') }}
                      </span> тг.
                    </span>
                  </p>
                  <section class="alert-message_line">
                    <div class="alert-message_line__full" :style="{width:fullLinePercent(department)}" />
                  </section>
                </div>
                <!-- Кнопка избранное -->
                <v-btn
                  :elevation="0"
                  class="department-block__like-btn"
                  :color="
                    department.departmentIsFavorite
                      ? '#EE4C48'
                      : 'black'
                  "
                  icon
                  @click="
                    department.departmentIsFavorite
                      ? removeFromFavorite(department)
                      : addToFavorite(department)
                  "
                >
                  <v-icon>
                    {{ department.departmentIsFavorite ? "mdi-heart" : "mdi-heart-outline" }}
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4">
                <section class="summary-form__heading">
                  <div>
                    <span class="summary-form__title">
                      {{ $i18n.t("cart.all") }}:
                    </span>
                    <span class="summary-form__value">
                      {{ (getDepSum(department.id)).toLocaleString('ru') }} тг
                    </span>
                  </div>
                  <div>
                    <span>Стоимость доставки</span>
                    <span class="summary-form__value">{{ department.totalDeliveryPrice ? `${(department.totalDeliveryPrice).toLocaleString('ru')} тг` : 'Бесплатно' }}</span>
                  </div>
                  <div>
                    <span>Состав заказа</span>
                    <span class="summary-form__value">
                      {{ getDepSum(department.id, 'длина') }}
                      {{ $i18n.locale === 'ru' ?
                        $ruNumString(getDepSum(department.id, 'длина'), [
                          "товар",
                          "товара",
                          "товаров"
                        ]) : 'өнім'
                      }}
                    </span>
                  </div>
                  <div v-if="department.totalDeliveryPrice">
                    <span>Итог</span>
                    <span class="summary-form__value">{{ getDepSum(department.id, 'итог') }} тг</span>
                  </div>
                </section>
              </v-col>
            </v-row>

            <!-- select-all -->
            <v-row no-gutters>
              <v-col cols="1" class="department-product__checkbox">
                <v-checkbox
                  v-model="department.selected"
                  color="#EE4C48"
                  off-icon="mdi-checkbox-blank-circle-outline"
                  on-icon="mdi-checkbox-marked-circle"
                  @change="selectAllDepartmentProducts(department)"
                />
              </v-col>
              <v-col cols="11" class="department-product__content">
                <span>{{ $i18n.t("cart.chooseAll") }}</span>
                <v-tooltip v-if="department.selected" left color="#e9e9e9" content-class="custom-tooltip">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      @click="CLEAR_CART_PRODUCTS(department.products)"
                    >
                      <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                  </template>
                  <span class="department-product__content_text">{{ $i18n.t('cart.clear') }}</span>
                </v-tooltip>
              </v-col>
            </v-row>

            <!-- department-product -->
            <div
              v-for="product in department.products"
              :key="product.productId + '/' + product.providerId"
              class="department-block__list"
              no-gutters
            >
              <!-- divider -->
              <v-row>
                <v-divider />
              </v-row>
              <v-row class="department-product" no-gutters>
                <v-col cols="1" class="department-product__checkbox">
                  <v-checkbox
                    v-model="product.selected"
                    color="#5d4bd0"
                    off-icon="mdi-checkbox-blank-circle-outline"
                    on-icon="mdi-checkbox-marked-circle"
                    :disabled="product.productId === 748749"
                    @change="checkDepartmentAndChangeIfNeed(department, product)"
                  />
                </v-col>
                <v-col cols="11" class="department-product__content">
                  <ProductItem
                    :product-entity="product"
                    :large="true"
                    @minus-product="minusCart(product, $event, department.packetStep)"
                    @add-product="plusCart(product, $event, department.packetStep)"
                    @delete="removeProductInCart(product)"
                  />
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </main>

    <!-- footer -->
    <v-row no-gutters>
      <v-col cols="14" md="11">
        <footer class="basket__footer">
          <div class="summary-form_footer">
            <v-btn
              class="summary-form__submit-btn"
              x-large
              width="270px"
              color="#5d4bd0"
              dark
              @click="totalSum !== 0 ? placeOrder() : ''"
            >
              {{ $i18n.t("cart.delivery") }}
            </v-btn>
            
            <section class="summary-form__heading">
              <div>
                <span class="summary-form__title">
                  {{ $i18n.t("cart.all") }}:
                </span>
                <span class="summary-form__value">
                  {{ (getTotal()).toLocaleString('ru') }} тг
                </span>
              </div>
              <div>
                <span>Стоимость доставки</span>
                <span class="summary-form__value">{{ (getTotal('доставка')).toLocaleString('ru') }} </span>
              </div>
              <div>
                <span>Количество </span>
                <span class="summary-form__value">
                  {{ departmentsWithProducts.length }}
                  {{ $i18n.locale === 'ru' ?
                    $ruNumString(departmentsWithProducts.length, [
                      "заказ",
                      "заказа",
                      "заказов"
                    ]) : 'тапсырыс'
                  }}
                </span>
              </div>
              <div v-if="getTotal('доставка') !== 'Бесплатно'">
                <span>Итог</span>
                <span class="summary-form__value">{{ (getTotal('итог')).toLocaleString('ru') }} тг</span>
              </div>
            </section>
          </div>
        </footer>
      </v-col>
    </v-row>
    <!-- недавно просмотренные -->
    <div v-if="VIEW_PRODUCTS.length" class="product-category">
      <div class="product-category_title">
        <span class="product-category_line" />
        <p class="product-category_name">
          {{ $i18n.t("product.view") }}
        </p>
        <span class="product-category_line" />
      </div>

      <div class="product-category_products">
        <product-card
          v-for="product in VIEW_PRODUCTS"
          :key="product.providerProductId"
          :product="product"
        />
      </div>
    </div>
    <!-- модалка о типах оплаты -->
    <v-dialog
      v-model="modal"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      width="50%"
      :content-class="$vuetify.breakpoint.xsOnly ? 'mobile' : ''"
      @click:outside="modal = false"
      @keydown.esc="modal = false"
    >
      <v-card>
        <v-card-title class="pb-2 cart-modal_title">
          {{ $i18n.t("cart.payment") }}
          <v-btn icon absolute color="#503CC3" class="cart-modal_btn" @click="modal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-for="dep in departmentsWithProducts" :key="dep.id">
            <p class="cart-modal_text">
              {{ $i18n.t("cart.paymentType") }} <span class="summary-form__value">{{ dep.name }} - </span> {{ dep.paymentType }}
            </p>
          </div>
        </v-card-text>
        <v-card-actions class="cart-modal_actions">
          <v-btn
            class="mr-4 white--text"
            color="#5d4bd0"
            @click="modalConfirm = true; placeOrder()"
          >
            {{ $i18n.t("cart.resume") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import getSum from '@/utils/getSum'
export default {
  name: 'BasketPage',
  data () {
    return {
      departmentsWithProducts: [], // корзина разделенная на филиалы
      notSelected: [], // невыбранные продукты, используется для определения галочек при изменениии корзины
      modal: false,
      debounceId: null,
      fetchingCategory: false, // спинер при переходе на отдельного продавца
      modalConfirm: false // Подтверждение о разных типах оплаты
    }
  },
  computed: {
    ...mapGetters({
      CART: 'Cart/STATE',
      GEO: 'GEO/STATE',
      VIEW_PRODUCTS: 'Products/VIEW_PRODUCTS',
      PERSONAL: "Personal/STATE" // Получаем данные о лояльности пользователя
    }),
    isUserHasLoyalty() {
    // проврка лояльности
    return this.PERSONAL.clientSingle.isLoyalty  || false
  },
    selectedEntities () {
      const totalProducts = []
      const totalDeps = []
      for (const dep of this.departmentsWithProducts) {
        const minSum = dep.totalDeliveryPrice ? dep.minOrderSumDelivery : dep.minOrderSum
        if (minSum - dep.totalSum > 0) {
          continue
        }
        for (const product of dep.products) {
          if (product.selected) {
            totalDeps.push(product.departmentId)
            totalProducts.push(product)
          }
        }
      }
      return {
        products: totalProducts,
        departments: [...new Set(totalDeps)]
      }
    },
    totalSum () {
      return +(getSum(this.selectedEntities.products))
    }
  },
  watch: {
    CART: {
      handler () {
        this.departmentsWithProducts = this.getDepartmentsWithProducts()
      },
      deep: true
    }
  },
  async mounted () {
    this.fetchingCategory = true;  // Начинаем загрузку
  // Подписка на событие  
  this.$eventBus.$on('removeFavDep', async () => {
    await this.GET_DEPARTMENT_BY_ADDRESS(this.GEO.info.address.geo)
  })

  // 1) Проверяем, есть ли clientId
  const clientId = this.$cookies.get('clientId')
  if (clientId) {
    // Сначала получаем данные клиента, чтобы узнать isLoyalty
    await this.$store.dispatch('Personal/getClient', clientId)

    // Затем формируем запрос для получения корзины
    let request
    if (this.$cookies.get('availableDepartments')) {
      request = {
        clientId,
        departmentIds: this.$cookies.get('availableDepartments')
      }
    } else {
      request = {
        clientId,
        departmentIds: [5]
      }
    }

    // После этого вызываем GET_CLIENT_CART
    await this.GET_CLIENT_CART(request)
    
  }

  // 2) Теперь, когда уже знаем, лояльный пользователь или нет, собираем товары для отрисовки
  this.departmentsWithProducts = this.getDepartmentsWithProducts()
  this.fetchingCategory = false;
},

  methods: {
    ...mapActions({
      NEW_AMOUNT: 'Cart/NEW_AMOUNT',
      REMOVE_IN_CART: 'Cart/REMOVE_IN_CART',
      GET_CLIENT_CART: 'Cart/GET_CLIENT_CART',
      CHECK_WEIGHT: 'Cart/CHECK_WEIGHT',
      CHANGE_CLIENT_CART: 'Cart/CHANGE_CLIENT_CART',
      CLEAR_CART_PRODUCTS: 'Cart/CLEAR_CART_PRODUCTS',
      ADD_PRODUCTS_LIST: 'Order/ADD_PRODUCTS_LIST',
      GET_DEPARTMENT_BY_ADDRESS: 'GEO/GET_DEPARTMENT_BY_ADDRESS',
      ADD_DEPARTMENT_TO_FAV: 'Favorites/ADD_DEPARTMENT_TO_FAV',
      REMOVE_DEPARTMENT_FROM_FAV: 'Favorites/REMOVE_DEPARTMENT_FROM_FAV',
      SET_ACTIVE_SHOP: 'GEO/SET_ACTIVE_SHOP',
      GET_HOVER_PANEL_CATEGORIES: 'Category/GET_HOVER_PANEL_CATEGORIES'
    }),
    fullLinePercent (department) {
      const percent = department.totalSum / department.minOrderSum
      return (percent * 100).toString() + '%'
    },
    getTotal (condition) {
      let totalProducts = []
      let totalDelivery = 0
      for (const dep of this.departmentsWithProducts) {
        totalProducts = totalProducts.concat(dep.products.filter(product => product.selected))
        totalDelivery += dep.totalDeliveryPrice
      }
      if (condition === 'доставка') {
        return totalDelivery ? `${(totalDelivery).toLocaleString('ru')} тг` : 'Бесплатно'
      }
      const sum = getSum(totalProducts).toFixed()
      if (condition === 'итог') {
        return +sum + totalDelivery
      }
      return +sum
    },
    showMinSum (department, condition) {
      let answer
      const freeDelivery = !department.totalDeliveryPrice
      switch (condition) {
        case 'проверка':
          if (freeDelivery) {
            answer = department.minOrderSum - department.totalSum > 0
          } else {
            answer = department.minOrderSumDelivery - department.totalSum > 0
          }
          break
        case 'минимум':
          if (freeDelivery) {
            answer = department.minOrderSum
          } else {
            answer = department.minOrderSumDelivery
          }
          break
        case 'разница':
          if (freeDelivery) {
            answer = (department.minOrderSum - department.totalSum).toFixed(1)
          } else {
            answer = (department.minOrderSumDelivery - department.totalSum).toFixed(1)
          }
          break
      }
      return +answer
    },
    getDepSum (id, condition) {
      const dep = this.departmentsWithProducts.find(dep => dep.id === id)
      const selectedProd = dep.products.filter(product => product.selected)
      if (condition === 'длина') {
        return selectedProd.length
      }
      if (condition === 'итог') {
        return getSum(selectedProd) + dep.totalDeliveryPrice
      }
      return getSum(selectedProd)
    },
    selectAllDepartmentProducts (department) {
      department.products.forEach((product) => {
        product.selected = department.selected
      })
      department.totalSum = department.products.reduce(
        (acc, p) => (p.selected ? p.totalPrice || p.price * p.amount : 0) + acc,
        0
      )
    },
    checkDepartmentAndChangeIfNeed (department, product) {
      this.addToSelected(product, true)
      // Количество выбранных продуктов на филиале
      const whichLen = department.products.filter(p => p.selected).length
      department.selected = whichLen === department.products.length
      this.addToSelected(department)
      department.totalSum = department.products.reduce(
        (acc, p) => (p.selected ? p.totalPrice || p.price * p.amount : 0) + acc,
        0
      )
    },
    // добавляет в отмеченные галочкой продукт или филиал
    addToSelected (item, product) {
      const itemId = (product ? item.productId : item.id)
      if (item.selected) {
        this.notSelected = this.notSelected.filter(id => id !== itemId)
      } else if (!this.notSelected.some(id => id === itemId)) {
        this.notSelected.push(itemId)
      }
    },

    getDepartmentsWithProducts () {
  return this.GEO.info.depEntities
    .map((department) => {
      // находим продукты для каждого департамента
      const products = this.CART.all
        .filter(p => p.departmentId === department.id)
        .map(p => {
          // 1) Если пользователь БЕЗ лояльности, а товар только для лояльных (loyaltyDiscount === true),
          //    убираем (обнуляем) у него discount-поля
          if (!this.isUserHasLoyalty && p.loyaltyDiscount === true) {
            return {
              ...p,
              // Срезаем скидочные поля, чтобы getSum не считал скидку
              discountPrice: null,
              totalDiscountPrice: null,
              selected: !this.notSelected.some(id => id === p.productId)
            }
          } else {
            // Иначе оставляем поля, как есть
            return {
              ...p,
              selected: !this.notSelected.some(id => id === p.productId)
            }
          }
        })

      const totalSum = getSum(products)

      // Остальное без изменений
      return {
        ...department,
        selected: !this.notSelected.some(id => id === department.id),
        products,
        totalSum
      }
    })
    .filter(department => department.products.length > 0)
},

    plusCart (product, quantity, packetStep) {
      let datas
      if (quantity) {
        datas = quantity
      } else if (product.amountStep) {
        datas = parseFloat(product.amount) + parseFloat(product.amountStep)
      } else {
        datas = parseFloat(product.amount) + parseFloat(product.measureStep)
      }
      if (datas % 1 > 0) {
        datas = datas.toFixed(1)
      }
      // если лимит на доставку
      if (product?.limit !== null && product?.limit < datas) {
        this.$notify({
          group: 'app',
          type: 'error',
          duration: 2000,
          title: this.$i18n.t('errors.atention'),
          text: this.$i18n.t('errors.noMoreProducts')
        })
        return
      }
      // Когда пользователь неаторизован, мы создаем корзину сами и закидываем туда поле balance
      if (product?.balance < datas) {
        this.$notify({
          group: 'app',
          type: 'error',
          duration: 2000,
          title: this.$i18n.t('errors.atention'),
          text: this.$i18n.t('errors.noProducts')
        })
      } else {
        this.updateProductAmount({
          amount: datas,
          departmentId: product.departmentId,
          productId: product.productId,
          providerId: product.providerId,
          packetStep
        })
      }
    },
    minusCart (product, quantity, packetStep) {
      let datas
      if (quantity) {
        datas = quantity
      } else if (product.amountStep) {
        datas = parseFloat(product.amount) - parseFloat(product.amountStep)
      } else {
        datas = parseFloat(product.amount) - parseFloat(product.measureStep)
      }
      if (datas !== 0) {
        if (product.amountStep < 1 || product.measureStep < 1) {
          if (datas.toFixed(2) > 0) {
            datas = datas.toFixed(2)
          }
        } else if (datas.toFixed(0) > 0) {
          datas = datas.toFixed(0)
        }
        const payload = {
          amount: datas,
          departmentId: product.departmentId,
          productId: product.productId,
          providerId: product.providerId,
          packetStep
        }
        this.updateProductAmount(payload)
      }
      if (datas === 0) {
        this.removeProductInCart(product)
      }
    },
    updateProductAmount (input) {
      this.NEW_AMOUNT(input)
      if (this.$cookies.get('TOKEN')) {
        if (this.debounceId) {
          clearTimeout(this.debounceId)
        }
        this.debounceId = setTimeout(() => {
          this.CHANGE_CLIENT_CART(input)
        }, 600)
      }
    },
    removeProductInCart (input) {
      this.REMOVE_IN_CART([input])
    },

    placeOrder () {
      // если разделенный заказ c разными типами оплаты показываем модалку
      const firstPaymentType = this.departmentsWithProducts[0].paymentType
      const allSame = this.departmentsWithProducts.every(dep => dep.paymentType === firstPaymentType)
      if ((this.departmentsWithProducts.length > 1 && !this.modalConfirm) && !allSame) {
        this.modal = true
        return
      }
      // Проверяем корзину на общий вес
      if (!this.$cookies.get('clientId')) {
        this.CHECK_WEIGHT(this.selectedEntities.products.map((product) => {
          const obj = {
            amount: product.amount,
            productId: product.productId,
            departmentId: product.departmentId
          }
          return obj
        }))
      }
      this.ADD_PRODUCTS_LIST({
        products: this.selectedEntities.products,
        departments: this.selectedEntities.departments
      })
      this.$router.replace({ path: '/neworder' })
    },
    // переключает сайт в режим одного поставщика
    async activeShopMode (provider) {
      // если уже в этом режиме то просто перводим на страницу категорий
      if (this.GEO.activeShop.id === provider.id) {
        this.$router.replace(`/${this.GEO.activeShop.route}/collection/vse-categoryy-0/`)
        return
      }
      const shop = { id: provider.id, route: `shop-${this.$translit(provider.name)}` }
      this.SET_ACTIVE_SHOP(shop)
      this.fetchingCategory = true
      await this.GET_HOVER_PANEL_CATEGORIES([provider.id])
      this.$router.replace(`/${this.GEO.activeShop.route}/collection/vse-categoryy-0/`)
    },
    async addToFavorite (department) {
      await this.ADD_DEPARTMENT_TO_FAV(department.id)
      department.departmentIsFavorite = !department.departmentIsFavorite
      this.GET_DEPARTMENT_BY_ADDRESS(this.GEO.info.address.geo)
    },
    async removeFromFavorite (department) {
      await this.REMOVE_DEPARTMENT_FROM_FAV(department.id)
      department.departmentIsFavorite = !department.departmentIsFavorite
      this.GET_DEPARTMENT_BY_ADDRESS(this.GEO.info.address.geo)
    }
  },
  head () {
    return {
      title: 'Корзина | Ayanmarket',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
           'Корзина покупателя. Звоните: 8 778 097-07-05 | Ayanmarket'
        }
      ],
      link: [{ rel: 'canonical', href: `https://ayanmarket.kz${this.$route.path}` }]
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>