<template>
  <v-container fluid class="shop-groups">
    <!-- Центрирование контента через Vuetify grid -->
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- Перебираем группы -->
        <div v-for="group in groups" :key="group.id" class="group-row">
          <v-row class="group-header" align="center" justify="space-between">
            <v-col cols="12" sm="auto">
              <h2>{{ group.name }}</h2>
            </v-col>
            <v-col cols="12" sm="auto" class="text-sm-right">
              <v-btn
                class="watch-all-btn"
                text
                color="primary"
                @click="goToGroup(group)"
              >
                Смотреть все
              </v-btn>
            </v-col>
          </v-row>

          <!-- Сетка карточек филиалов -->
          <v-row class="shops-inline" dense>
            <v-col
              v-for="shop in group.children.slice(0, 4)"
              :key="shop.id"
              xs="12"
              sm="6"
              md="3"
            >
              <div class="shop-item" @click="activateShop(shop)">
                <!-- Сохранение пропорций с aspect-ratio (соотношение ~1.68) -->
                <v-img
                  :src="shop.img || 'placeholder.png'"
                  aspect-ratio="1.68"
                  class="shop-image"
                />
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
  name: 'ShopGroups',
  props: {
    groups: {
      type: Array,
      default: () => []
    },
    shopRoute: {
      type: String,
      default: 'shop'
    }
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE'
    })
  },
  methods: {
    ...mapActions({
      SET_ACTIVE_SHOP: 'GEO/SET_ACTIVE_SHOP',
      GET_HOVER_PANEL_CATEGORIES: 'Category/GET_HOVER_PANEL_CATEGORIES'
    }),
    goToGroup(group) {
      this.$router.push(`/${this.shopRoute}/collection/group-${group.id}`)
    },
    async activateShop(shop) {
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
.shop-groups {
  padding: 20px;
}

/* Группа отделена от краёв экрана через grid-систему Vuetify */
.group-row {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

/* Заголовок группы и кнопка */
.group-header {
  margin-bottom: 10px;
}

.watch-all-btn {
  border: 1px solid #9696f5;
  border-radius: 20px;
  color: black !important;
  transition: background-color 0.3s, color 0.3s;
}
 

/* Карточка филиала */
.shop-item {
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  text-align: center;
}
.shop-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Дополнительные медиазапросы для экранов менее 600px */
@media (max-width: 600px) {
  /* Заставляем строку карточек стать колонкой */
  .shops-inline {
    flex-direction: column !important;
  }
  /* Гарантируем, что каждая колонка занимает 100% ширины */
  .shops-inline > .v-col {
    max-width: 100% !important;
    flex: 0 0 100% !important;
  }
  .group-header h2 {
    font-size: 1.2rem;
  }
}
</style>
