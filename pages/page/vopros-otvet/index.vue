<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container>
    <v-simple-table />
    <div class="static_page" v-html="STATIC.content" />
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  async fetch ({ store }) {
    await store.dispatch('Static/GET_PAGE', { payload: 'vopros-otvet' })
  },
  computed: {
    ...mapGetters({
      STATIC: 'Static/STATE'
    })
  },
  watch: {
    '$i18n.locale': function () {
      this.GET_PAGE({ payload: 'vopros-otvet' })
    }
  },
  methods: {
    ...mapActions({
      GET_PAGE: 'Static/GET_PAGE'
    })
  },
  head () {
    return {
      title: 'Вопрос и ответ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'На этой странице Вы найдете ответы на наиболее популярные вопросы, возникающие касательно работы интернет-магазина ayanmarket.kz'
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
