<template>
  <div class="product-item" no-gutters>
    <div class="upper">
      <div class="product-item-mobile__checkbox">
        <slot name="checkbox" />
      </div>
      <div cols="2" class="product-item__image" @click="openProduct()">
        <v-img
          :src="imagesProduct()"
          :alt="productEntity.productName"
          :title="productEntity.productName"
          min-height="56px"
          max-height="56px"
          contain
        />
      </div>
      <div class="product-item__title-block">
        <div class="product-item__title-block-wrapper">
          <h3 class="product-item__title" @click="openProduct()">
            {{ $capitalize($i18n.locale === 'ru' ? productEntity.productName : productEntity.productNameKz) }}
          </h3>
          <p class="product-item__subtitle" @click="goToProviderProfile(currentProvider.id)">
            {{ currentProvider.name }}
          </p>
        </div>
        <!--Цена-->
        <div class="product-item__total-price">
          <span
            :class="{
              'product-item__total-price': productEntity.totalDiscountPrice || productEntity.discountPrice,
              'product-item__total-price': !(productEntity.totalDiscountPrice || productEntity.discountPrice)
            }"
          >
            {{
              (productEntity.totalDiscountPrice || productEntity.discountPrice) || (productEntity.totalPrice || productEntity.price)
            }}
            тг
          </span>
          <span v-if="productEntity.totalDiscountPrice||productEntity.discountPrice" class="price_discount">{{ productEntity.totalPrice|| productEntity.price }} тг</span>
          <span v-if="productEntity.totalDiscountPrice||productEntity.discountPrice" class="price_percent">{{ productEntity.discountPercent + "%" }}</span>
        </div>
      </div>
    </div>
    <hr>
    <!--разделение-->
    <div class="downer" no-gutters>
      <div class="d-flex">
        <div v-if="large" class="product-item__delete-btn-wrapper">
          <v-btn icon @click="$emit('delete', $event)">
            <v-icon color="#221B4D">
              mdi-trash-can-outline
            </v-icon>
          </v-btn>
        </div>
        <div v-if="large" class="product-item__delete-btn-wrapper ml-2">
          <v-btn icon @click="isFavoriteProducts()">
            <v-icon :color="productEntity.isFavorite ? 'orange' : ''">
              {{ productEntity.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
            </v-icon>
          </v-btn>
        </div>
      </div>
      <ProductCounter
        :variable-digit="productEntity.amount"
        :disable-status="
          productEntity.measureType === 'шт' ?
            productEntity.amount <= 1 : parseFloat(productEntity.amount) <= 0.1
        "
        :large="large"
        @minus-btn-toggle="$emit('minus-product', $event)"
        @plus-btn-toggle="$emit('add-product', $event)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    productEntity: {
      type: Object,
      required: true
    },
    large: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      discount: false,
      minPrice: 0,
      products: []
    }
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE',
      PROVIDERS: 'Providers/STATE',
      PRODUCT: 'Products/SHARE_PRODUCT'
    }),
    currentProvider () {
      return this.PROVIDERS.all.filter(p => this.productEntity.providerId === p.id)[0]
    }
  },
  methods: {
    ...mapActions({
      GET_SHARE_PRODUCT: 'Products/GET_SHARE_PRODUCT'
    }),
    openProduct () {
      this.$router.push(`/product/${this.$translit(this.productEntity.productName)}-${this.productEntity.productId}`)
    },
    goToProviderProfile (providerId) {
      this.$router.replace('/profile/' + providerId + '-provider')
    },
    imagesProduct () {
      return this.productEntity.images?.length > 0
        ? this.productEntity.images[0]
        : this.productEntity.img || 'https://ayanmarket.kz/products/images/4770190051347.png'
    },
    isFavoriteProducts () {
      this.productEntity.isFavorite = !this.productEntity.isFavorite
    }
  }
}
</script>

<style lang="scss">
@import "./style";
</style>
