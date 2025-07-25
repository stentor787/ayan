<template>
  <main
    class="container-app"
  >
    <section class="container-app_app">
      <div class="container-app_images">
        <div class="container-app_top-text">
          <div class="container-app_top-block">
            <p>{{ $i18n.t("kak-zakazat.comfort") }}</p>
            <div class="container-app_title">
              <img src="@/assets/img/ayanMarket.png" alt="ayanMarket" class="container-app_app_img1">
              <img src="@/assets/img/apple_google.png" alt="apple_google" class="container-app_app_img2">
            </div>
          </div>
          <p class="container-app_bot-text">
            {{ $i18n.t("kak-zakazat.scan") }}
          </p>
        </div>
        <img
          src="@/assets/img/phone.png"
          alt="phone"
          class="container-app_img"
        >
      </div>
    </section>
  </main>
</template>
<script>
export default {
  head () {
    return {
      title: 'Скачайте мобильное приложение',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
           'Скачайте мобильное приложение Ayanmarket для IOS или Android'
        }
      ],
      link: [{ rel: 'canonical', href: `https://ayanmarket.kz${this.$route.path}` }]
    }
  }
}

</script>
<style lang="scss" scoped>
  @import './style.scss';
</style>
