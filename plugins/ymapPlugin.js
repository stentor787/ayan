import Vue from 'vue'
import YmapPlugin from 'vue-yandex-maps'

const settings = {
  lang: 'ru_RU',
  version: '2.1'
}

Vue.use(YmapPlugin, settings)
