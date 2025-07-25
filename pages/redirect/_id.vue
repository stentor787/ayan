<template>
  <div>Перенаправление...</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  async mounted () {
    const responce = await this.redirectLink(this.$route.params.id)
    window.location.href = responce.data.url
  },
  methods: {
    ...mapActions({
      redirectLink: 'Redirect/GET_LINK'
    })
  }
}
</script>
<style>

</style>
