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
    await store.dispatch('Static/GET_PAGE', { payload: 'Vacancy' })
  },
  computed: {
    ...mapGetters({
      STATIC: 'Static/STATE'
    })
  },
  watch: {
    '$i18n.locale': function () {
      this.GET_PAGE({ payload: 'Vacancy' })
    }
  },
  async created () {
    await this.GET_PAGE({ payload: 'Vacancy' })
  },
  methods: {
    ...mapActions({
      GET_PAGE: 'Static/GET_PAGE'
    })
  },
  head () {
    return {
      title: 'Вакансии | Ayan',
      meta: [
        { hid: 'description', name: 'description', content: 'Ваканcии на ayanmarket.kz' }
      ],
      link: [{ rel: 'canonical', href: `https://ayanmarket.kz${this.$route.path}` }]
    }
  }
}
</script>
<style lang="scss">
  .vacancy__title{
    color: #503CC3;
    font-size: 33px;
    font-weight: 600;
    margin-bottom: 30px;
    @media screen and (max-width: 960px) {
      font-size: 30px;
      margin-bottom: 25px;
    }
    @media screen and (max-width: 375px) {
      font-size: 20px;
      margin-bottom: 15px;
    }
  }
  .vacancy__list + .vacancy__list{
    margin-top: 25px;
    @media screen and (max-width: 960px) {
      margin-top: 15px;
    }
    @media screen and (max-width: 375px) {
      margin-top: 10px;
    }
  }
  .vacancy__list_item{
    &::before{
      content: '';
      position: absolute;
      right: calc(100% + 5px);
      top: calc(50% - 5px);
      width: 8px;
      height: 8px;
      border: 2px solid #503CC3;
      border-radius: 50%;
      background-color: #42454A;
    }
    position: relative;
    color: #42454A;
    font-weight: 600;
    font-size: 20px;
    @media screen and (max-width: 960px) {
      font-size: 16px;
    }
    @media screen and (max-width: 375px) {
      font-size: 14px;
    }
  }
  .vacancy__phone_wrapper{
     margin-top: 30px;
    @media screen and (max-width: 960px) {
      margin-top: 25px;
    }
    @media screen and (max-width: 375px) {
      margin-top: 15px;
    }
  }
  .vacancy__phone_item{
    color: #503CC3;
    font-size: 33px;
    font-weight: 800;
    @media screen and (max-width: 960px) {
      font-size: 30px;
    }
    @media screen and (max-width: 375px) {
      font-size: 20px;
    }
  }
  .vacancy__curier, .vacancy__picker{
    margin-bottom: 60px;
    @media screen and (max-width: 960px) {
      margin-bottom: 40px;
    }
    @media screen and (max-width: 375px) {
      margin-bottom: 30px;
    }
  }
  .vacancy__curier{
    .vacancy__photo{
      background-image: url('~@/assets/img/vacancy/second.png');
    }
  }
  .vacancy__picker{
    .vacancy__photo{
      background-image: url('~@/assets/img/vacancy/first.jpg');
    }
  }
  .vacancy__photo{
    border-radius: 50%;
    width: 100%;
    padding-top: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .vacancy__phone_logo{
    border-radius: 50%;
    padding: 10px;
    background-color: #503CC3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vacancy__info_padding{
    padding-left: 56px;
    @media screen and (max-width: 600px) {
      padding-left: 0;
    }
  }
  .vacancy_body {
    @media screen and (max-width: 600px) {
      padding-left: 8px;
      padding-right: 8px;
    }
  }
  .title_block {
    width: 100%;
    height: 490px;
    display: flex;
    justify-content: center;
    position: relative;
    @media screen and (max-width: 600px) {
      height: 200px;
    }
  }
  .title_bg {
    background-image: url("~@/assets/img/vacancy/title.jpg");
    width: 1140px;
    height: 490px;
    background-size: cover;
    border-radius: 6px;
    @media screen and (max-width: 600px) {
      height: 200px;
      border-radius: 6px;
    }
  }
  .title_text {
    color: white;
    background: rgb(78, 155, 228);
    background: linear-gradient(90deg, rgb(163, 122, 209) 0%, rgb(154, 136, 235) 27%, rgba(255,255,255,0) 100%);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    padding-left: 62px;
    width: 850px;
    height: max-content;
    max-height: 250px;
    padding: 50px 40px;
    font-weight: 800;
    flex-direction: column;
    position: absolute;
    left: 0;
    bottom: 30px;
    @media screen and (max-width: 600px) {
      bottom: 0px;
      width: 300px;
      padding: 16px 20px;
    }
  }
  .title_text__big {
    font-size: 38px;
    @media screen and (max-width: 600px) {
      font-size: 14px;
    }
    @media screen and (max-width: 400px) {
      font-size: 12px;
    }
  }
  .title_text__small {
    font-size: 22px;
    @media screen and (max-width: 600px) {
      font-size: 10px;
    }
    @media screen and (max-width: 400px) {
      font-size: 8px;
    }
  }
  .picker_bg {
    background-image: url("~@/assets/img/vacancy/first.jpg");
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    @media screen and (max-width: 600px) {
      height: 180px;
      width: 100%;
    }
    @media screen and (max-width: 400px) {
      height: 150px;
    }
  }
  .curier_bg {
    background-image: url("~@/assets/img/vacancy/second.png");
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    @media screen and (max-width: 600px) {
      height: 180px;
      width: 100%;
    }
    @media screen and (max-width: 400px) {
      height: 150px;
    }
  }
  .dis-jobs-block {
    display: flex;
    margin-top: 80px;
    margin-bottom: 80px;
    margin-right: 16px;
    @media screen and (max-width: 600px) {
      margin-top: 30px;
      margin-bottom: 30px;
      padding-bottom: 40px;
      position: relative;
      margin-right: 0;
    }
  }
  .dis-jobs-left {
    font-size: 26px;
    font-weight: 800;
    color: #503CC3;
    margin-top: 100px;
    &--sub {
      font-size: 16px;
      font-weight: 800;
      color: #503CC3;
      margin-bottom: 20px;
      @media screen and (max-width: 600px) {
        font-size: 10px;
      }
      @media screen and (max-width: 400px) {
        margin-bottom: 0 !important;
      }
    }
    @media screen and (max-width: 600px) {
      margin-top: 10px;
      font-size: 15px;
    }
  }
  .dis-jobs-left a {
    display: block;
    text-decoration: none;
    background-color: #503CC3;
    color: white !important;
    padding: 18px 48px;
    font-size: 24px;
    border-radius: 20px;
    margin-top: 70px;
    @media screen and (max-width: 600px) {
      font-size: 12px;
      padding: 5px;
      position: absolute;
      left: 20px;
      width: 90%;
      text-align: center;
      bottom: 0;
    }
  }
</style>
