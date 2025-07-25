<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="orders_th">
              {{ $i18n.t("orderItem.order") }} №
            </th>
            <th class="orders_th">
              {{ $i18n.t("orderItem.orderDate") }}
            </th>
            <th class="orders_th">
              {{ $i18n.t("orderItem.orderStatus") }}
            </th>
            <th class="orders_th">
              Статус оплаты
            </th>
            <th class="orders_th">
              {{ $i18n.t("orderItem.rating") }}
            </th>
            <th class="orders_th">
              {{ $i18n.t("orderItem.compound") }}
            </th>
            <th class="orders_th">
              {{ $i18n.t("orderItem.orderSum") }}
            </th>
            <th class="orders_th">
              {{ $i18n.t("personalOffice.onlinePay") }}
            </th>
            <th class="orders_th">
              {{ $i18n.t("personalOffice.cancel") }}
            </th>
          </tr>
        </thead>
        <tbody v-if="orders.length">
          <tr v-for="item in orders" :key="item.orderId">
            <td class="orders_item">
              {{ item.orderId }}
            </td>
            <td class="orders_item">
              {{ getData(item.createdAt) }}
            </td>
            <td class="orders_item">
              <span
                class="orders_span"
                :style="'background-color: ' + statusColor(item.status.id)"
              >
                {{ $i18n.locale === 'ru' ? item.status.name : item.status.nameKz }}
              </span>
            </td>
            <td class="orders_item">
              <span
                class="orders_span"
                :style="'background-color: ' + statusColor(item.paymentStatus.id)"
              >
                {{ item.paymentStatus.name }}
              </span>
            </td>
            <td class="orders_item">
              <v-rating
                :length="5"
                :size="24"
                readonly
                :value="item.orderReview ? item.orderReview.reviewRating.value : null"
                background-color="#050505"
                color="#BDFF03 lighten-3"
                class="rating"
              />
            </td>
            <td class="orders_item">
              <v-btn icon color="#503CC3" @click="$emit('moreinfo', item)">
                <v-icon>
                  mdi-basket
                </v-icon>
              </v-btn>
            </td>
            <td
              class="orders_item bold"
            >
              {{ item.sumFinal }} тг.
            </td>
            <td class="orders_item">
              <v-btn
                v-if="item.paymentTypeId === 5 || item.paymentUrl"
                icon
                color="#503CC3"
                @click="payOrder(item.paymentUrl)"
              >
                <v-icon>
                  mdi-credit-card-outline
                </v-icon>
              </v-btn>
            </td>
            <td class="orders_item">
              <v-btn
                icon
                color="#503CC3"
                :disabled="item.status.id === 8 || item.status.id === 9"
                @click="openCancelModal(item.orderId)"
              >
                <v-icon>
                  mdi-camera-timer
                </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <CancelModal :show.sync="showCancel" :order="curId" />
  </div>
</template>
<script>
import CancelModal from './Modals/CancelModal'
export default {
  components: {
    CancelModal
  },
  props: {
    orders: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      curId: 0,
      showCancel: false
    }
  },
  methods: {
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
    },
    // удобочитаемая дата
    getData (str) {
      return str.substring(0, 10).replaceAll('-', '.')
    },
    openCancelModal (orderId) {
      this.curId = orderId
      this.showCancel = true
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
    }
  }
}
</script>
<style lang="scss">
@import "./Order.scss";
</style>
