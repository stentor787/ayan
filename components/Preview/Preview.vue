<template>
  <div class="overlay">
    <div v-if="$vuetify.breakpoint.xsOnly" class="prev">
      <img src="@/assets/img/prev_mobile.jpg" alt="ayanMarket" class="prev_img">
    </div>
    <div v-else class="prev" @click="$emit('close-preview', false);">
      <img src="@/assets/img/prev.jpeg" alt="ayanMarket" class="prev_img">
    </div>
  </div>
</template>

<script>

export default {
  name: 'Preview'
}
</script>

  <style lang="scss" scoped>
  @import "./style";
  </style>
