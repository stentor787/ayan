<template>
  <section class="product-counter-wrapper">
    <!-- v-btn-toggle можно оставить как было -->
    <v-btn-toggle
      :class="[
        { 'product-counter__cutted': !large },
        'product-counter'
      ]"
    >
      <!-- Кнопка минус -->
      <v-btn
        v-if="large"
        class="product-counter__minus"
        color="#F4F6FA"
        :disabled="disableStatus || disable"
        small
        @click="$emit('minus-btn-toggle')"
      >
        <v-icon color="#5d4bd0">mdi-minus</v-icon>
      </v-btn>

      <!-- Инпут для ручного ввода -->
      <v-text-field
        class="mt-0 pt-0 product-counter__center"
        v-model="localQuantity"
        hide-details
        color="#5d4bd0"
        type="number"
        :disabled="disable"
        @blur="onBlurInput"
        @keyup.enter="onBlurInput"
      />

      <!-- Кнопка плюс -->
      <v-btn
        v-if="large"
        class="product-counter__plus"
        color="#F4F6FA"
        small
        :disabled="disable"
        @click="$emit('plus-btn-toggle')"
      >
        <v-icon color="#5d4bd0">mdi-plus</v-icon>
      </v-btn>
    </v-btn-toggle>

    <!-- Здесь можно вывести текущее значение + ед. изм. -->
    <span v-if="!$vuetify.breakpoint.xsOnly" class="product-counter-wrapper_text">
      {{ localQuantity }} {{ measure }}
    </span>
  </section>
</template>

<script>
export default {
  props: {
    variableDigit: {
      type: [Number, String],
      required: true
    },
    measure: {
      type: String,
      default: ''
    },
    step: {
      type: Number,
      default: 1
    },
    disableStatus: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // Локальная переменная, чтобы не дёргать корзину на каждую цифру
      localQuantity: this.variableDigit
    }
  },
  watch: {
    // Если «снаружи» вдруг поменяли количество, подхватываем
    variableDigit(newVal) {
      this.localQuantity = newVal
    }
  },
  methods: {
    /**
     * Срабатывает при потере фокуса из инпута (blur)
     * или при нажатии Enter (keyup.enter)
     */
    onBlurInput() {
      let val = parseFloat(this.localQuantity)

      // Если пользователь ввёл что-то нечисловое или 0/отрицательное
      if (isNaN(val) || val <= 0) {
        val = this.step || 1
      }

      // Если есть шаг, попробуем округлить к ближайшей кратности
      if (this.step > 0) {
        const remainder = val % this.step
        // простой способ - округлить к ближайшему шагу
        val = Math.round(val / this.step) * this.step
      }

      // Обновляем локально (чтобы пользователь видел округление)
      this.localQuantity = val

      // И теперь единым событием «говорим» родителю: "Количество изменилось"
      this.$emit('change-amount', val)
    },
    forceSetQuantity(val) {
      this.localQuantity = val
    }
  }
}
</script>

<style lang="scss">
// Ваши стили, как раньше
@import "./style";
</style>
