<template>
  <v-card
    v-if="value"
    class="cart-preview"
    rounded="xxl"
    @mouseleave="$emit('close-preview')"
  >
    <v-card-title style="padding: 10px;">
      <div class="cart-preview_top" />
      <!-- это блок нужен только для отступа сверху -->
    </v-card-title>
    <v-card-text class="cart-preview__container">
      <div
        v-for="department in departmentsWithProducts"
        :key="department.name"
        class="cart-preview__content"
      >
        <div class="cart-preview__header">
          <h3 class="cart-preview__title">
            {{ $i18n.t('cart.deliveryFrom') }}
            <span v-if="department.departmentIsAyan">"АЯН"</span>
            <span v-else>{{ department.name }}</span>
          </h3>
          <span class="cart-preview__subtitle">
            {{ department.address }}
          </span>
        </div>
        <v-alert
          v-if="showMinSum(department, 'проверка')"
          class="alert-message"
          color="#97effc"
        >
          <template v-slot:prepend>
            <v-icon class="alert-message__prepend-icon" color="#32C8F0">
              mdi-information-outline
            </v-icon>
          </template>
          <template v-slot:default>
            <div class="alert-message__text">
              <h3 class="alert-message__title">
                {{ $i18n.t("cart.minSum2") }}
                {{ (showMinSum(department, 'разница')).toLocaleString('ru') }} тг.
              </h3>
            </div>
          </template>
        </v-alert>
        <v-list
          class="cart-preview__list"
          dense
          two-line
        >
          <v-list-item
            v-for="product in department.products"
            :key="product.productId + '/' + product.providerId"
            class="cart-preview__list-item"
          >
            <v-img
              :lazy-src="'https://ayanmarket.kz/products/images/4770190051347.png'"
              :src="imagesProduct(product)"
              :alt="product.name"
              :title="product.name"
              max-width="50px"
              max-height="70px"
              class="cart-preview_img"
              @click="openProduct(product)"
            />
            <v-list-item-content>
              <v-list-item-title class="cart-preview_title" @click="openProduct(product)">
                {{ $capitalize( $i18n.locale === 'ru' ? product.productName : product.productNameKz || product.productName) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ PROVIDERS.all.filter(p => product.providerId === p.id)[0].name }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <ProductCounter
              :variable-digit="Number(product.amount)"
              :measure="product.measureType"
              :step="product.measureStep"
              :disable-status="
                product.measureType === 'шт'
                  ? product.amount <= 1
                  : parseFloat(product.amount) <= 0.1
              "
              :disable="product.productId === 748749"
              @minus-btn-toggle="minusCart(product, $event, department.packetStep)"
              @plus-btn-toggle="plusCart(product, $event, department.packetStep)"
            />
            <v-list-item-action>
              <span v-if="product.totalDiscountPrice" class="cart-preview_title_oldPrice">
                {{ ( product.totalPrice || Math.floor(product.price * product.amount)).toLocaleString('ru') }} тг
              </span>
              <v-list-item-action-text
                :class="{
                  'cart-preview_title_discount': product.totalDiscountPrice,
                  'cart-preview_title_price': !(product.totalDiscountPrice)
                }"
              >
                {{ (totalPrice(product)).toLocaleString('ru') }}тг
              </v-list-item-action-text>

              <v-btn
                class="list-item__delete-btn"
                color="danger"
                icon
                :disabled="product.productId === 748749"
                @click="removeProductInCart(product)"
              >
                <v-icon color="grey">
                  mdi-trash-can-outline
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </div>
    </v-card-text>
    <v-card-actions class="cart-preview__footer" :padless="true">
      <v-btn
        class="cart-preview__btn"
        :elevation="0"
        color="#503CC3"
        block
        to="/basket"
        @click="$emit('close-preview')"
      >
        {{ $i18n.t('cart.goToCart') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import getSum from '@/utils/getSum'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      departmentsWithProducts: [],
      debounceId: null
    }
  },
  computed: {
    ...mapGetters({
      CART: 'Cart/STATE',
      GEO: 'GEO/STATE',
      PERSONAL: 'Personal/STATE',
      PROVIDERS: 'Providers/STATE'
    }),
    isUserHasLoyalty() {
  return this.PERSONAL.clientSingle.isLoyalty || false
},
    selectedProducts () {
      const totalProducts = []
      const totalDeps = []
      for (const dep of this.departmentsWithProducts) {
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
      const res = this.selectedProducts.products.reduce(
        (acc, item) =>
          acc +
          (item.totalPrice),
        0
      )
      return res
    }
  },
  watch: {
    value () {
      this.departmentsWithProducts = this.getDepartmentsWithProducts()
    },
    'CART.details.totalPrice': function () {
      this.departmentsWithProducts = this.getDepartmentsWithProducts()
    }
  },
  async created () {
    if (!this.PROVIDERS.all.length > 0) {
      await this.GET_PROVIDERS()
    }
  },
  methods: {
    ...mapActions({
      NEW_AMOUNT: 'Cart/NEW_AMOUNT',
      REMOVE_IN_CART: 'Cart/REMOVE_IN_CART',
      CHANGE_CLIENT_CART: 'Cart/CHANGE_CLIENT_CART',
      GET_PROVIDERS: 'Providers/GET_PROVIDERS',
      ADD_PRODUCTS_LIST: 'Order/ADD_PRODUCTS_LIST'
    }),
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
    getDepartmentsWithProducts () {
      return this.GEO.info.depEntities
        .map((department) => {
          const products = this.CART.all
            .filter(p => p.departmentId === department.id)
            .map(p => ({ 
              ...p,
              discountPrice: null,
               totalDiscountPrice: null,
               selected: true }))
          return {
            ...department,
            selected: true,
            products,
            totalSum: getSum(products)
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
        this.updateProductAmount({
          amount: datas,
          departmentId: product.departmentId,
          productId: product.productId,
          providerId: product.providerId,
          packetStep
        })
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
    imagesProduct (product) {
      return (product.images && product.images.length > 0)
        ? product.images[0]
        : (product.img || 'https://ayanmarket.kz/products/images/4770190051347.png')
    },
    openProduct (product) {
      this.$router.push(`/product/${this.$translit(product.productName)}-${product.productId}`)
    },
    totalPrice (product) {
      if (product.totalDiscountPrice) {
        return product.totalDiscountPrice
      } else {
        return (product.totalPrice)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
