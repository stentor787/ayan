<template>
  <v-container fluid class="shop-group">
    <!-- Центрирование контента через Vuetify grid -->
    <v-row justify="center">
      <v-col cols="12" md="10">
        <div class="shop-group-inner">
          <div class="shop-group-header">
            <h2>{{ group.name }}</h2>
          </div>
          <!-- Сетка карточек магазина -->
          <v-row class="shop-group-items" dense>
            <v-col
              v-for="shop in group.children"
              :key="shop.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <div class="shop-item" @click="goToShop(shop)">
                <!-- Используем aspect-ratio для сохранения пропорций (2:1) -->
                <v-img
                  :src="shop.img || 'placeholder.png'"
                  aspect-ratio="2"
                  class="shop-image"
                ></v-img>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "ShopGroup",
  props: {
    group: {
      type: Object,
      required: true
    },
    shopRoute: {
      type: String,
      default: "shop"
    }
  },
  computed: {
    ...mapGetters({
      GEO: "GEO/STATE"
    })
  },
  methods: {
    ...mapActions({
      SET_ACTIVE_SHOP: "GEO/SET_ACTIVE_SHOP",
      GET_HOVER_PANEL_CATEGORIES: "Category/GET_HOVER_PANEL_CATEGORIES"
    }),
    async goToShop(shop) {
      if (this.GEO.activeShop.id === shop.id) {
        this.$router.push(`/${this.GEO.activeShop.route}/collection/vse-categoryy-0/`)
        return
      }
      const route = `shop-${this.$translit(shop.name)}`
      const newShop = { id: shop.id, route }
      await this.SET_ACTIVE_SHOP(newShop)
      await this.GET_HOVER_PANEL_CATEGORIES([shop.id])
      this.$router.push(`/${route}/collection/vse-categoryy-0/`)
    }
  }
}
</script>

<style scoped>
.shop-group {
  padding: 20px;
}

/* Центрирование контента */
.shop-group-inner {
  width: 100%;
  max-width: 1220px;
  margin: 0 auto;
}

/* Заголовок группы */
.shop-group-header {
  margin-bottom: 20px;
  text-align: left;
}

/* Сетка карточек – стилизация отступов задается через Vuetify */
.shop-group-items {
  /* Дополнительных настроек может не потребоваться */
}

/* Карточка магазина */
.shop-item {
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  text-align: center;
}
.shop-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Название магазина */
.shop-title {
  margin-top: 0.5rem;
  font-weight: 500;
  font-size: 1.1rem;
}

/* При необходимости можно добавить медиазапросы для корректировки шрифтов или отступов */
@media (max-width: 600px) {
  .shop-group-header h2 {
    font-size: 1.3rem;
  }
}
</style>
