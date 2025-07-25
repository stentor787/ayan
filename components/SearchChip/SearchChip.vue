<template>
  <v-container class="text-left chip_container">
    <div v-if="!type" class="scrollmenu">
      <div v-for="item in value" :key="item.id" class="scrollmenu--block active-block" @click="get_category(item)">
        {{ item.name }}
      </div>
    </div>
    <div v-else>
      <v-chip-group v-model="keyName" class="chip_scroller" mandatory column>
        <v-chip
          v-for="item in value"
          :key="item.id"
          label
          class="chip-block active-block success"
          @click="get_category(item)"
        >
          {{ item.name }}
        </v-chip>
      </v-chip-group>
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    type: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      keyName: 0
    }
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE'
    })
  },
  methods: {
    get_category (data) { // [0:id]
      if (data.keyName != null) {
        this.$router.push(`/${this.GEO.activeShop.route}/collection/` + data.id) // data[0]
      }
    }
  }
}
</script>
<style lang="scss">
    @import "./style";
</style>
