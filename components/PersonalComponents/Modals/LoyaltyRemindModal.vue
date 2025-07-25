<template>
  <v-dialog
    v-model="show"
    width="423px"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    :content-class="$vuetify.breakpoint.xsOnly ? 'mobile' : ''"
    @click:outside="$emit('update:show', false)"
  >
    <v-card>
      <v-card-title class="pb-2">
        Клуб AyanMarket
        <v-spacer />
        <v-btn icon color="#503CC3" @click="$emit('update:show', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pb-0">
        {{ $i18n.t("personalOffice.reminder") }}
      </v-card-text>
      <v-card-actions class="pt-3 pb-3 justify-end">
        <v-btn class="mr-3 white--text" color="#503CC3" @click="$emit('registrate')">
          {{ $i18n.t("personalOffice.toCab") }}
        </v-btn>
        <v-btn class="mr-3 white--text" color="#503CC3" @click="$emit('update:show', false)">
          {{ $i18n.t("cart.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LoyaltyRemindModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>
