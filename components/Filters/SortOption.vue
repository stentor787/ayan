<template>
  <section class="sort-filters">
    <div class="sort-option">
      <div class="select-container">
        <v-icon>mdi-sort-variant</v-icon>
        <span>Сортировать по: </span>
        <select
          id="sort-select"
          v-model="selectedSortOption"
          @change="handleSortChange"
          @focus="toggleDropdownIcon(true)"
          @blur="toggleDropdownIcon(false)"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
        <v-icon class="dropdown-icon" :class="{ 'rotated': isDropdownOpen }">
          mdi-chevron-down
        </v-icon>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { debounce } from '~/components/Search/DebounceForSearch'

export default {
  name: 'Filters',
  props: {
    productsInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      startWatch: false,
      curProviders: [],
      curDepartments: [],
      curCategory: [],
      selectedSortOption: 'isPopularitySort',
      isDropdownOpen: false,
      sortOptions: [
        { value: 'priceSortAsc', text: this.$t('sort.priceSortAsc') },
        { value: 'priceSortDesc', text: this.$t('sort.priceSortDesc') },
        { value: 'newSort', text: this.$t('sort.newSort') },
        { value: 'isPopularitySort', text: this.$t('sort.isPopularitySort') },
        { value: 'isReviewSort', text: this.$t('sort.isReviewSort') },
        { value: 'isDiscountSort', text: this.$t('sort.isDiscountSort') },
        { value: 'nameSortAsc', text: this.$t('sort.nameSortAsc') },
        { value: 'nameSortDesc', text: this.$t('sort.nameSortDesc') }
      ],
      filters: {
        providerIds: [],
        departmentIds: [],
        categoryIds: [],
        price: [0, 10000],
        featureValues: [],
        discount: false,
        priceSortAsc: false,
        priceSortDesc: false,
        newSort: false,
        isPopularitySort: true,
        nameSortAsc: false,
        isReviewSort: false,
        isDiscountSort: false,
        nameSortDesc: false,
        size: 30
      }
    }
  },
  computed: {
    ...mapGetters({
      PROVIDERS: 'Providers/STATE',
      GEO: 'GEO/STATE',
      CATEGORY: 'Category/AVAILABLE'
    })
  },
  watch: {
    filters: {
      handler () {
        if (this.startWatch) {
          this.debounceFunction()
        }
      },
      deep: true
    }
  },
  async mounted () {
    if (this.PROVIDERS.all.length === 0) {
      await this.GET_PROVIDERS()
    }
    if (this.productsInfo.providerIds) {
      this.curProviders = this.PROVIDERS.all.filter(provider => this.productsInfo.providerIds.includes(provider.id))
    }
    this.curDepartments = this.GEO.info.depEntities
      .filter(dep => this.productsInfo.departmentIds.includes(dep.id))
    this.filters.price = [0, this.productsInfo.maxPrice]
    if (this.productsInfo.providerIds) {
      this.productsInfo.categoryIds.forEach((catId) => {
        if (this.CATEGORY[catId]) {
          this.curCategory.push(this.CATEGORY[catId])
        }
      })
    }

    const id = setTimeout(() => { this.startWatch = true; clearTimeout(id) }, 1000)
  },
  methods: {
    ...mapActions({
      GET_PROVIDERS: 'Providers/GET_PROVIDERS',
      GET_DEPARTMENT_BY_ADDRESS: 'GEO/GET_DEPARTMENT_BY_ADDRESS'
    }),
    debounceFunction: debounce(function () {
      if (this.checkFilters()) {
        this.$emit('clear-filters')
      } else {
        this.$emit('change-filters', this.filters)
      }
    }, 500),
    checkFilters () {
      if (this.filters.price[0] === 0 &&
          this.filters.price[1] === this.productsInfo.maxPrice &&
          !this.filters.discount &&
          !this.filters.priceSortAsc &&
          !this.filters.priceSortDesc &&
          !this.filters.newSort &&
          !this.filters.isPopularitySort &&
          !this.filters.nameSortAsc &&
          !this.filters.isReviewSort &&
          !this.filters.isDiscountSort &&
          !this.filters.nameSortDesc) {
        return true
      }
      return false
    },
    handleSortChange () {
      // Сбрасываем все флаги сортировки
      for (const option of this.sortOptions) {
        this.filters[option.value] = false
      }
      this.filters[this.selectedSortOption] = true
      this.toggleDropdownIcon(false)
    },
    toggleDropdownIcon (isOpen) {
      this.isDropdownOpen = isOpen
    }
  }
}
</script>

<style scoped>
.sort-option {
  display: flex;
  align-items: center;
  padding-left: 16px;
}

.sort-option label {
  margin-right: 8px;
  font-weight: bold;
}

.select-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
}

#sort-select {
  width: 150px;
  padding: 8px;
  font-size: 14px;
  color: #5d4bd0;
  appearance: none;
  background: white;
  position: relative;
  z-index: 1;
  cursor: pointer;
  transition: all 0.3s ease;
  @media screen and (max-width: 800px) {
    border: 0px;
  }
}

#sort-select:focus {
  border-color: black;
  outline: none;
}

.dropdown-icon {
  position: absolute;
  right: 15px;
  pointer-events: none;
  z-index: 2;
  color: #5d4bd0;
  transition: transform 0.3s ease;
}

.rotated {
  transform: rotate(180deg);
}

#sort-select option {
  padding: 10px;
}
</style>
