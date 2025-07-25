<template>
  <div>
    <div v-if="!allFeatures" class="feature">
      <p class="filters_title">
        {{ feature.featureName }}
      </p>
      <v-list-item
        v-for="value in shortValues"
        :key="value"
        class="filters_item"
      >
        <template>
          <v-list-item-action>
            <v-checkbox
              v-model="filters.featureValues"
              :value="value"
              :off-icon="'mdi-checkbox-blank-outline'"
              :on-icon="'mdi-checkbox-marked'"
              color="#503CC3"
              dense
            >
              <template v-slot:label>
                <v-list-item-content>
                  <v-list-item-subtitle>
                    {{ value }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-checkbox>
          </v-list-item-action>
        </template>
      </v-list-item>
    </div>
    <div v-else class="feature">
      <p class="filters_title">
        {{ feature.featureName }}
      </p>
      <v-text-field
        v-model.trim="searchFeature"
        :label="$i18n.t('filters.find')"
        outlined
        dense
        class="feature_input"
        color="#503CC3"
        hide-details
        clearable
        background-color="#e9e9e9"
      />
      <div v-if="filteredValues.length" class="all-features">
        <v-list-item
          v-for="value in filteredValues"
          :key="value"
          class="filters_item"
        >
          <template>
            <v-list-item-action>
              <v-checkbox
                v-model="filters.featureValues"
                :value="value"
                :off-icon="'mdi-checkbox-blank-outline'"
                :on-icon="'mdi-checkbox-marked'"
                color="#503CC3"
                dense
              >
                <template v-slot:label>
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      {{ value }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-checkbox>
            </v-list-item-action>
          </template>
        </v-list-item>
      </div>
      <p v-else class="feature_nothing">
        {{ $i18n.t("filters.noFind") }}
      </p>
    </div>
    <v-btn v-if="feature.values.length > 5" text x-small class="features_btn" @click="allFeatures = !allFeatures">
      {{ allFeatures ? $i18n.t("filters.collapse") : $i18n.t("filters.more") }}
    </v-btn>
  </div>
</template>
<script>

export default {
  name: 'FeatureListItem',
  props: {
    feature: {
      type: Object,
      default: () => {}
    },
    filters: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      allFeatures: false,
      searchFeature: ''
    }
  },
  computed: {
    filteredValues () {
      let arr = this.feature.values
      if (this.searchFeature) {
        arr = arr
          .filter(item => item.toLowerCase().includes(this.searchFeature.toLowerCase()))
      }
      arr.sort((item) => {
        if (this.filters.featureValues.includes(item)) {
          return -1
        }
        return 1
      })
      return arr
    },
    shortValues () {
      const arr = this.feature.values.slice(0, 5)
      arr.sort((item) => {
        if (this.filters.featureValues.includes(item)) {
          return -1
        }
        return 1
      })
      return arr
    }
  },
  watch: {
    allFeatures (val) {
      if (!val) {
        this.searchFeature = ''
      }
    }
  }
}
</script>
<style lang="scss">
.feature{
    &_input{
        border-radius: 8px !important;
        max-width: 93% !important;
        align-items: center !important;
        input{
            padding: 0 !important;
        }
        .v-input{
           &__slot{
             min-height: 35px !important;
           }
           &__append-inner{
             margin: 5px 0 !important;
           }
        }
    }
    &_nothing{
        margin: 5px 0 0 9px !important;
        font-size: 12px;
    }
}
.all-features{
    height: 150px;
    overflow-y: scroll;
}
.features_btn{
    color: #503CC3 !important;
}
</style>
