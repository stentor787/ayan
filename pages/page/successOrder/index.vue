<template>
  <v-container fluid>
    <!-- блок с заказами -->
    <div class="orders">
      <div class="orders_header">
        <h2 class="orders_title">
          {{ $i18n.t("errors.successOrder") }}
        </h2>
      </div>
      <!-- заказы -->
      <div v-for="order in ORDERS" :key="order.id" class="box">
        <!-- блок с данными о заказе -->
        <div class="data">
          <p class="data_id">
            {{ $i18n.t("orderItem.order") }} № {{ order.id }}
          </p>
          <div class="data_item">
            <p>{{ $i18n.t("orderItem.create") }} : </p>
            <p class="bold-text">
              {{ getDate() }}
            </p>
          </div>
          <div class="data_item">
            <p>{{ $i18n.t("orderItem.delivery") }} :</p>
            <p class="bold-text red-text">
              {{ getDate(order.deliveryTime) }}
            </p>
          </div>
          <div class="data_item">
            <p>{{ $i18n.t("personalOffice.deliveryAdres") }} :</p>
            <p class="bold-text">
              {{ order.address.street }}, {{ order.address.house }}
            </p>
          </div>
          <div class="data_item">
            <p>{{ $i18n.t("order.payType") }} :</p>
            <p class="bold-text">
              {{ order.payment.name }}
            </p>
          </div>
          <div class="data_item">
            <p>{{ $i18n.t("order.delPrice") }} :</p>
            <p class="bold-text">
              {{ order.paidForDelivery ? `${(order.paidForDelivery).toLocaleString('ru')} ₸` : $i18n.t("order.free") }}
            </p>
          </div>
          <div class="data_item">
            <p>{{ $i18n.t("orderItem.sum") }} :</p>
            <p class="bold-text">
              {{ (getSum(order.products, order.paidForDelivery)).toLocaleString('ru') }} ₸
            </p>
          </div>
        </div>
        <!-- продукты -->
        <div class="box_slider">
          <ProductsSlider :products-arr="order.products" />
        </div>
      </div>
      <!-- кнопки нижние -->
      <div class="orders_buttons">
        <v-btn
          dark
          color="#503CC3"
          class="orders_buttons_item"
          @click="$router.push('/') "
        >
          {{ $i18n.t("orderItem.onMain") }}
        </v-btn>
        <v-btn
          dark
          color="#503CC3"
          class="orders_buttons_item"
          @click="$router.push('/page/orders/')"
        >
          {{ $i18n.t("personalOffice.history") }}
        </v-btn>
      </div>
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      ORDERS: 'Order/LAST'
    })
  },
  created () {
    if (!this.ORDERS.length) {
      this.$router.push('/')
    }
  },
  methods: {
    getSum (products, delivery) {
      const price = products.reduce((acc, item) => {
        const price = (item.totalDiscountPrice || Math.floor(item.discountPrice * item.amount)) || (item.totalPrice || Math.floor(item.price * item.amount))
        acc += price
        return acc
      }, 0)
      return price + delivery
    },
    getDate (data) {
      let date = ''
      if (data) {
        date = this.$moment(data).format('MM.DD.YYYY HH:MM')
      } else {
        date = this.$moment().format('MM.DD.YYYY HH:MM')
      }
      return date
    }
  },
  head () {
    return {
      title: 'История заказов',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'История заказов пользователя супермаркета Ayanmarket'
        }
      ],
      link: [{ rel: 'canonical', href: `https://ayanmarket.kz${this.$route.path}` }]
    }
  }
}
</script>
  <style lang="scss" scoped>
  @import "./style.scss";
  </style>
