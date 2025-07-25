<template>
  <div class="dis-products_category mb-3 mt-4" :class="special && 'special-category'">
    <!-- Обёртка для заголовка с фиксированной шириной -->
    <div class="category-title-wrapper">
      <div class="dis-products_category__title pl-4" :class="special && 'special-category_title'">
        <nuxt-link
          :to="special ? '' : `/${GEO.activeShop.route}/collection/${$translit(title)}-${id}/`"
          class="dis-products_category__title"
        >
          <span class="dis-products_category__title_link" :class="special && 'special-category_link'">
            {{ title }}
          </span>
        </nuxt-link>
        <nuxt-link
          :to="special ? '' : `/${GEO.activeShop.route}/collection/${$translit(title)}-${id}/`"
          class="dis-products_category__title"
        >
        <!-- Кнопка "Ещё >" справа -->
        <button class="more-button">Ещё &gt;</button>
      </nuxt-link>
      </div>
    </div>
    <slot name="sort" />
    <div :class="[categoryItemsClass]">
      <slot />
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    id: {
      type: [String, Number],
      default: null
    },
    special: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE'
    }),
    categoryItemsClass () {
      // Проверка, является ли текущая страница главной
      if (this.isHomePage()) {
        return this.special ? 'dis-products_category__items pb-1 special-category_items' : 'dis-products_category__items pb-1'
        // return 'dis-products_category__items pb-1'
      } else {
        // В остальных случаях, возвращаем разные классы в зависимости от условий
        return 'dis-products_category_noScroll'
      }
    }
  },
  methods: {
    isHomePage () {
      return this.$route.path === '/'
    }
  }
}
</script>

<style lang="scss">
@import './style';
</style>
