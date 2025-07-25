<template>
  <div v-if="shouldShowSvg">
    <img
      v-if="showSvgForCategoryId(170554)"
      :src="require('@/assets/img/svg/sale_60.svg')"
      alt="sale_60"
      width="40"
      height="40"
    >
    <img
      v-if="showSvgForCategoryId(170535)"
      :src="require('@/assets/img/svg/superHit.svg')"
      alt="super_hit"
      width="40"
      height="40"
    >
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      default: null
    }
  },
  computed: {
    shouldShowSvg () {
      return (
        this.product &&
        this.product.categoryIds &&
        (this.showSvgForCategoryId(170554) || this.showSvgForCategoryId(170535))
      )
    }
  },
  methods: {
    showSvgForCategoryId (categoryId) {
      return this.product.categoryIds && this.product.categoryIds.includes(categoryId)
    }
  }
}
</script>
