<template>
  <div v-if="sliderCategory.length !== 0" class="slider_box2">
    <div class="slider2_buttons">
      <button @click="scrollCarousel(true)">
        <v-icon class="slider2_icons">
          mdi-chevron-left
        </v-icon>
      </button>
    </div>
    <div
      class="slider2"
      eager
    >
      <div ref="sliderContainer" class="slider2_row">
        <div
          v-for="(item, index) in sliderCategory"
          :key="index"
          class="category-box"
          :data-index="index"
          @click="redirectTo( item )"
        >
          <img class="category-box_img" :src="productsType ? item.imageUrl : item.categoryImg">
          <div v-if="!productsType" class="category-box_name">
            {{ $i18n.locale === 'ru' ? item.categoryName : item.categoryNameKz }}
          </div>
        </div>
      </div>
    </div>
    <div class="slider2_buttons">
      <button @click="scrollCarousel()">
        <v-icon class="slider2_icons">
          mdi-chevron-right
        </v-icon>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'SliderCategory',
  props: {
    imagesArr: {
      type: Array,
      required: true
    },
    productsType: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      sliderCategory: [],
      animating: false
    }
  },
  computed: {
    ...mapGetters({
      PRODUCT: 'Products/SHARE_PRODUCT',
      GEO: 'GEO/STATE'
    })
  },
  watch: {
    imagesArr (newVal) {
      this.sliderCategory = [...newVal]
    }
  },
  mounted () {
    let arr = []
    if (!this.productsType) {
      arr = this.imagesArr.filter(cat => cat.categoryImg && cat.promo)
    }
    this.sliderCategory = [...arr]
  },
  methods: {
    ...mapActions({
      GET_SHARE_PRODUCT: 'Products/GET_SHARE_PRODUCT'
    }),
    redirectTo (data) {
      if (this.productsType) {
        this.$router.push(`/product/${this.$translit(data.productName)}-${data.productId}`)
      } else {
        this.$router.push(`/${this.GEO.activeShop.route}/collection/${this.$translit(data.categoryName)}-${data.categoryId}`)
      }
    },
    scrollCarousel (toLeft) {
      const sliderContainer = this.$refs.sliderContainer
      // Проверяем, идет ли анимация
      if (this.animating) {
        return
      }
      // определяем элемент который будет уходить с экрана
      const item = toLeft ? sliderContainer.lastElementChild : sliderContainer.firstElementChild
      const removeElementIndex = item.dataset.index
      const shiftDistance = item.offsetWidth + 10 // Сдвиг больше чтобы не было поддергивания
      // добавляем флаг анимации
      this.animating = true
      if (toLeft) {
        // вставляем напрямую в html для плавности анимации
        sliderContainer.insertBefore(item.cloneNode(true), sliderContainer.firstChild)
      }
      sliderContainer.style.transition = toLeft ? 'none' : 'transform 0.3s ease-in-out'
      sliderContainer.style.transform = `translateX(-${shiftDistance}px)`
      // После завершения анимации добавляем первый элемент в конец
      const id = setTimeout(() => {
        if (toLeft) {
          sliderContainer.removeChild(sliderContainer.firstChild)
          this.sliderCategory.unshift(this.sliderCategory[removeElementIndex])
          this.sliderCategory.pop()
        } else {
          this.sliderCategory.push(this.sliderCategory[removeElementIndex])
          this.sliderCategory.shift()
        }
        sliderContainer.style.transition = !toLeft ? 'none' : 'transform 0.3s ease-in-out'
        sliderContainer.style.transform = 'translateX(0)'
        // убираем флаг для плавности прокрутки, чтобы не спамили кнопку
        this.stopAnimate(toLeft)
        clearTimeout(id)
      }, toLeft ? 0 : 300)
    },
    // Вспомогательная функция, при скроле влево флаг остановки анимации нужен позже
    stopAnimate (toLeft) {
      if (!toLeft) {
        this.animating = false
        return
      }
      const id = setTimeout(() => { this.animating = false; clearTimeout(id) }, 300)
    }
  }
}
</script>

<style lang="scss">
@import "./style";
</style>
