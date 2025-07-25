<template>
  <v-dialog
    v-model="modal"
    persistent
    width="70%"
    @click:outside="$emit('update:modal', false)"
    @keydown.esc="$emit('update:modal', false)"
  >
    <v-card>
      <v-card-title class="pb-2">
        {{ $i18n.t("product.addReview") }}
        <v-spacer />
        <v-btn icon color="#503CC3" @click="$emit('update:modal', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="rev-modal_rate">
          <p>{{ $i18n.t("product.star") }}</p>
          <v-rating
            v-model="rating"
            half-increments
            hover
            length="5"
            color="orange lighten-3"
            :size="32"
            background-color="#050505"
            class="rev-modal_rate__stars"
          />
        </div>
        <v-textarea
          v-model="description"
          row-height="18"
          :label=" $i18n.t('order.comments')"
          outlined
          dense
          class="order-main_area"
          color="#503CC3"
          hide-details
          background-color="#e9e9e9"
        />
        <div class="rev-modal_foto">
          <p>{{ $i18n.t("product.download") }}</p>
          <input
            ref="imgInput"
            type="file"
            hidden
            multiple
            accept="image/png, image/jpeg, image/jpg"
            @change="setImage($event.target)"
          >
          <div class="rev-modal_foto-block">
            <div v-for="img in imagesArr" :key="img.id" class="rev-modal_foto-single">
              <img :src="img.url" height="100%">
              <v-btn
                absolute
                icon
                color="error"
                class="rev-modal_foto-delete"
                @click="deleteImg(img.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
            <v-btn
              v-if="imagesArr.length < 3"
              icon
              x-large
              @click="$refs.imgInput.click()"
            >
              <v-icon class="rev-modal_foto-icon">
                mdi-camera-plus-outline
              </v-icon>
            </v-btn>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="rev-modal_btns">
        <v-btn
          class="mr-4 white--text"
          color="#503CC3"
          @click="createReview()"
        >
          {{ $i18n.t("product.confirm") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'ReviewModal',
  props: {
    modal: {
      type: Boolean,
      default: false
    },
    productId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      description: '',
      rating: 5,
      imagesArr: []
    }
  },
  watch: {
    modal (val) {
      if (!val) {
        this.description = ''
        this.rating = 5
        this.imagesArr = []
      }
    }
  },
  methods: {
    ...mapActions({
      CREATE_PRODUCT_REVIEW: 'Review/CREATE_PRODUCT_REVIEW',
      DOWNLOAD_REVIEW_FOTO: 'Review/DOWNLOAD_REVIEW_FOTO'
    }),
    setImage (val) {
      // Максимум 3 фото грузит, или меньше, если уже загрузил
      const currentFiles = [...val.files].slice(0, (this.imagesArr.length - 3) * -1)
      const arr = currentFiles.map((file) => {
        const obj = {
          url: URL.createObjectURL(file),
          id: Math.random() * 1000,
          file
        }
        return obj
      })
      this.imagesArr = this.imagesArr.concat(arr)
    },
    deleteImg (id) {
      this.imagesArr = this.imagesArr.filter(img => img.id !== id)
    },
    async createReview () {
      let imageIds = []
      // если загружены фото, то загружаем фото на сервер
      if (this.imagesArr.length) {
        const payload = {
          id: this.productId,
          files: (() => {
            const formData = new FormData()
            this.imagesArr.forEach((img) => {
              formData.append('files', img.file)
            })
            return formData
          })()
        }
        const response = await this.DOWNLOAD_REVIEW_FOTO(payload)
        imageIds = response
      }
      const payload = {
        productId: this.productId,
        description: this.description,
        valueRating: this.rating,
        imageIds,
        videoIds: []
      }
      const response = await this.CREATE_PRODUCT_REVIEW(payload)
      if (response.type === 'error') {
        this.$notify({
          group: 'app',
          type: 'warn',
          duration: 2000,
          title: this.$i18n.t('errors.atention'),
          text: response.data.message
        })
      } else {
        this.$notify({
          group: 'app',
          type: 'success',
          duration: 2000,
          title: 'Спасибо за Ваш отзыв',
          text: 'Скоро он появится на сайте'
        })
      }
      this.$emit('update:modal', false)
    }
  }
}
</script>

    <style lang="scss">
      @import './ReviewModal';
    </style>
