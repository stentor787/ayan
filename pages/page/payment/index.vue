<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container>
    <div class="static_page" v-html="STATIC.content" />
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  async fetch ({ store }) {
    await store.dispatch('Static/GET_PAGE', { payload: 'Oplata' })
  },
  computed: {
    ...mapGetters({
      STATIC: 'Static/STATE'
    })
  },
  watch: {
    '$i18n.locale': function () {
      this.GET_PAGE({ payload: 'Oplata' })
    }
  },
  async created () {
    await this.GET_PAGE({ payload: 'Oplata' })
  },
  methods: {
    ...mapActions({
      GET_PAGE: 'Static/GET_PAGE'
    })
  },
  head () {
    return {
      title: 'Условия оплаты | Cервис доставки продуктов и товаров для дома Ayanmarket',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
           'Подробная информация обо всех условиях оплаты: наличному и безналичному расчету - Продукты питания и товары с доставкой на дом Ayanmarket'
        }
      ],
      link: [{ rel: 'canonical', href: `https://ayanmarket.kz${this.$route.path}` }]
    }
  }
}
</script>
<style lang="scss">
  @import '../staticPagesStyle/staticPagesStyle.scss';
</style>
