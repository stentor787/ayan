<template>
  <div>
    <v-container v-show="value" class="pa-0">
      <!-- (Опционально) DEPARTMENT_CATEGORIES -->
      <ul v-show="!value">
        <li
          v-for="item in DEPARTMENT_CATEGORIES"
          :key="item.id"
        >
          <a :href="`/shop/collection/${$translit(item.name)}-${item.id}`">
            {{ $i18n.locale === "kz" ? item.nameKz : item.name }}
          </a>
        </li>
      </ul>

      <!-- Затемнение фона -->
      <div class="hover_panel_bg" @click="closeMain" />

      <!-- Главное меню -->
      <div
        v-if="value"
        class="hover_panel"
        @mouseleave="resetData"
      >
        <div class="hover_panel_body">
          <!-- Первый столбец: MAIN_CATEGORIES -->
          <v-list class="hover_panel_main">
            <v-list-item-group>
              <v-list-item
                v-for="item in MAIN_CATEGORIES"
                :key="item.id"
                style="justify-content: space-between"
                @mouseover="getSecond(item)"
                @click="handleItemClick(item)"
              >
                <!-- Если это обычная категория / группа / корень 'shops' -->
                <!-- мы используем nuxt-link. Если это филиал (isShop), убираем ссылку. -->
                <template v-if="!item.isShop">
                  <nuxt-link
                    :to="makeLink(item)"
                    style="display: flex; color: inherit; width: 100%;"
                  >
                    <v-list-item-avatar horizontal>
                      <v-img
                        v-if="item.fileUrlSmall"
                        :src="item.fileUrlSmall"
                        eager
                        contain
                        max-height="32px"
                        max-width="32px"
                        class="ml-2"
                      />
                    </v-list-item-avatar>
                    <v-list-item-title class="hover_panel_body_title">
                      {{ $i18n.locale === "kz" ? item.nameKz || item.name : item.name }}
                    </v-list-item-title>
                    <v-list-item-action>
                      <v-icon
                        v-if="secondData === item.children && secondData.length"
                        color="#503CC3"
                      >
                        mdi-chevron-right
                      </v-icon>
                    </v-list-item-action>
                  </nuxt-link>
                </template>
                <!-- Если item.isShop === true, просто div, а переход сделаем в handleItemClick -->
                <template v-else>
                  <div style="display: flex; color: inherit; width: 100%;">
                    <v-list-item-avatar horizontal>
                      <v-img
                        v-if="item.fileUrlSmall"
                        :src="item.fileUrlSmall"
                        eager
                        contain
                        max-height="32px"
                        max-width="32px"
                        class="ml-2"
                      />
                    </v-list-item-avatar>
                    <v-list-item-title class="hover_panel_body_title">
                      {{ $i18n.locale === "kz" ? item.nameKz || item.name : item.name }}
                    </v-list-item-title>
                    <v-list-item-action>
                      <v-icon
                        v-if="secondData === item.children && secondData.length"
                        color="#503CC3"
                      >
                        mdi-chevron-right
                      </v-icon>
                    </v-list-item-action>
                  </div>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <!-- Второй столбец -->
          <v-list v-show="secondData.length" class="hover_panel_second">
            <v-list-item-group>
              <v-list-item
                v-for="item in secondData"
                :key="item.id"
                @mouseover="getThird(item)"
                @click="handleItemClick(item)"
              >
                <template v-if="!item.isShop">
                  <nuxt-link
                    :to="makeLink(item)"
                    style="display: flex; color: inherit; width: 100%;"
                  >
                    <v-list-item-avatar horizontal>
                      <v-img
                        v-if="item.fileUrlSmall"
                        :src="item.fileUrlSmall"
                        eager
                        contain
                        max-height="32px"
                        max-width="32px"
                        class="ml-2"
                      />
                    </v-list-item-avatar>
                    <v-list-item-title class="hover_panel_body_title">
                      {{ $i18n.locale === "kz" ? item.nameKz || item.name : item.name }}
                    </v-list-item-title>
                    <v-list-item-action>
                      <v-icon
                        v-if="thirdData === item.children && thirdData.length"
                        color="#503CC3"
                      >
                        mdi-chevron-right
                      </v-icon>
                    </v-list-item-action>
                  </nuxt-link>
                </template>
                <template v-else>
                  <div style="display: flex; color: inherit; width: 100%;">
                    <v-list-item-avatar horizontal>
                      <v-img
                        v-if="item.fileUrlSmall"
                        :src="item.fileUrlSmall"
                        eager
                        contain
                        max-height="32px"
                        max-width="32px"
                        class="ml-2"
                      />
                    </v-list-item-avatar>
                    <v-list-item-title class="hover_panel_body_title">
                      {{ $i18n.locale === "kz" ? item.nameKz || item.name : item.name }}
                    </v-list-item-title>
                    <v-list-item-action>
                      <v-icon
                        v-if="thirdData === item.children && thirdData.length"
                        color="#503CC3"
                      >
                        mdi-chevron-right
                      </v-icon>
                    </v-list-item-action>
                  </div>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <!-- Третий столбец -->
          <v-list v-show="thirdData.length" class="hover_panel_third">
            <v-list-item-group>
              <v-list-item
                v-for="item in thirdData"
                :key="item.id"
                @mouseover="getFourth(item)"
                @click="handleItemClick(item)"
              >
                <template v-if="!item.isShop">
                  <nuxt-link
                    :to="makeLink(item)"
                    style="display: flex; color: inherit; width: 100%;"
                  >
                    <v-list-item-avatar horizontal>
                      <v-img
                        v-if="item.fileUrlSmall"
                        :src="item.fileUrlSmall"
                        eager
                        contain
                        max-height="32px"
                        max-width="32px"
                        class="ml-2"
                      />
                    </v-list-item-avatar>
                    <v-list-item-title class="hover_panel_body_title">
                      {{ $i18n.locale === "kz" ? item.nameKz || item.name : item.name }}
                    </v-list-item-title>
                    <v-list-item-action>
                      <v-icon
                        v-if="fourthData === item.children && fourthData.length"
                        color="#503CC3"
                      >
                        mdi-chevron-right
                      </v-icon>
                    </v-list-item-action>
                  </nuxt-link>
                </template>
                <template v-else>
                  <div style="display: flex; color: inherit; width: 100%;">
                    <v-list-item-avatar horizontal>
                      <v-img
                        v-if="item.fileUrlSmall"
                        :src="item.fileUrlSmall"
                        eager
                        contain
                        max-height="32px"
                        max-width="32px"
                        class="ml-2"
                      />
                    </v-list-item-avatar>
                    <v-list-item-title class="hover_panel_body_title">
                      {{ $i18n.locale === "kz" ? item.nameKz || item.name : item.name }}
                    </v-list-item-title>
                    <v-list-item-action>
                      <v-icon
                        v-if="fourthData === item.children && fourthData.length"
                        color="#503CC3"
                      >
                        mdi-chevron-right
                      </v-icon>
                    </v-list-item-action>
                  </div>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <!-- Четвёртый столбец -->
          <v-list v-show="fourthData.length" class="hover_panel_fourth">
            <v-list-item-group>
              <v-list-item
                v-for="item in fourthData"
                :key="item.id"
                @click="handleItemClick(item)"
              >
                <template v-if="!item.isShop">
                  <nuxt-link
                    :to="makeLink(item)"
                    style="display: flex; color: inherit; width: 100%;"
                  >
                    <v-list-item-title class="hover_panel_body_title">
                      {{ $i18n.locale === "kz" ? item.nameKz || item.name : item.name }}
                    </v-list-item-title>
                  </nuxt-link>
                </template>
                <template v-else>
                  <div style="display: flex; color: inherit; width: 100%;">
                    <v-list-item-title class="hover_panel_body_title">
                      {{ $i18n.locale === "kz" ? item.nameKz || item.name : item.name }}
                    </v-list-item-title>
                  </div>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { buildShopsItem } from '@/utils/buildShops'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      secondData: [],
      thirdData: [],
      fourthData: []
    }
  },
  computed: {
    ...mapGetters({
      CATALOG_CATEGORIES: 'Category/HOVER_PANEL_CATEGORIES',
      GEO: 'GEO/STATE',
      DEPARTMENT_CATEGORIES: 'Category/DEPARTMENT_CATEGORIES',
      PERSONAL: 'Personal/STATE'
    }),
    MAIN_CATEGORIES() {
      // Создаём «корень» магазинов
      const shopsItem = buildShopsItem(this.GEO.info.depEntities)
      return [shopsItem, ...this.CATALOG_CATEGORIES]
    }
  },
  watch: {
    isOpen(val) {
      if (!val) {
        this.resetData()
      }
    }
  },
  methods: {
    ...mapActions({
      SET_ACTIVE_SHOP: 'GEO/SET_ACTIVE_SHOP',
      GET_HOVER_PANEL_CATEGORIES: 'Category/GET_HOVER_PANEL_CATEGORIES'
    }),
    closeMain() {
      this.$eventBus.$emit('leftMainStatus', false)
      document.body.style.overflow = 'initial'
    },
    // Главное действие при клике
    async handleItemClick(item) {
      // Если это конкретный филиал
      if (item.isShop) {
        // Закрываем панель
        this.closeMain()
        // Активируем филиал
        await this.activateShop(item)
      } else {
        // Иначе — «старая» логика: просто закрываем меню
        this.closeMain()
      }
    },
    // Активируем филиал (логика как на странице товара)
    async activateShop(item) {
      // Если уже активен
      if (this.GEO.activeShop.id === item.id) {
        this.$router.push(`/${this.GEO.activeShop.route}/collection/vse-categoryy-0/`)
        return
      }
      const route = `shop-${this.$translit(item.name)}`
      const newShop = {
        id: item.id,
        route
      }
      // Устанавливаем активный филиал
      await this.SET_ACTIVE_SHOP(newShop)
      // Подгружаем категории
      await this.GET_HOVER_PANEL_CATEGORIES([item.id])
      // Переходим на страницу
      this.$router.push(`/${route}/collection/vse-categoryy-0/`)
    },
    getSecond(item) {
      this.thirdData = []
      this.fourthData = []
      this.secondData = item.children || []
    },
    getThird(item) {
      this.fourthData = []
      this.thirdData = item.children || []
    },
    getFourth(item) {
      this.fourthData = item.children || []
    },
    resetData() {
      this.secondData = []
      this.thirdData = []
      this.fourthData = []
    },
    // Формирование ссылки (для категорий / групп)
    makeLink(item) {
      if (item.id === 'shops') {
        return `/${this.GEO.activeShop.route}/collection/group-all`
      }
      if (item.isShopGroup) {
        return `/${this.GEO.activeShop.route}/collection/group-${item.id}`
      }
      if (item.isShop) {
        // Для филиала делаем «заглушку» (у нас будет programmatic navigate)
        return ''
      }
      return `/${this.GEO.activeShop.route}/collection/${this.$translit(item.name)}-${item.id}`
    }
  }
}
</script>


<style lang="scss">
@import "./style";
</style>
