<template>
  <div v-if="reviews.length !== 0" class="review">
    <p v-if="reviews.length === 1" class="review_popular">
      {{ $i18n.t("product.popular") }}
    </p>
    <div v-for="review in reviews" :key="review ? review.providerProductReviewId : 0" class="review_block">
      <div class="name-block">
        <p class="name-block_name">
          {{ review.clientName }}
        </p>
        <div class="name-block_rate">
          <v-rating
            :value="review.valueRating"
            half-increments
            readonly
            length="5"
            color="orange lighten-3"
            :size="16"
            background-color="#050505"
            class="name-block_rate__stars"
          />
          <p class="name-block_rate__date">
            {{ getDate(review.dateAdd) }}
          </p>
        </div>
      </div>
      <div v-if="review.images.length" class="images">
        <div v-for="(img, index) in review.images" :key="img.id" class="images_single" @click="$emit('openFotoSlider', createArr(review.images, index ))">
          <img :src="img.fileUrl" :alt="img.alt" height="100%">
        </div>
      </div>
      <p v-if="review.description" class="review_title">
        {{ $i18n.t("product.comment") }}
      </p>
      <p>{{ review.description }}</p>
      <div class="review_btns">
        <div>
          <v-btn
            icon
            :color="review.currentClientLike ? '#EE4C48' : 'black'"
            @click="addLike(review)"
          >
            <v-icon>{{ review.currentClientLike ? "mdi-thumb-up" : "mdi-thumb-up-outline" }}</v-icon>
          </v-btn>
          {{ review.likes }}
        </div>
        <div>
          <v-btn
            icon
            :color="review.currentClientLike === false ? '#EE4C48' : 'black'"
            @click="addDislike(review)"
          >
            <v-icon>{{ review.currentClientLike === false ? "mdi-thumb-down" : "mdi-thumb-down-outline" }}</v-icon>
          </v-btn>
          {{ review.dislikes }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="nocomment">
    {{ $i18n.t("product.noComment") }}
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'Review',
  props: {
    reviews: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    ...mapActions({
      PLUS_LIKE: 'Review/PLUS_LIKE',
      MINUS_LIKE: 'Review/MINUS_LIKE',
      PLUS_DISLIKE: 'Review/PLUS_DISLIKE',
      MINUS_DISLIKE: 'Review/MINUS_DISLIKE'
    }),
    createArr (arr, index) {
      const newArr = [...arr]
      if (index === 0) {
        return arr
      } else {
        // меняем местами выбранное фото с первым, чтобы первым открывалось оно
        const deleted = newArr.splice(0, 1, arr[index])
        newArr.splice(index, 1, deleted[0])
        return newArr
      }
    },
    getDate (number) {
      const date = this.$moment(number).format('LL')
      return date
    },
    async addLike (review) {
      if (!this.$cookies.get('clientId')) {
        this.$eventBus.$emit('openDialog', true)
        return
      }
      if (review.currentClientLike) {
        await this.MINUS_LIKE(review.providerProductReviewId)
      } else {
        await this.PLUS_LIKE(review.providerProductReviewId)
      }
      this.$emit('getRevievs')
    },
    async addDislike (review) {
      if (!this.$cookies.get('clientId')) {
        this.$eventBus.$emit('openDialog', true)
        return
      }
      if (review.currentClientLike === false) {
        await this.MINUS_DISLIKE(review.providerProductReviewId)
      }
      if (review.currentClientLike === null || review.currentClientLike) {
        await this.PLUS_DISLIKE(review.providerProductReviewId)
        this.dislike = true
        this.like = false
      }
      this.$emit('getRevievs')
    }
  }
}
</script>

  <style lang="scss">
    @import './Review';
  </style>
