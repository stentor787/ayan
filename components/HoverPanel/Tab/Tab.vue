<template>
  <v-list
    v-show="hasThisListShown"
    class="hover-panel__tab"
    @mouseenter="() => changeTabState({ children: [] }, false)"
  >
    <v-list-item-group>
      <v-list-item
        v-for="item in childCategories"
        :key="item.id"
        @mouseenter="() => changeTabState(item, true)"
      >
        <v-list-item-avatar horizontal>
          <v-img
            v-if="item.img != null"
            :src="item.img"
            :alt="item.name"
            :title="item.name"
            contain
            max-height="30px"
            max-width="30px"
          />
        </v-list-item-avatar>
        <v-list-item-title class="hover-panel_body_title">
          {{ item.name }}
        </v-list-item-title>
        <v-list-item-action>
          <v-icon color="#503CC3">
            mdi-chevron-right
          </v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>

export default {
  name: 'Tab',
  props: {
    hasThisListShown: {
      type: Boolean,
      default: false
    },
    childCategories: {
      type: Array,
      required: true
    },
    parentPanel: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      isShown: false,
      currentCategoryChildren: []
    }
  },
  methods: {
    changeTabState (category, showState, _e) {
      this.isShown = showState
      this.currentCategoryChildren = category.children
    }
  }
}
</script>

<style>
.toner-wrapper {
  width: 100%;
  max-width: none;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 104;
  background-color: rgba(0, 0, 0, 0.2);
}
.hover-panel {
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow-x: auto;
}
</style>
