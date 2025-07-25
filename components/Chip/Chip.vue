<template>
  <section class="chip_container">
    <div class="cat-menu">
      <div class="cat-list">
        <p
          class="cat-list__text"
          :class="[{'active-block': id === 0}]"
          @click="getCategory(0)"
        >
          {{ $i18n.locale === 'kz' ? 'Барлық' : 'Все' }}
        </p>
        <div class="cat-list__line" />
        <!-- родительские категории -->
        <div v-if="parentsCategory.length">
          <p
            v-for="parent in parentsCategory"
            :key="parent.id"
            class="cat-list__text"
            :class="[{'active-block': parent.id === id}]"
            @click="getCategory(parent)"
          >
            {{ $i18n.locale === 'kz' ? parent.nameKz : parent.name }}
          </p>
        </div>
        <!-- дочерние категории или братья -->
        <div v-for="(item, index) in value" :key="index" class="cat-list__child">
          <p
            v-if="item && item.id"
            class="cat-list__text"
            :class="[{'active-block': item.id === id}]"
            @click="getCategory(item)"
          >
            {{ $i18n.locale === 'kz' ? item.nameKz : item.name }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    id: {
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
      parentsCategory: []
    }
  },
  computed: {
    ...mapGetters({
      CATEGORY: 'Category/AVAILABLE',
      catalog: 'Category/CATALOG_CATEGORIES',
      GEO: 'GEO/STATE'
    }),
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
  mounted () {
    if (this.catalog.length) {
      // если нет детей, то сама категория тоже показывается в списке
      if (this.CATEGORY[this.id].children && this.CATEGORY[this.id].children.length) {
        this.parentsCategory.unshift(this.CATEGORY[this.id])
      }
      this.getParentsCategory(this.id)
    }
  },
  methods: {
    ...mapActions({
      REMOVE_FROM_AVAILABLE: 'Category/REMOVE_FROM_AVAILABLE'
    }),
    getCategory (data) {
      if (data === 0) {
        this.$router.push(`/${this.GEO.activeShop.route}/collection/vse-categorii-` + data)
        return
      }
      // если у категории несколько родителей, то мы удаляем ее текущего родителя из стора, чтобы потом подтянуть заново
      // const parentIds = Object.keys(this.CATEGORY[this.id]?.parentMap)
      // if (parentIds?.length > 1) {
      //   parentIds.forEach(id => this.REMOVE_FROM_AVAILABLE(id))
      // }
      this.$router.push(`/${this.GEO.activeShop.route}/collection/${this.$translit(data.name)}-${data.id}`)
    },
    getParentsCategory (id) {
      const parentCatId = this.CATEGORY[id]?.parentId
      // если у категории есть родительская
      if (parentCatId) {
        this.parentsCategory.unshift(this.CATEGORY[parentCatId])
        this.getParentsCategory(parentCatId)
      }
    }
  }
}
</script>

<style lang="scss">
    @import "./style";
</style>
