<template>
  <v-dialog
    v-model="show"
    max-width="550px"
    :content-class="$vuetify.breakpoint.xsOnly ? 'mobile' : ''"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    @click:outside="$emit('update:show', false)"
  >
    <v-card style="background-color:#f7f7f7">
      <v-card-title
        class="online-modal_header"
      >
        {{ $i18n.t("changeAdress.attention") }}
      </v-card-title>
      <v-card-text class="pb-0">
        <div class="online-modal_subtitle">
          {{ $i18n.t("onlinePay.online") }}
        </div>
        <p> {{ $i18n.t("onlinePay.payNow") }}</p>
        <p> {{ $i18n.t("onlinePay.ifNoPay") }}</p>
      </v-card-text>
      <v-card-actions class="online-modal_actions pt-0">
        <v-btn
          color="#503CC3"
          dark
          class="online-modal_btn"
          @click="$emit('update:show', false);"
        >
          {{ $i18n.t("cart.resume") }}
        </v-btn>
        <v-btn
          color="#00000060"
          text
          class="online-modal_btn"
          @click="$emit('update:show', false);"
        >
          {{ $i18n.t("onlinePay.choose") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'OnlinePayModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.online-modal{
    &_header{
        color:#ff1100;
        font-weight: 800;
    }
    &_actions{
        flex-direction: column;
        gap: 5px;
        justify-content: center !important;
        align-items: center;
        display: flex;
    }
    &_subtitle{
       font-weight: 800;
       color: black;
    }
    &_btn{
       text-transform: none;
    }
}
</style>
