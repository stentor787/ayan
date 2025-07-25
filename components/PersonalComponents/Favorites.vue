<template>
  <div>
    <d-product-card
      v-for="product in favorites"
      :key="product.id"
      :product="product"
      class="d-inline-block"
      style="margin-left:5px; width: 180px"
    />
  </div>
</template>
<script>
import DProductCard from '@/components/ProductCard/ProductCard'
export default {
  components: {
    DProductCard
  },
  props: {
    favorites: {
      type: Array,
      default: null
    }
  }
}
</script>
