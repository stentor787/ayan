<template>
  <div class="pa-2">
    <div class="dis-jobs-block mb-2">
      <div class="picker_bg" />
      <div class="ml-12 dis-jobs-left">
        Комплектовщик службы доставки
        <div class="dis-jobs-left--sub mt-5 mb-12">
          Основная задача персонального закупщика —<br>
          собрать корзину товаров, качественно упаковать и передать заказ курьеру.
        </div>
      </div>
    </div>
    <a class="dis-jobs-left-button" style="color:white" href="#top">Пройти обучение</a>
    <a name="top" />
    <div class="video-container">
      <iframe
        class="responsive-iframe"
        src="https://www.youtube.com/embed/1fsKmZ8BX9Q"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </div>
    <a class="dis-jobs-left-button" rel="nofollow" style="color:white" href="https://biz.oprosso.ru/q/E2QbCECT8fmHphJSP">Заполнить анкету</a>
  </div>
</template>
<script>
export default {
  head () {
    return {
      title: 'Ваканския комплектовщик | Ayan',
      meta: [
        { hid: 'description', name: 'description', content: 'Вакансия комплектовщик' }
      ],
      link: [{ rel: 'canonical', href: `https://ayanmarket.kz${this.$route.path}` }]
    }
  }
}
</script>
<style scoped lang="scss">
  .video-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    padding-top: 56.25%;
    border-radius: 50px;
  }
  .responsive-iframe {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
  .picker_bg {
    background-image: url("~@/assets/img/vacancy/first.jpg");
    width: 325px;
    height: 325px;
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
  }
  .dis-jobs-left {
    font-size: 26px;
    font-weight: 800;
    color: #503CC3;
    margin-top: 12%;
    &--sub {
      font-size: 16px;
      font-weight: 800;
      color: #503CC3;
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
  .dis-jobs-left-button {
    text-decoration: none;
    display: block;
    background-color: #503CC3;
    padding: 18px 48px;
    font-size: 24px;
    border-radius: 10px;
    width: 700px;
    text-align: center;
    margin: 50px auto;
    margin-bottom: 90px;
    @media screen and (max-width: 600px) {
      font-size: 12px;
      padding: 5px;
      left: 20px;
      width: 90%;
    }
  }
</style>
