<template>
  <section class="add">
    <template v-if="!useIcon">
      <v-btn
        color="#503CC3"
        class="add_btn"
        @click="openModal()"
      >
        {{ $i18n.t("product.addReview") }}
      </v-btn>
      <div v-if="rating.length" class="add_rating">
        <p class="add_total">
          {{ $i18n.t("product.grade") }} {{ total }}
        </p>
        <p class="add_text">
          {{ $i18n.t("product.on") }} {{ rating.length }} отзывов
        </p>
        <div v-for="item in stars" :key="item.star" class="add_block">
          <v-rating
            :value="item.star"
            readonly
            length="5"
            color="orange lighten-3"
            :size="16"
            background-color="#050505"
            class="add_stars"
          />
          <p class="add_count">
            {{ item.count }}
          </p>
        </div>
      </div>
    </template>
    <template v-else>
      <v-icon class="add_icon" @click="openModal">
        mdi-camera-plus
      </v-icon>
    </template>
  </section>
</template>

<script>
export default {
  name: 'AddReview',
  props: {
    rating: {
      type: Array,
      default: () => []
    },
    total: {
      type: String,
      default: ''
    },
    useIcon: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      stars: [
        { star: 5, count: 0 },
        { star: 4, count: 0 },
        { star: 3, count: 0 },
        { star: 2, count: 0 },
        { star: 1, count: 0 }
      ]
    }
  },
  mounted () {
    this.rating.forEach((review) => {
      if (review < 2) {
        this.stars[4].count += 1
      }
      if (review < 3 && review >= 2) {
        this.stars[3].count += 1
      }
      if (review < 4 && review >= 3) {
        this.stars[2].count += 1
      }
      if (review < 4.5 && review >= 4) {
        this.stars[1].count += 1
      }
      if (review >= 4.5 && review <= 5) {
        this.stars[0].count += 1
      }
    })
  },
  methods: {
    openModal () {
      if (!this.$cookies.get('clientId')) {
        this.$eventBus.$emit('openDialog', true)
        return
      }
      this.$emit('openModal')
    }
  }
}
</script>

<style lang="scss">
  @import './AddReview';
</style>
