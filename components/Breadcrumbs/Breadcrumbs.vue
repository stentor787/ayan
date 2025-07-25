<template>
  <div v-if="breadcrumbs.length && id !== 0" class="pl-3 breadcrumbs_mobile">
    <v-breadcrumbs class="breadcrumbs" :items="visibleBreadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
      <template v-slot:item="{ item }">
        <v-menu v-model="menuVisibles[item.text]" offset-y @click.stop="closeMenu(item)">
          <template v-slot:activator="{ on, attrs }">
            <span :class="isLastItem ? 'last' : ''" v-bind="attrs" @mouseenter="setMenuVisible(true, item); closeAllMenusExceptCurrent(item.text)" v-on="on">
              <NuxtLink
                no-prefetch
                custom
                tag="button"
                :disabled="item.disabled"
                :to="item.to"
              >
                <a :class="[{'v-breadcrumbs__item--disabled': item.disabled}, 'v-breadcrumbs__item']">
                  {{ item.text }}
                </a>
              </NuxtLink>
            </span>
          </template>
          <div @mouseleave="closeMenu(item)">
            <v-list v-if="item.children && item.children.length">
              <v-list-item v-for="(child, childIndex) in item.children" :key="childIndex" class="custom-list-item">
                <NuxtLink no-prefetch custom :to="child.to">
                  <a class="breadcrumbs_text">
                    {{ child.text }}
                  </a>
                </NuxtLink>
              </v-list-item>
            </v-list>
          </div>
        </v-menu>
      </template>
    </v-breadcrumbs>
    <v-icon v-if="this.$vuetify.breakpoint.xsOnly" small class=" pt-1">
      mdi-chevron-down
    </v-icon>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    id: {
      type: [String, Number],
      default: null
    },
    name: {
      type: [String],
      default: ''
    }
  },
  data () {
    return {
      breadcrumbs: [],
      menuVisibles: {},
      show: true
    }
  },
  computed: {
    ...mapGetters({
      CATEGORY: 'Category/AVAILABLE',
      CATALOG: 'Category/CATALOG_CATEGORIES',
      GEO: 'GEO/STATE'
    }),
    visibleBreadcrumbs () {
      if (this.$vuetify.breakpoint.xsOnly && this.breadcrumbs.length > 4) {
        return this.breadcrumbs.slice(-4)
      } else {
        return this.breadcrumbs
      }
    },
    isLastItem () {
      const lastItem = this.breadcrumbs[this.breadcrumbs.length - 1]
      return this.breadcrumbs.indexOf(lastItem) === this.breadcrumbs.indexOf(this.item)
    },
    value () {
      // если нет детей, то показывает детей родительской категории
      if (this.CATEGORY[this.id] && this.CATEGORY[this.id].children.length === 0) {
        if (this.CATEGORY[this.CATEGORY[this.id].parentId]) {
          return this.CATEGORY[this.CATEGORY[this.id].parentId].children
        }
      }
      // если есть то собственных детей
      return this.CATEGORY[this.id].children
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.breadcrumbs = []
      this.breadcrumbs_creator(this.id)
        .then(() => {
          this.breadcrumbs[this.breadcrumbs.length - 1].disabled = true
        })
    },
    CATALOG () {
      this.breadcrumbs_creator(this.id)
        .then(() => {
          this.breadcrumbs[this.breadcrumbs.length - 1].disabled = true
        })
    }
  },
  mounted () {
    if (this.id && this.CATALOG.length) {
      this.breadcrumbs_creator(this.id)
        .then(() => {
          this.breadcrumbs[this.breadcrumbs.length - 1].disabled = true
          this.generateBreadcrumbStructuredData()
        })
    }
  },
  methods: {
    ...mapActions({
      getGategory: 'Category/GET_GATEGORY_BY_ID'
    }),
    // Микроразметки
    generateBreadcrumbStructuredData () {
      const itemListElement = this.breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.text,
        item: `https://ayanmarket.kz${breadcrumb.to}`
      }))
      if (!itemListElement.length) {
        return
      }
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement
      }
      // если скрипта нет то создаем если есть то заменяем его данные
      const oldScript = document.getElementById('breadcrumbs')
      if (oldScript) {
        oldScript.innerHTML = JSON.stringify(structuredData)
      } else {
        const scriptTag = document.createElement('script')
        scriptTag.type = 'application/ld+json'
        scriptTag.id = 'breadcrumbs'
        scriptTag.innerHTML = JSON.stringify(structuredData)
        document.head.appendChild(scriptTag)
      }
    },
    openMenu () {
      this.$refs.menu.openMenu()
    },
    closeAllMenusExceptCurrent (currentItemText) {
      for (const itemText in this.menuVisibles) {
        if (itemText !== currentItemText) {
          this.$set(this.menuVisibles, itemText, false)
        }
      }
    },
    closeMenu (item) {
      this.$set(this.menuVisibles, item.text, false)
    },
    setMenuVisible (value, item) {
      this.$set(this.menuVisibles, item.text, value)
    },
    async breadcrumbs_creator (id, isRoot = true) {
      if (id == null) { return }

      if (id === 0) {
        this.breadcrumbs.unshift({
          text: 'Каталог',
          disabled: false,
          to: `/${this.GEO.activeShop.route}/collection/vse-categoryy-0`
        })

        this.breadcrumbs.unshift({
          text: 'Ayan Market',
          disabled: false,
          to: '/'
        })
      } else {
        let category
        if (this.CATEGORY[id]) {
          category = this.CATEGORY[id]
        } else {
          category = await this.getGategory(id)
        }
        // Убираем дублирование при перезагрузке или смене филиала
        if (!this.breadcrumbs.some(b => b.text === (this.$i18n.locale === 'kz' ? category.nameKz : category.name))) {
          const breadcrumb = {
            text: this.$i18n.locale === 'kz' ? category.nameKz : category.name,
            disabled: false,
            to: `/${this.GEO.activeShop.route}/collection/${this.$translit(category.name)}-${category.id}`
          }

          if (category.children && category.children.length) {
            breadcrumb.children = category.children.map(child => ({
              text: this.$i18n.locale === 'kz' ? child.nameKz : child.name,
              to: `/${this.GEO.activeShop.route}/collection/${this.$translit(child.name)}-${child.id}`
            }))
          }

          this.breadcrumbs.unshift(breadcrumb)
          this.$set(this.menuVisibles, breadcrumb.text, false)
        }

        await this.breadcrumbs_creator(category.parentId, false)

        // Добавляем в конец списка хлебных крошек название продукта
        if (isRoot && this.name) {
          let truncatedName = this.name
          if (this.$vuetify.breakpoint.xsOnly) {
            truncatedName = this.name.substring(0, 25) + '...'
          }
          this.breadcrumbs.push({
            text: this.$capitalize(truncatedName),
            disabled: false,
            to: `/product/${this.$translit(truncatedName)}-${this.id}`
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import "./style";
</style>
