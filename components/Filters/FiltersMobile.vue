<template>
  <section class="pt-3 filters-mobile">
    <!-- Все фильтры -->
    <v-bottom-sheet
      v-model="openAllFilters"
      touch
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="filters-mobile_allFilters"
          text--black
          v-bind="attrs"
          elevation="0"
          v-on="on"
        >
          <v-icon>
            {{ 'mdi-filter-menu-outline' }}
          </v-icon>
        </v-btn>
      </template>
      <v-sheet
        class="text-center"
      >
        <div class="py-3">
          <v-list-item dense>
            <v-list-item-content class="price-block">
              <v-list-item-title class="price-block__title">
                {{ $i18n.t("fav.price") }}
              </v-list-item-title>
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
              <div class="price-block__footer">
                <v-text-field
                  v-model="filters.price[0]"
                  prefix="от"
                  class="mt-0 pt-0 price-block__field"
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
                  hide-details
                  single-line
                  type="number"
                  filled
                  dense
                />
              </div>
            </v-list-item-content>
          </v-list-item>
          <!-- CATEGORY FILTER -->
          <v-list-item v-if="curCategory.length && productsInfo.showCategory" dense>
            <v-list-item-content>
              <v-list class="filters_brand" dense>
                <p class="filters_title">
                  Категории
                </p>
                <v-list-item
                  v-for="cat in curCategory"
                  :key="cat.id"
                  class="filters_item"
                >
                  <template>
                    <v-list-item-action>
                      <v-checkbox
                        v-model="filters.categoryIds"
                        :value="cat.id"
                        :off-icon="'mdi-circle-outline'"
                        :on-icon="'mdi-circle-slice-8'"
                        color="#503CC3"
                        dense
                      >
                        <template v-slot:label>
                          <v-list-item-content>
                            <v-list-item-subtitle>
                              {{ cat.name }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-checkbox>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list>
            </v-list-item-content>
          </v-list-item>
          <!-- DEPARTMENT FILTER -->
          <v-list-item v-if="curDepartments.length" dense>
            <v-list-item-content>
              <v-list class="filters_brand" dense>
                <p class="filters_title">
                  {{ $i18n.t("fav.department") }}
                </p>
                <v-list-item
                  v-for="dep in curDepartments"
                  :key="dep.id"
                  class="filters_item"
                >
                  <template>
                    <v-list-item-action>
                      <v-checkbox
                        v-model="filters.departmentIds"
                        :value="dep.id"
                        :off-icon="'mdi-circle-outline'"
                        :on-icon="'mdi-circle-slice-8'"
                        color="#503CC3"
                        dense
                      >
                        <template v-slot:label>
                          <v-list-item-content>
                            <v-list-item-subtitle>
                              {{ dep.name }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-checkbox>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list>
            </v-list-item-content>
          </v-list-item>
          <!-- PROVIDERS FILTER -->
          <v-list-item v-if="curProviders.length" dense>
            <v-list-item-content>
              <v-list class="filters_brand" dense>
                <p class="filters_title">
                  {{ $i18n.t("fav.provider") }}
                </p>
                <v-list-item
                  v-for="provider in curProviders"
                  :key="provider.id"
                  class="filters_item"
                >
                  <template>
                    <v-list-item-action>
                      <v-checkbox
                        v-model="filters.providerIds"
                        :value="provider.id"
                        :off-icon="'mdi-circle-outline'"
                        :on-icon="'mdi-circle-slice-8'"
                        color="#503CC3"
                        dense
                      >
                        <template v-slot:label>
                          <v-list-item-content>
                            <v-list-item-subtitle>
                              {{ provider.name }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-checkbox>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list>
            </v-list-item-content>
          </v-list-item>
          <!-- RESET FILTERS -->
          <v-list-item dense>
            <v-list-item-content>
              <v-btn
                :elevation="0"
                class="filters_reset"
                @click="resetFilters"
              >
                {{ $i18n.t("fav.reset") }}
              </v-btn>
            </v-list-item-content>
          </v-list-item>
          <v-btn
            class="mt-2 filters-mobile_btn"
            @click="openAllFilters = !openAllFilters"
          >
            Принять
          </v-btn>
        </div>
      </v-sheet>
    </v-bottom-sheet>
    <!-- Кнопки по отдельности -->
    <!-- PRICE FILTER -->
    <div class="text-center">
      <v-bottom-sheet
        v-model="openPrice"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            elevation="0"
            :class="isPriceSelected ? 'filters-mobile_btnOn' : 'filters-mobile_btnOff'"
            v-bind="attrs"
            v-on="on"
          >
            Цена
          </v-btn>
        </template>
        <v-sheet
          class="text-center"
        >
          <div class="py-3">
            <v-list-item dense>
              <v-list-item-content class="price-block">
                <v-list-item-title class="price-block__title">
                  {{ $i18n.t("fav.price") }}
                </v-list-item-title>
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
                <div class="price-block__footer">
                  <v-text-field
                    v-model="filters.price[0]"
                    prefix="от"
                    class="mt-0 pt-0 price-block__field"
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
                    hide-details
                    single-line
                    type="number"
                    filled
                    dense
                  />
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-btn
              class="mt-2 filters-mobile_btn"
              @click="openPrice = !openPrice"
            >
              Принять
            </v-btn>
          </div>
        </v-sheet>
      </v-bottom-sheet>
    </div>
    <!-- DEPARTMENT FILTER -->
    <div class="text-center">
      <v-bottom-sheet
        v-model="openDepartment"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            elevation="0"
            :class="isDepartmentsSelected ? 'filters-mobile_btnOn' : 'filters-mobile_btnOff'"
            dark
            v-bind="attrs"
            v-on="on"
          >
            Филиал
          </v-btn>
        </template>
        <v-sheet
          class="text-center"
        >
          <div class="py-3">
            <v-list-item v-if="curDepartments.length" dense>
              <v-list-item-content>
                <v-list class="filters_brand" dense>
                  <p class="filters_title">
                    {{ $i18n.t("fav.department") }}
                  </p>
                  <v-list-item
                    v-for="dep in curDepartments"
                    :key="dep.id"
                    class="filters_item"
                  >
                    <template>
                      <v-list-item-action>
                        <v-checkbox
                          v-model="filters.departmentIds"
                          :value="dep.id"
                          :off-icon="'mdi-circle-outline'"
                          :on-icon="'mdi-circle-slice-8'"
                          color="#503CC3"
                          dense
                        >
                          <template v-slot:label>
                            <v-list-item-content>
                              <v-list-item-subtitle>
                                {{ dep.name }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </template>
                        </v-checkbox>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </v-list>
              </v-list-item-content>
            </v-list-item>
            <v-btn
              class="mt-2 filters-mobile_btn"
              @click="openDepartment = !openDepartment"
            >
              Принять
            </v-btn>
          </div>
        </v-sheet>
      </v-bottom-sheet>
    </div>
    <!-- PROVIDERS FILTER -->
    <div class="text-center">
      <v-bottom-sheet
        v-model="openProviders"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text--black
            :class="isProvidersSelected ? 'filters-mobile_btnOn' : 'filters-mobile_btnOff'"
            dark
            v-bind="attrs"
            elevation="0"
            v-on="on"
          >
            Поставщик
          </v-btn>
        </template>
        <v-sheet
          class="text-center"
        >
          <div class="py-3">
            <v-list-item v-if="curProviders.length" dense>
              <v-list-item-content>
                <v-list class="filters_brand" dense>
                  <p class="filters_title">
                    {{ $i18n.t("fav.provider") }}
                  </p>
                  <v-list-item
                    v-for="provider in curProviders"
                    :key="provider.id"
                    class="filters_item"
                  >
                    <template>
                      <v-list-item-action>
                        <v-checkbox
                          v-model="filters.providerIds"
                          :value="provider.id"
                          :off-icon="'mdi-circle-outline'"
                          :on-icon="'mdi-circle-slice-8'"
                          color="#503CC3"
                          dense
                        >
                          <template v-slot:label>
                            <v-list-item-content>
                              <v-list-item-subtitle>
                                {{ provider.name }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </template>
                        </v-checkbox>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </v-list>
              </v-list-item-content>
            </v-list-item>
            <v-btn
              class="mt-2 filters-mobile_btn"
              @click="openProviders = !openProviders"
            >
              Принять
            </v-btn>
          </div>
        </v-sheet>
      </v-bottom-sheet>
    </div>
    <!-- CATEGORY FILTER -->
    <div v-if="curCategory.length && productsInfo.showCategory" class="text-center">
      <v-bottom-sheet v-model="openCategory">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text--black
            :class="isCategoriesSelected ? 'filters-mobile_btnOn' : 'filters-mobile_btnOff'"
            dark
            v-bind="attrs"
            elevation="0"
            v-on="on"
          >
            Категории
          </v-btn>
        </template>

        <v-sheet v-if="curCategory.length && productsInfo.showCategory" class="text-center">
          <div class="py-3">
            <v-list-item dense>
              <v-list-item-content>
                <v-list class="filters_brand" dense>
                  <p class="filters_title">
                    Категории
                  </p>
                  <v-list-item v-for="cat in curCategory" :key="cat.id" class="filters_item">
                    <template>
                      <v-list-item-action>
                        <v-checkbox
                          v-model="filters.categoryIds"
                          :value="cat.id"
                          :off-icon="'mdi-circle-outline'"
                          :on-icon="'mdi-circle-slice-8'"
                          color="#503CC3"
                          dense
                        >
                          <template v-slot:label>
                            <v-list-item-content>
                              <v-list-item-subtitle>{{ cat.name }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </template>
                        </v-checkbox>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </v-list>
              </v-list-item-content>
            </v-list-item>
            <v-btn class="mt-2 filters-mobile_btn" @click="openCategory = !openCategory">
              Принять
            </v-btn>
          </div>
        </v-sheet>
      </v-bottom-sheet>
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
      default: () => {}
    },
    departments: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isopenAllFiltersSelected: false,
      openAllFilters: false,
      openProviders: false,
      openCategory: false,
      openDepartment: false,
      openPrice: false,
      startWatch: false,
      curProviders: [],
      curDepartments: [],
      curCategory: [],
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
    }),
    isPriceSelected () {
      return (
        this.filters.price[0] !== 0 ||
        this.filters.price[1] !== this.productsInfo.maxPrice
      )
    },
    isDepartmentsSelected () {
      return this.filters.departmentIds.length > 0
    },
    isProvidersSelected () {
      return this.filters.providerIds.length > 0
    },
    isCategoriesSelected () {
      return this.filters.categoryIds.length > 0
    }
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
  mounted () {
    // находим нужным поставщиков
    if (this.productsInfo.providerIds) {
      this.curProviders = this.PROVIDERS.all.filter(provider => this.productsInfo.providerIds.includes(provider.id))
    }
    // находим нужные филиалы
    this.curDepartments = this.GEO.info.depEntities
      .filter(dep => this.departments.includes(dep.id))
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
      GET_PROVIDERS: 'Providers/GET_PROVIDERS'
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
        price: [0, this.productsInfo.maxPrice]
      }
    }
  }
}
</script>

  <style lang="scss">
  @import "./style.scss";
  </style>
