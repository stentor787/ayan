<template>
  <div class="min-product">
    <v-btn
      :elevation="0"
      color="#EE4C48"
      icon
      absolute
      class="btn-like"
      @click="addToFavorite(product.productId || product.product.id)"
    >
      <v-icon>mdi-heart</v-icon>
    </v-btn>
    <div class="lazy-product-dis">
      <lazy-product-discount
        v-if="
          isLoyalty &&
            oldPrice &&
            product.discountPrice &&
            product.discountPrice !== product.price
        "
        :product-discount="discount"
        :product-price="minPrice"
        :product="product"
        :loyalty="isLoyalty"
      />
    </div>
    <v-img
      :src="imagesProduct(product)"
      :alt="product.productName || product.title"
      :title="product.productName || product.title"
      style="max-height: 150px; min-height: 70px"
      contain
    />
    <div class="min-product_text">
      <p class="min-product_text_name">
        {{ product.productName || product.title || product.product.name }}
      </p>
      <p class="min-product_text_provider">
        {{ orderType ? product.provider.name : currentProvider.name }}
      </p>

      <!-- Основная цена товара -->
      <p class="min-product_price_total">
        {{ productPrice.toLocaleString("ru") }} тг
      </p>
      <p
        v-if="
          !isLoyalty &&
            !oldPrice &&
            !product.discountPrice &&
            !product.discountPrice == product.price
        "
      ></p>

      <!-- Условие для отображения старой цены с зачёркиванием, если есть лояльность -->
      <p
        v-if="
          isLoyalty &&
            oldPrice &&
            product.discountPrice &&
            product.discountPrice !== product.price
        "
        class="dis-product_card__old-price pp"
      >
        {{ (oldPrice * product.amount).toLocaleString("ru") }} тг
      </p>
    </div>
    <div class="min-product_price">
      {{ product.amount }} {{ product.measureType }}
    </div>
    <div v-if="orderType" class="min-product_bot">
      <v-btn
        :elevation="0"
        color="#5d4bd0"
        icon
        @click="$eventBus.$emit('addToCart', product)"
      >
        <v-icon>mdi-cart-arrow-down</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "MinProduct",
  props: {
    product: {
      type: Object,
      required: true
    },
    orderType: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      PROVIDERS: "Providers/STATE",
      PERSONAL: "Personal/STATE" // Получаем данные о лояльности пользователя
    }),
    isLoyalty() {
      return this.PERSONAL.clientSingle.isLoyalty; // Проверка на наличие карты лояльности
    },
    productPrice() {
      return (
        this.product.totalDiscountPrice ||
        this.product.discountPrice ||
        this.product.totalPrice ||
        this.product.price
      );
    },
    oldPrice() {
      // Если есть скидка по лояльности, возвращаем старую цену
      return this.isLoyalty && this.product.discountPrice
        ? this.product.price
        : null;
    },
    currentProvider() {
      return this.PROVIDERS.all.filter(
        p => this.product.providerId === p.id
      )[0];
    }
  },
  methods: {
    ...mapActions({
      ADD_PRODUCT_TO_FAV: "Favorites/ADD_PRODUCT_TO_FAV"
    }),
    imagesProduct(product) {
      if (this.orderType) {
        return (
          product.product.images[0]?.fileUrlSmall ||
          "https://ayanmarket.kz/products/images/4770190051347.png"
        );
      }
      return product.images && product.images.length > 0
        ? product.images[0]
        : product.img ||
            "https://ayanmarket.kz/products/images/4770190051347.png";
    },
    async addToFavorite(productId) {
      const response = await this.ADD_PRODUCT_TO_FAV(productId);
      if (response.type === "error") {
        this.$notify({
          group: "app",
          type: "error",
          duration: 2000,
          title: this.$i18n.t("errors.err"),
          text: response.data.message
        });
      } else {
        this.$notify({
          group: "app",
          type: "success",
          duration: 2000,
          title: this.$i18n.t("errors.success2"),
          text: this.$i18n.t("errors.addProduct")
        });
      }
    }
  }
};
</script>

<style lang="scss">
@import "./style";
</style>
