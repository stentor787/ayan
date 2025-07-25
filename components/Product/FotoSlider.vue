<template>
  <v-dialog
    v-model="modal"
    persistent
    width="85%"
    @click:outside="$emit('update:modal', false)"
    @keydown.esc="$emit('update:modal', false)"
  >
    <v-card>
      <v-carousel
        show-arrows-on-hover
        :show-arrows="foto.length !== 1"
        hide-delimiters
      >
        <v-carousel-item v-for="(slide, index) in foto" :key="index" eager>
          <div style="display: flex; justify-content: center; height: 100%;">
            <img :src="getImageSource(slide)" :alt="getImageAlt(slide)" style="height: 100%;">
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'FotoSlider',
  props: {
    foto: {
      type: Array,
      default: () => []
    },
    modal: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getImageSource (slide) {
      if (typeof slide === 'string') {
        // Если slide строка возвращаем её как URL
        return slide
      } else if (typeof slide === 'object' && slide.fileUrl) {
        // Если slide объект и содержит свойство fileUrl возвращаем его
        return slide.fileUrl
      }
      // Если не удалось определить тип возвращаем пустую строку или другое значение по умолчанию
      return ''
    },
    getImageAlt (slide) {
      if (typeof slide === 'object' && slide.alt) {
        // Если slide - объект и содержит свойство alt возвращаем его
        return slide.alt
      }
      // Если не удалось определить тип или нет свойства alt возвращаем пустую строку или другое значение по умолчанию
      return ''
    }
  }
}
</script>
