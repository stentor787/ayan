<template>
  <div class="block404 text-center">
    <div v-if="error.statusCode === 404" class="title_404 mt-8">
      404
    </div>
    <div v-else class="title_404 mt-8">
      Упс...
    </div>
    <h1 v-if="error.statusCode === 404">
      Страница не найдена
    </h1>
    <div v-if="error.statusCode === 404" class="mt-10">
      К сожалению такой страницы не существует.<br>
      Но не стоит огорчаться , Вы можете перейти<br> на главную страницу.
    </div>
    <div v-else class="mt-10">
      Произошла непредвиденная ошибка.<br>
      Но не стоит огорчаться , Вы можете перейти<br> на главную страницу.
    </div>
    <v-btn color="#5D4BD0" class="btn_404" @click="goToMain()">
      Перейти на главную
    </v-btn>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Error',
  layout: 'default',
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE'
    })
  },
  methods: {
    goToMain () {
      if (this.error.statusCode === 404 || this.error.statusCode === 400 || this.error.statusCode === 500) {
        this.$router.push('/')
      } else {
        // перезагружаем если произошла ошибка
        window.location.reload()
      }
    }
  },
  head () {
    return {
      title: 'Страница не найдена',
      link: [{ rel: 'canonical', href: `https://ayanmarket.kz${this.$route.fullPath}` }]
    }
  }
}
</script>
  <style lang="scss">

  .block404{
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    h1{
      font-size: 45px;
      font-weight: bold;
    }
  }
  .title_404 {
    display: inline-block;
    font-size: 150px;
    color: #5D4BD0;
    padding: 0 !important;
  }
  .btn_404{
    margin-top: 30px;
    border-radius: 4px;
    color: white !important;
  }
  </style>
