<template>
  <div class="slider3">
    <button class="" @click="prevSlide">
      <v-icon class="slider3_button_icon">
        mdi-chevron-left
      </v-icon>
    </button>
    <div ref="slider" class="slider_box3">
      <template v-if="productsArr.length !== 0">
        <MinProduct v-for="(product, index) in productsArr" :key="index" :product="product" :order-type="orderType" />
      </template>
    </div>
    <button class="" @click="nextSlide">
      <v-icon class="slider3_button_icon">
        mdi-chevron-right
      </v-icon>
    </button>
  </div>
</template>

<script>
import MinProduct from '../MinProductItem/MinProduct.vue'
export default {
  name: 'ProductSlider',
  components: { MinProduct },
  props: {
    productsArr: {
      type: Array,
      required: true
    },
    orderType: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    prevSlide () {
      this.$refs.slider.scrollLeft -= 150
    },
    nextSlide () {
      this.$refs.slider.scrollLeft += 150
    }
  }
}
</script>
<style lang="scss">
@import "./style.scss";
</style>
