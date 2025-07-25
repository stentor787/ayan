<template>
  <v-dialog
    v-model="newAddressDialog"
    max-width="550px"
    persistent
    :fullscreen="$vuetify.breakpoint.xsOnly"
    @click:outside="
      $emit('cancel-dialog', $event);
    "
  >
    <v-card style="background-color:#f7f7f7">
      <v-card-title
        class="headline d-flex align-center flex-column city_header"
        style="color:#F44336"
      >
        {{ $i18n.t("changeAdress.attention") }}
      </v-card-title>
      <v-card-text>
        <div>{{ $i18n.t("changeAdress.change") }}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <!-- <v-btn
          color="red darken-1"
          text
          @click="
            $emit('save-user-address', $event);
          "
        >
          {{ $i18n.t("changeAdress.changeAdress") }}
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          @click="
            $emit('cancel-dialog')
          "
        >
          {{ $i18n.t("changeAdress.cancel") }}
        </v-btn> -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    newAddressDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  watch: {
    newAddressDialog (val) {
      if (val) {
        const id = setTimeout(() => {
          this.$emit('save-user-address')
          clearTimeout(id)
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
