<template>
  <v-dialog
    v-model="timeAddressDialog"
    max-width="550px"
    persistent
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <v-card style="background-color:#f7f7f7">
      <v-card-title
        class="headline d-flex align-center flex-column city_header"
        style="color:#F44336"
      >
        {{ $i18n.t("adressDialog.atention") }}
      </v-card-title>
      <v-card-text>
        <div class="text-center subtitle-1">
          {{ $i18n.t("adressDialog.confirm") }} : "{{ GEO.info.address.street }}"
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red darken-1"
          text
          @click="$emit('change-address', $event);"
        >
          {{ $i18n.t("adressDialog.change") }}
        </v-btn>
        <v-btn
          color="#503CC3"
          text
          @click="$emit('save-current-address', $event);"
        >
          {{ $i18n.t("adressDialog.save") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    timeAddressDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE'
    })
  }
}
</script>
