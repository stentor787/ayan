<template>
  <section class="filters">
    <div class="price-block">
      <p class="price-block__title">
        Продуктовые фильтры
      </p>
    </div>

    <!-- PRICE FILTER -->
    <div class="price-block">
      <p class="price-block__title">
        {{ $i18n.t("fav.price") }}
      </p>
      <div class="price-block__footer">
        <v-text-field
          v-model="filters.price[0]"
          prefix="от"
          class="mt-0 pt-0 price-block__field"
          rounded
          hide-details
          single-line
          type="number"
          filled
          dense
        />
        <v-text-field
          v-model="filters.price[1]"
          prefix="до"
          class="mt-0 pt-0 price-block__field"
          rounded
          hide-details
          single-line
          type="number"
          filled
          dense
        />
      </div>
      <v-range-slider
        v-model="filters.price"
        :min="0"
        :max="productsInfo.maxPrice"
        :step="1"
        hide-details
        color="#503CC3"
        track-color="#aea2f5"
        class="align-center"
      />
    </div>
    <!-- Акция -->
    <div class="price-block">
      <p class="filters_title">
        {{ $i18n.t("filters.special") }}
      </p>
      <div class="filters_item">
        <v-checkbox
          v-model="filters.discount"
          :off-icon="'mdi-checkbox-blank-outline'"
          :on-icon="'mdi-checkbox-marked'"
          color="#503CC3"
          dense
          hide-details
          class="filters_checkbox"
        >
          <template v-slot:label>
            <span class="filters_item">{{ $i18n.t("filters.promo") }}</span>
          </template>
        </v-checkbox>
      </div>
    </div>

    <!-- CATEGORY FILTER -->
    <div v-if="curCategory.length && productsInfo.showCategory" class="price-block">
      <p class="filters_title">
        Категории
      </p>
      <div v-for="cat in curCategory" :key="cat.id" class="filters_item">
        <v-checkbox
          v-model="filters.categoryIds"
          :value="cat.id"
          :off-icon="'mdi-checkbox-blank-outline'"
          :on-icon="'mdi-checkbox-marked'"
          color="#503CC3"
          dense
          hide-details
          class="filters_checkbox"
        >
          <template v-slot:label>
            <div class="filters_item">
              {{ cat.name }}
            </div>
          </template>
        </v-checkbox>
      </div>
    </div>

    <!-- DEPARTMENT FILTER -->
    <div v-if="curDepartments.length" class="price-block">
      <p class="filters_title">
        {{ $i18n.t("fav.department") }}
      </p>
      <div v-for="dep in curDepartments" :key="dep.id" class="filters_item">
        <v-checkbox
          v-model="filters.departmentIds"
          :value="dep.id"
          :off-icon="'mdi-checkbox-blank-outline'"
          :on-icon="'mdi-checkbox-marked'"
          color="#503CC3"
          dense
          solo
          hide-details
          class="filters_checkbox"
        >
          <template v-slot:label>
            <div class="filters_item">
              {{ dep.name }}
            </div>
          </template>
        </v-checkbox>
      </div>
    </div>

    <!-- PROVIDERS FILTER -->
    <div v-if="curProviders.length" class="price-block">
      <p class="filters_title">
        {{ $i18n.t("fav.provider") }}
      </p>
      <div v-for="provider in curProviders" :key="provider.id" class="filters_item">
        <v-checkbox
          v-model="filters.providerIds"
          :value="provider.id"
          :off-icon="'mdi-checkbox-blank-outline'"
          :on-icon="'mdi-checkbox-marked'"
          color="#503CC3"
          dense
          solo
          hide-details
          class="filters_checkbox"
        >
          <template v-slot:label>
            <div class="filters_item">
              {{ provider.name }}
            </div>
          </template>
        </v-checkbox>
      </div>
    </div>
    <!-- фильтры характеристик -->
    <div class="price-block">
      <div v-for="feature in productsInfo.feature" :key="feature.featureName" class="filters_brand">
        <FeatureListItem :feature="feature" :filters="filters" />
      </div>
    </div>

    <!-- RESET FILTERS -->
    <div class="price-block">
      <v-btn class="filters_reset" @click="resetFilters">
        {{ $i18n.t("fav.reset") }}
      </v-btn>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FeatureListItem from './FeatureListItem'
import { debounce } from '~/components/Search/DebounceForSearch'
export default {
  name: 'Filters',
  components: { FeatureListItem },
  props: {
    productsInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      startWatch: false,
      curProviders: [],
      curDepartments: [],
      curCategory: [],
      selectedSortOption: '',
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
        isPopularitySort: false,
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
    // находим нужным поставщиков
    if (this.productsInfo.providerIds) {
      this.curProviders = this.PROVIDERS.all.filter(provider => this.productsInfo.providerIds.includes(provider.id))
    }
    // находим нужные филиалы
    this.curDepartments = this.GEO.info.depEntities
      .filter(dep => this.productsInfo.departmentIds.includes(dep.id))
    this.filters.price = [0, this.productsInfo.maxPrice]
    // Категории берем из доступных, если их нет то дергаем апи
    if (this.productsInfo.providerIds) {
      this.productsInfo.categoryIds.forEach((catId) => {
        if (this.CATEGORY[catId]) {
          this.curCategory.push(this.CATEGORY[catId])
        }
      })
    }

    // после установки всех данных включаем слежение
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
    // проверка заполнености фильтров
    checkFilters () {
      if (this.filters.price[0] === 0 &&
        this.filters.price[1] === this.productsInfo.maxPrice &&
        this.filters.providerIds.length === 0 &&
        this.filters.departmentIds.length === 0 &&
        this.filters.categoryIds.length === 0 &&
        this.filters.featureValues.length === 0 &&
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
    resetFilters () {
      // если фильтры не выбраны ничего не делаем
      if (this.checkFilters()) {
        return
      }
      this.filters = {
        providerIds: [],
        departmentIds: [],
        categoryIds: [],
        featureValues: [],
        discount: false,
        price: [0, this.productsInfo.maxPrice],
        priceSortAsc: false,
        priceSortDesc: false,
        newSort: false,
        isPopularitySort: false,
        nameSortAsc: false,
        isReviewSort: false,
        isDiscountSort: false,
        nameSortDesc: false
      }
    },
    setSortOption (sortOption) {
      // сбрасываем все опции сортировки
      this.filters.priceSortAsc = false
      this.filters.priceSortDesc = false
      this.filters.newSort = false
      this.filters.isPopularitySort = false
      this.filters.nameSortAsc = false
      this.filters.isReviewSort = false
      this.filters.isDiscountSort = false
      this.filters.nameSortDesc = false
      // устанавливаем выбранную опцию сортировки
      this.filters[sortOption] = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
.v-btn {
    background-color: #F4F6FA !important;
    color: rgba(0, 0, 0, 0.6);
    font-size: 11px;
    box-shadow: none !important;
    height: 10px !important;
    display: flex;
    justify-content: flex-start;
    padding: 0px !important;
    font-weight: 500;
    line-height: 1rem;
    font-family: "Mulish", sans-serif !important;
    text-transform: none;
}
.v-btn.active {
  background-color: none !important;
  color: #503CC3;
  box-shadow: none !important;
  height: 10px !important;
  widows: 15px !important;
}
</style>
