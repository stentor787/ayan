<template>
  <div class="dis-date-picker">
    <div v-if="label" class="dis-date-picker__label">
      {{ label }}
    </div>
    <datetime :v-model="date" class="input" :placeholder="placeholder" />
  </div>
</template>

<script>
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
export default {
  components: {
    Datetime
  },
  props: {
    date: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
  @import'./style.scss';
</style>
