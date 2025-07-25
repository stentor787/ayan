<template>
  <div class="slider_box">
    <v-carousel
      continuous
      cycle
      show-arrows-on-hover
      :show-arrows="slides !== 1"
      hide-delimiters
      class="slider"
    >
      <!-- атрибут eager отвечает за предзугрузку следующего слайда -->
      <v-carousel-item
        v-for="(item) in slides"
        :key="item.id"
        class="slider_item"
        eager
        @click="goToCategory(item)"
      >
        <div
          class="sheet"
        >
          <div class="d-flex fill-height justify-center align-center sheet_item" style="width: 88%">
            <v-img :src="item.imageUrl" transition="fade-transition" eager class="slider_item_img" />
          </div>
          <div class="sheet_item2">
            <div :style="{backgroundImage:`url(${getNextSlide(item.bannerId)})`}" class="slider_item_img2" />
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    slides: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      deviceType: 1
    }
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE'
    })
  },
  methods: {
    ...mapActions({
      SET_ACTIVE_SHOP: 'GEO/SET_ACTIVE_SHOP',
      GET_HOVER_PANEL_CATEGORIES: 'Category/GET_HOVER_PANEL_CATEGORIES'
    }),
    getNextSlide (slideId) {
      let current = this.slides.findIndex(slide => slide.bannerId === slideId)
      if (current === this.slides.length - 1) {
        current = -1
      }
      return this.slides[current + 1].imageUrl
    },
    goToCategory (data) {
      if (data.categoryId) {
        this.$router.push(`/${this.GEO.activeShop.route}/collection/${this.$translit(data.categoryName)}-${data.categoryId}`)
      }
      if (data.storeOpeningDepartment) {
        this.activeShopMode(data.storeOpeningDepartment)
      }
    },
    // переключает сайт в режим одного поставщика
    async activeShopMode (departmentId) {
      // если уже в этом режиме то просто перводим на страницу категорий
      if (this.GEO.activeShop.id === departmentId) {
        this.$router.push(`/${this.GEO.activeShop.route}/collection/vse-categoryy-0/`)
        return
      }
      const dep = this.GEO.info.depEntities.find(dep => dep.id === departmentId)
      if (!dep) {
        return
      }
      const shop = { id: departmentId, route: `shop-${this.$translit(dep.name)}` }
      this.SET_ACTIVE_SHOP(shop)
      await this.GET_HOVER_PANEL_CATEGORIES([departmentId])
      this.$router.push(`/${this.GEO.activeShop.route}/collection/vse-categoryy-0/`)
    }
  }
}
</script>
<style lang="scss">
  @import "./style";
</style>
