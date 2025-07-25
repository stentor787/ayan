<template>
  <v-row class="product-item" no-gutters>
    <v-col cols="2" class="product-item__image" @click="openProduct()">
      <img
        ref="image"
        :src="imagesProduct()"
        :alt="productEntity.productName"
        :title="productEntity.productName"
        style="max-height: 100%"
        @error="replaceImage('image')"
      >
    </v-col>

    <!-- Название товара, провайдер -->
    <v-col :cols="$vuetify.breakpoint.xsOnly ? auto : 3" xs="5" class="product-item__title-block">
      <div class="product-item__title-block-wrapper">
        <h3 class="product-item__title" @click="openProduct()">
          {{ $capitalize($i18n.locale === 'ru' ? productEntity.productName : productEntity.productNameKz) }}
        </h3>
        <p v-if="currentProvider" class="product-item__subtitle">
          {{ currentProvider.name }}
        </p>
      </div>
    </v-col>

    <!-- Цена (мобильная версия) -->
    <div class="product-item__total-priceMobile">
      <span>{{ totalPrice.toLocaleString('ru') }} тг</span>
      <span 
        v-if="productEntity.totalDiscountPrice || productEntity.discountPrice" 
        class="price_discount"
      >
        {{ productEntity.totalPrice.toLocaleString('ru') }} тг
      </span>
      <span 
        v-if="productEntity.totalDiscountPrice || productEntity.discountPrice" 
        class="price_percent"
      >
        - {{ productEntity.discountPercent + "%" }}
      </span>
    </div>

    <!-- Секция счётчика + цена -->
    <section class="product-item__actions">
      <div class="product-item__actions-wrapper">
        <div class="product-item__btn-panel">
          <!-- Счётчик -->
          <ProductCounter
            ref="theCounter"
            :variable-digit="productEntity.amount"
            :measure="productEntity.measureType"
            :step="productEntity.measureStep"
            :disable-status="productEntity.measureType === 'шт'
              ? productEntity.amount <= 1
              : parseFloat(productEntity.amount) <= 0.1"
            :disable="isPacket"
            :large="large"

            @minus-btn-toggle="$emit('minus-product', $event)"
            @plus-btn-toggle="$emit('add-product', $event)"
            @change-amount="updateCartQuantity($event)"
          />
        </div>

        <!-- Цена (основная версия) -->
        <div class="product-item__total-price">
          <span>{{ totalPrice.toLocaleString('ru') }} тг</span>
          <span 
            v-if="productEntity.totalDiscountPrice" 
            class="price_discount"
          >
            {{ productEntity.totalPrice }} тг
          </span>
          <span 
            v-if="productEntity.totalDiscountPrice" 
            class="price_percent" 
            :class="productEntity.loyaltyDiscount && 'price_green-percent'"
          >
            {{ productEntity.discountPercent + "%" }}
          </span>
        </div>

        <!-- Кнопки "Избранное" и "Удалить" (если large) -->
        <div v-if="large && !isPacket" class="product-item__btns-wrapper">
          <v-btn color="#F4F6FA" @click="addToFavorite()">
            <v-icon color="#fca82f">mdi-heart-outline</v-icon>
          </v-btn>
          <v-btn color="#F4F6FA" @click="$emit('delete', $event)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>

        <!-- Заглушка, если isPacket -->
        <div v-if="isPacket" class="product-item__btns-fake" />
      </div>
    </section>
  </v-row>
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
      minPrice: 0
    }
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE',
      PROVIDERS: 'Providers/STATE',
      PRODUCT: 'Products/SHARE_PRODUCT'
    }),
    isPacket () {
      // пример: если productId === 748749, это "набор/packet" - блокируем счётчик
      return this.productEntity?.productId === 748749
    },
    totalPrice () {
      // Если есть скидочная цена, показываем её. Иначе - обычную
      return this.productEntity.totalDiscountPrice || this.productEntity.totalPrice
    },
    currentProvider () {
      return this.PROVIDERS.all.find(p => p.id === this.productEntity.providerId)
    }
  },
  methods: {
    ...mapActions({
      GET_SHARE_PRODUCT: 'Products/GET_SHARE_PRODUCT',
      ADD_PRODUCT_TO_FAV: 'Favorites/ADD_PRODUCT_TO_FAV'
    }),

    // Открыть страницу товара
    openProduct () {
      const pathName = this.$translit(this.productEntity.productName)
      this.$router.push(`/product/${pathName}-${this.productEntity.productId}`)
    },

    // Добавление в избранное (если пользователь авторизован)
    addToFavorite () {
      if (this.$cookies.get('clientId')) {
        this.ADD_PRODUCT_TO_FAV(this.productEntity.productId)
      } else {
        // Если не авторизован - показываем диалог
        this.$eventBus.$emit('openDialog', true)
      }
    },

    // Функция определения картинки (или заглушки)
    imagesProduct () {
      if (this.productEntity.images?.length > 0) {
        return this.productEntity.images[0]
      } else {
        return this.productEntity.img || 'https://ayanmarket.kz/products/images/4770190051347.png'
      }
    },

    // Если картинка не загрузилась
    replaceImage () {
      this.$refs.image.src = require('@/assets/img/noImg.png')
    },

    /**
     * Метод, который срабатывает при РУЧНОМ вводе количества в ProductCounter,
     * после события `blur` или нажатия Enter (см. @change-amount).
     * newValue — число, которое пользователь ввёл.
     */
    updateCartQuantity(newValue) {
      const oldVal = parseFloat(this.productEntity.amount)
      let finalVal = parseFloat(newValue)

      // 1) Если пользователь ввёл нечисловое, 0 или отрицательное — поставим 1 (или минимальный шаг)
      if (isNaN(finalVal) || finalVal <= 0) {
        finalVal = 1
      }

      // 2) Если есть "balance" (сколько всего на складе) и введено больше:
      if (this.productEntity.balance && finalVal > this.productEntity.balance) {
        finalVal = this.productEntity.balance

        // Показываем уведомление (можно свою формулировку)
        this.$notify({
          group: 'app',
          type: 'error',
          duration: 3000,
          title: this.$i18n.t('errors.atention'),
          text: this.$i18n.t('errors.noProducts') 
          // Например, `text: \`Максимально доступно ${this.productEntity.balance} шт.\``
        })
      }

      // 3) Если есть limit (опционально) и введено больше
      if (this.productEntity.limit !== null && finalVal > this.productEntity.limit) {
        finalVal = this.productEntity.limit

        // Можно тоже показать уведомление
        // this.$notify(...)
      }

      // 4) Сравниваем финальное число с тем, что было
      if (finalVal > oldVal) {
        // Это увеличение, вызываем "плюс"
        this.$emit('add-product', finalVal)
      } else if (finalVal < oldVal) {
        // Это уменьшение, вызываем "минус"
        this.$emit('minus-product', finalVal)
      } 
      // Если finalVal === oldVal, фактически ничего не меняется по количеству

      // 5) Важно: обновим productEntity.amount,
      // чтобы при повторной попытке (снова ввести "200") логика отработала заново.
      this.productEntity.amount = finalVal
      // Принудительно синхронизируем поле, чтобы даже если finalVal == oldVal,
      // счётчик вернулось на нужное значение
      if (this.$refs.theCounter) {
        this.$refs.theCounter.forceSetQuantity(finalVal)
      }
    }
  }
}
</script>

<style lang="scss">
@import "./style";
</style>
