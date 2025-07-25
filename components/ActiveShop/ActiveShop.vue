<template>
  <div class="shop">
    <img v-if="GEO.activeShop.info.image" class="shop_img" :src="GEO.activeShop.info.image.fileUrlMedium">
    <span>{{ GEO.activeShop.info.departmentName }}</span>
    <v-tooltip
      v-if="isDesktop"
      right
      color="#e9e9e9"
      content-class="custom-tooltip_shop"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-information-slab-circle-outline</v-icon>
        </v-btn>
      </template>
      <span class="shop_tooltip">
        <span>Адрес: {{ GEO.activeShop.info.departmentAddress }}</span>
        <span>E-mail: {{ GEO.activeShop.info.emailFeedback }}</span>
      </span>
    </v-tooltip>
    <v-menu
      v-else
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-information-slab-circle-outline</v-icon>
        </v-btn>
      </template>
      <span class="shop_tooltip">
        <span>Адрес: {{ GEO.activeShop.info.departmentAddress }}</span>
        <span>E-mail: {{ GEO.activeShop.info.emailFeedback }}</span>
      </span>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ActiveShop',
  props: {
    categoryCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isDesktop: true
    }
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE'
    })
  },
  mounted () {
    if (this.$vuetify.breakpoint.xsOnly) {
      this.isDesktop = false
    }
  }
}
</script>

<style lang="scss">
.shop {
  background-color: #F5F5FA;
  border-radius: 10px;
  padding: 10px 30px;
  display: flex;
  align-items: center;
  gap: 10px;

  @media screen and (max-width: 800px) {
    height: 74px;
    margin: 0px 10px;
    justify-content: space-between;
  }

  &_tooltip {
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 800px) {
      background-color: #9696F5 !important;
      border-radius: 5px !important;
      padding: 10px;
      color: white;
  }
  }

  &_img {
    height: 80px;
    width: 80px;

    @media screen and (max-width: 800px) {
      height: 50px;
      width: 50px;
    }
  }
}
</style>
