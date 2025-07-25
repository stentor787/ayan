<template>
  <div>
    <v-dialog
      v-model="value"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      transition="slide-y-reverse-transition"
      width="80%"
      @click:outside="$emit('closedialog');edit = false"
    >
      <v-card v-if="item.address" class="order-dialog">
        <v-card-title class="order-dialog_title">
          <div class="order-dialog_dep-box">
            <img :src="item.departmentImage || require('@/assets/img/shop.png')" alt="logo" width="80">
            <div class="order-dialog_dep-block">
              <span class="order-dialog_dep-name">{{ item.departmentName }}</span>
              <span class="order-dialog_dep-id"> №{{ item.orderId }}</span>
              <span class="order-dialog_dep-date"> {{ getData(item.createdAt) }}</span>
            </div>
          </div>
          <div>
            <span class="order-dialog_status" :style="'background-color: ' + statusColor(item.status.id) ">
              {{ $i18n.locale === 'ru' ? item.status.name : item.status.nameKz }}
            </span>
            <span class="order-dialog_status" :style="'background-color: ' + statusColor(item.paymentStatus.id) ">
              {{ item.paymentStatus.name }}
            </span>
          </div>
          <div class="order_code__left">
            <v-icon>mdi-key</v-icon>  {{ $i18n.t('orderItem.receiveCode') }} {{ item.receiveCode }}
          </div>
        </v-card-title>
        <v-card-text>
          <ProductsSlider :products-arr="item.products" order-type />

          <section class="order-dialog_bot-box">
            <div class="order-dialog_total">
              <p class="order-dialog_total__sum">
                {{ $i18n.t("orderItem.total") }}: <span>{{ item.sumFinal }} ₸</span>
              </p>
              <p class="order-dialog_total__sum">
                Доставка: <span>{{ item.paidForDelivery ? `${item.paidForDelivery} ₸` : 'Бесплатно' }} </span>
              </p>
              <p class="order-dialog_total__sum">
                Итого: <span>{{ item.sumFinal + item.paidForDelivery }} ₸</span>
              </p>
              <p>{{ $i18n.t("orderItem.adress") }}: {{ item.address }}</p>
            </div>
            <div class="order-dialog_btns">
              <v-btn
                color="#503CC3"
                class="order-dialog_btn"
                text
                :disabled="!(item.paymentTypeId === 5 && item.paymentUrl)"
                @click="payOrder(item.paymentUrl)"
              >
                {{ $i18n.t("personalOffice.onlinePay") }}
              </v-btn>
              <v-btn
                color="#503CC3"
                class="order-dialog_btn"
                text
                @click="downloadCheck()"
              >
                {{ $i18n.t("orderItem.bill") }}
              </v-btn>
              <v-btn color="#503CC3" text class="order-dialog_btn" @click="addAllToCart()">
                {{ $i18n.t("orderItem.repeat") }}
              </v-btn>
            </div>
          </section>

          <div class="order-dialog_review">
            <div class="order-dialog_review_grade">
              {{ $i18n.t("orderItem.grade") }}:
              <v-rating
                v-model="input.review"
                hover
                length="5"
                color="orange lighten-3"
                :size="32"
                background-color="#050505"
                :readonly="item.status.id !== 8"
                @input="edit = true"
              />
            </div>
            <div>
              <v-chip-group
                v-model="input.reviewTagIds"
                active-class="active-tag"
                show-arrows
                multiple
              >
                <v-chip
                  v-for="tag in tags"
                  :key="tag.id"
                  :value="tag.id"
                  :disabled="item.status.id !== 8"
                >
                  {{ $i18n.locale === 'ru' ? tag.title : tag.titleKz }}
                </v-chip>
              </v-chip-group>
            </div>
            <div>
              <v-textarea
                v-model="input.comment"
                solo
                hide-details
                color="#503CC3"
                auto-grow
                class="order-dialog_review__area"
                :readonly="item.status.id !== 8"
                @input="edit = true"
              />
            </div>
            <div class="d-flex justify-end pt-2">
              <v-btn color="#ACAAAA" text class="order-dialog_btn" @click="sendReview()">
                {{ $i18n.t("orderItem.save") }}
              </v-btn>
            </div>
          </div>
          <v-btn color="#503CC3" text class="order-dialog_btn close-btn" @click="$emit('closedialog');edit = false">
            Закрыть
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      default: null
    },
    value: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      input: {
        comment: '',
        orderId: 0,
        review: 0,
        reviewTagIds: [],
        orderReviewImageIds: []
      },
      tags: [],
      edit: false,
      panel: 0
    }
  },
  computed: {
    ...mapGetters({
      CART: 'Cart/STATE',
      REVIEW: 'Review/STATE'
    })
  },
  watch: {
    // когда ставим оценку, подтягиваем тэги к оценке
    'input.review': async function (stars) {
      if (stars) {
        const response = await this.GET_TAGS(stars)
        if (response.type !== 'error') {
          this.tags = response.data
        }
      }
    },
    // при закрытии окна все данные обнуляем, при открытии назначаем
    value (val) {
      if (!val) {
        this.tags = []
        this.input.review = null
        this.input.orderId = null
        this.input.comment = null
        this.input.reviewTagIds = []
      } else {
        this.input.review = this.item.orderReview?.reviewRating.value
        this.input.orderId = this.item.id
        this.input.comment = this.item.orderReview?.comment
        this.input.reviewTagIds = this.item.orderReview?.reviewTags.map(item => item.id)
      }
    }
  },
  mounted () {
    this.$eventBus.$on('addToCart', (product) => {
      this.addToCart(product)
    })
  },
  methods: {
    ...mapActions({
      SEND_REVIEW: 'Review/SEND_REVIEW',
      GET_TAGS: 'Review/GET_TAGS',
      DOWNLOAD_CHECK: 'Order/DOWNLOAD_CHECK',
      CHANGE_CLIENT_CART: 'Cart/CHANGE_CLIENT_CART'
    }),
    async downloadCheck () {
      if (this.item.paymentTypeId === 4 && this.item.paymentUrl) {
        const resp = await this.DOWNLOAD_CHECK(this.item.orderId)
        if (resp.length !== 0) {
          resp.forEach((url, i) => {
            const link = document.createElement('a')
            link.href = url
            link.download = `сheck №${this.item.orderId}-${i}`
            link.click()
            URL.revokeObjectURL(link.href)
          })
        } else {
          this.$notify({
            group: 'app',
            type: 'error',
            duration: 2000,
            title: this.$i18n.t('errors.err'),
            text: 'Непредвиденная ошибка'
          })
        }
      }
    },
    async addToCart (product) {
      // добавляем 1 раз в корзину, с филиалом таким же какой был
      const resp = await this.CHANGE_CLIENT_CART({
        amount: product.product.measure.coef,
        departmentId: this.$cookies.get('availableDepartments')[0],
        productId: product.product.id,
        providerId: product.provider.id
      })
      if (resp) {
        this.$notify({
          group: 'app',
          type: 'success',
          duration: 2000,
          title: this.$i18n.t('errors.success2'),
          text: `${this.$capitalize(this.$i18n.locale === 'ru' ? product.product.name : product.product.nameKz)} ${this.$i18n.t('orderItem.added')}`
        })
      }
    },
    addAllToCart () {
      // добавляем все продукты в корзину
      this.item.products.forEach(product => this.addToCart(product))
    },
    async sendReview () {
      if (!this.edit) {
        return
      }
      await this.SEND_REVIEW(this.input)
      this.edit = false
      this.$emit('getorders')
    },
    // делает удобочитаемую дату
    getData (str) {
      return str.substring(0, 10).replaceAll('-', '.')
    },

    goToProductPage (product) {
      this.$router.push(
        `/product/${this.$translit(product.name)}-${
          product.id
        }`
      )
    },
    payOrder (linkUrl) {
      if (linkUrl) {
        this.$notify({
          group: 'appcenterbig',
          type: 'success',
          duration: 3000,
          title: 'Перенаправление',
          text: 'Вы будете перенаправлены на страницу для оплаты заказа'
        })
        // перенаправляет на страницу онлайн оплаты
        setTimeout(() => {
          const link = document.createElement('a')
          link.href = linkUrl
          link.click()
          URL.revokeObjectURL(link.href)
        }, 3000)
      }
    },
    statusColor (item) {
      const color =
        item === 1
          ? '#5cba4f'
          : item === 2
            ? '#5cba4f'
            : item === 3
              ? '#85C5E0'
              : item === 4
                ? '#df8956'
                : item === 5
                  ? '#df8956'
                  : item === 6
                    ? '#3A9FC9'
                    : item === 7
                      ? '#3A9FC9'
                      : item === 8
                        ? '#249641'
                        : item === 9
                          ? '#929594'
                          : '#929594'
      return color
    }
  }
}
</script>
<style lang="scss">
@import "./OrderItem.scss";
</style>
