<template>
  <div class="dis-text_field">
    <div v-if="label" class="dis-text_field__label">
      {{ label }}
    </div>
    <div class="dis-text_field__input_wrap">
      <slot name="prepend-icon" />
      <input
        :type="type"
        class="dis-text_field__input"
        :value="value"
        :placeholder="placeholder"
        @input="update"
      >
      <slot name="append-icon" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: [String, Boolean],
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    /* eslint-disable vue/require-default-prop */
    value: {
      type: String
    }
    /* eslint-enable vue/require-default-prop */
  },

  data () {
    return {
      innerValue: this.$props.value
    }
  },

  methods: {
    update (val) {
      this.$emit('input', this.innerValue)
    }
  }
}
</script>

<style lang="scss">
@import './style';
</style>
