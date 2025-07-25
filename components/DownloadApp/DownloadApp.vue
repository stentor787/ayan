<template>
  <v-dialog v-model="showDownloadApp" content-class="dialog-fullscreen">
    <v-card class="card-fullscreen">
      <div class="dialog-header">
        <v-icon class="justify-end pt-2 pr-2 custom-btn" color="white" @click="$emit('close-download-app', false)">
          mdi-close
        </v-icon>
        <div class="pt-10 dialog-header_title">
          <h1>С приложением еще удобней!</h1>
        </div>
      </div>
      <div class="dialog-img">
        <img
          src="@/assets/img/download.png"
          alt="apple"
        >
      </div>
      <v-card-actions class="dialog-footer">
        <div class="dialog-footer_bg">
          <v-btn class="dialog-footer_btn white--text" color="#5D4BD0" @click="getDownloadLink">
            Скачать приложение
          </v-btn>
          <v-btn class="dialog-header_close" @click="$emit('close-download-app', false)">
            Продолжить на сайте
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DownloadApp',
  props: {
    showDownloadApp: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getDownloadLink () {
      window.open('/page/app/redirect/')
    }
  }
}
</script>

<style lang="scss">
@import "./style";
</style>
