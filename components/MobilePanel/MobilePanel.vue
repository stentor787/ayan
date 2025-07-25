<template>
  <v-container v-if="value">
    <div class="mobile_panel_bg" />
    <div class="mobile_panel">
      <v-toolbar color="#503CC3" class="white--text">
        <v-spacer />
        <span class="mobile_panel_header">
          Каталог товаров
        </span>
        <v-spacer />
        <v-btn absolute icon color="white" right @click="closePanel()">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-row class="mobile_panel_rows">
        <v-col cols="4" class="mobile_panel_parent elevation-4 pt-0 pb-0 pr-0">
          <div class="slider-group-wrapper">
            <div class="inner" />
            <div
              v-for="(item, index) in CATEGORY.catalogCategories"
              :key="item.id"
              class="d-flex justify-center align-center text-center mobile_panel_block"
              @click="changeCategory(item); order = index + 1; parentId = item"
            >
              <v-img
                v-if="item.fileUrlSmall"
                :src="item.fileUrlSmall"
                eager
                :class="['mobile_panel_img', {'mobile_panel_img--active': item.id == currentCategoryId}]"
                contain
                max-height="30px"
                max-width="30px"
                class="mb-2"
              />
              <span class="mobile_panel_title">
                {{ $i18n.locale === 'kz' ? item.nameKz : item.name }}
              </span>
            </div>
            <div id="slider" class="slider-wrapper" style="height: 90px; right: 0; top: 0; width: 2px">
              <div class="slider-element" />
            </div>
          </div>
        </v-col>
        <v-col cols="8" class="pa-0 child-categories">
          <div v-if="parentId != null" class="ml-7 child-show-all" @click="goToCategory(parentId)">
            {{ $i18n.t("mobilePanel.showAll") }}
          </div>
          <v-treeview
            transition
            :active="activeCategory"
            :open="activeCategory"
            color="#503CC3"
            :items="child"
            item-children="children"
            open-on-click
            @update:open="activeCategory = $event"
          >
            <template slot="append" slot-scope="{open, item}">
              <v-btn v-if="item.children.length !== 0 && open == false" icon>
                <v-icon>
                  mdi-chevron-right
                </v-icon>
              </v-btn>
              <v-btn v-else-if="item.children.length !== 0 && open == true" icon>
                <v-icon>
                  mdi-chevron-down
                </v-icon>
              </v-btn>
            </template>
            <template slot="label" slot-scope="{ item }">
              <div
                :class="[{
                  'child-categories--all': item.name === 'Показать все'
                }]"
                @click="!item.children.length && goToCategory(item)"
              >
                {{ $i18n.locale === 'kz' ? item.nameKz : item.name }}
              </div>
            </template>
          </v-treeview>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentCategoryId: null,
      order: 1,
      child: [],
      parentId: null,
      activeCategory: [],
      currentMain: {}
    }
  },
  computed: {
    ...mapGetters({
      CATEGORY: 'Category/STATE',
      GEO: 'GEO/STATE'
    })
  },
  watch: {
    order: {
      handler (oldVal, val) {
        const slider = document.getElementById('slider')
        if (oldVal != null) {
          slider.style.top = parseInt(slider.style.top.replace(/px/g, '')) + ((oldVal - val) * 90) + 'px'
        } else {
          slider.style.top = '0px'
        }
      },
      deep: true
    },
    CATEGORY: {
      handler () {
        if (this.CATEGORY.catalogCategories && this.CATEGORY.catalogCategories.length) {
          this.changeCategory(this.CATEGORY.catalogCategories[0])
        }
      }
    }
  },
  methods: {
    addShowAll () {
      for (let i = 0; i < this.child.length; i++) {
        if (this.child[i].children.length !== 0) {
          this.child[i].children.unshift({ name: 'Показать все', id: this.child[i].id, children: [], categoryName: this.child[i].name })
        }
      }
    },
    changeCategory (val) {
      this.currentCategoryId = val.id
      this.child = JSON.parse(JSON.stringify(val.children))
      this.addShowAll()
    },
    closePanel () {
      this.changeCategory(this.CATEGORY.catalogCategories[0])
      this.order = 1
      this.parentId = this.CATEGORY.catalogCategories[0]
      this.$eventBus.$emit('leftMainStatus', false)
      document.body.style.overflow = 'initial' // eslint-disable-line
    },
    goToCategory (data) {
      this.closePanel()
      this.$router.push(`/${this.GEO.activeShop.route}/collection/${this.$translit(data.categoryName || data.name)}-${data.id}`)
    }
  }
}
</script>
<style lang="scss">
  @import "./style";
</style>
