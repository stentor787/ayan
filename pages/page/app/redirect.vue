<template>
  <div>
    <h1>Подождите секундочку...</h1>
  </div>
</template>
<script>
export default {
  async mounted () {
    await this.getDownloadLink()
  },
  methods: {
    getDownloadLink () {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      if (/android/i.test(userAgent)) {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.ayan.ayanmarket'
      }
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        window.location.href = 'https://apps.apple.com/kz/app/%D0%B0%D1%8F%D0%BD-%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%82/id1538725176'
      }
    }
  },
  head: {
    title: 'Перенаправление | Ayan'
  }
}
</script>
