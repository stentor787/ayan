
<template>
  <div class="d-flex flex-column align-end mt-1 mr-2">
    <!-- Скидка -->
    <div v-if="productDiscount && !loyalty" 
         :class="['dis-product_card--sale', { 'shift-up': hitProduct }]">
      <div style="margin-top: -3px;">
        {{ $i18n.t("discount.sale") }}
      </div>
    </div>

    <!-- Лояльность -->
    <div v-else-if="loyalty" class="dis-product_card--sale loyalty">
      Скидка клуба
    </div>

    <!-- Мегахит! -->
    <div v-if="hitProduct" class="dis-product_card--hit">
      <div v-if="showForCategoryId(170535)">
        <div style="margin-top: -3px;">
          Мегахит!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AyanFrontendProductdiscount',
  props: {
    productDiscount: {
      type: Boolean,
      default: false
    },
    loyalty: {
      type: Boolean,
      default: false
    },
    productPrice: {
      type: [Number, String],
      default: null
    },
    product: {
      type: Object,
      default: null
    }
  },
  computed: {
    hitProduct () {
      return this.product && this.product.categoryIds && this.showForCategoryId(170535)
    }
  },
  methods: {
    showForCategoryId (categoryId) {
      return this.product.categoryIds.includes(categoryId)
    }
  }
}
</script>
<style lang="scss" scoped>
.dis-product_card__price-percent {
  padding: 2px 12px;
  background: #32C8F0 ;
  width: max-content;
  color: white;
  border-radius: 5px;
  font-size: 11px;
  font-weight: bold;
  @media screen and (max-width: 650px) {
    padding: 2px 6px;
    font-size: 11px;
    white-space: nowrap;
  }
}
.dis-product_card--sale {
    margin-bottom: 9px;
    background-color: #FF9600;
    border-radius: 5px;
    width: 72px;
    height: 16px;
    padding: 2px 3px 2px 3px;
    color: white;
    font-size: 12px;
    z-index: 1;
  @media screen and (max-width: 650px) {
    font-size: 8px;
  }
}
.loyalty {
  margin-bottom: 2px;
    width: 90px;
    height: 20px;
    padding: 2px 3px 2px 3px;
    color: white;
    font-size: 12px;
    background-color: #89CE38;
  
}
.dis-product_card--hit {
  position: absolute;
  top: 55%;
  left: 0px;
  margin-bottom: 9px;
  background: linear-gradient(to bottom right, #FF9600 10%, #FF4A50 30%, #E61E78 90%);
  border-radius: 5px;
  width: 60px;
  height: 16px;
  padding: 2px 3px 2px 3px;
  color: white;
  font-size: 12px;
  z-index: 1;
  @media screen and (max-width: 650px) {
    font-size: 11px;
  }
}
.shift-up {
     margin-bottom: 19px;
}
</style>
