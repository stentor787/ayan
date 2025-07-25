<template>
  <div class="code-container">
    <input 
      style="
        margin-bottom: 20px;
        margin-left: 5px;
        font-size: 14px;
        padding: 0px 25px 0px 23px;
        border-radius: 34px;
        width: 393px;
        background-color: rgb(239, 236, 255);
        max-width: 393px;
        height: 34px;
        -moz-appearance: textfield; /* Для Firefox */
        -webkit-appearance: none; /* Для Chrome, Safari, Opera */
      "
      ref="codeInput" 
      @input="changeInp($event.target.value)" 
      v-model="codeInput" 
      maxlength="7" 
      autofocus 
    >
    <div class="button-container">
      <v-btn
        style="height: 35px"
        class="send_code"
        color="#503CC3"
        :disabled="isButtonDisabled" 
        @click="submitCode"
      >
        Войти
      </v-btn>

      <v-btn
        class="send_code"
        :style="{
          backgroundColor: isHovered ? '#503CC3' : '#503CC380',
        }"
        :disabled="isButtonDisabled" 
        @mouseover="isHovered = true"
        @mouseleave="isHovered = false"
        @click="closeDialog"  
      >
        Не сейчас
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Code',
  data () {
    return {
      codeInput: '',  // Храним код
      isButtonDisabled: false, // флаг для блокировки кнопки
      isHovered: false,
    };
  },
  methods: {
    changeInp(value) {
      // Форматируем ввод, добавляя дефисы
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 0) {
        formattedValue = formattedValue.split('').join('-').slice(0, 7); // Формат "X-X-X-X"
      }
      this.codeInput = formattedValue; // Обновляем состояние
    },
    submitCode() {
      // Убираем дефисы перед отправкой
      const code = this.codeInput.replace(/-/g, '');
      if (code.length === 4) {
        this.$emit('complete', code); // Отправляем код, только если он длиной 4
      } else {
        alert("Пожалуйста, введите правильный код.");
      }
    },
    closeDialog() {
      this.$emit('closedialog');  // Эмитируем событие для закрытия окна
    }
  }
};
</script>

<style scoped lang="scss">
.code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.button-container {
  margin-left: 4px;
  margin-top: 3px;
  display: flex;
  grid-gap: 10px;
  gap: 20px; /* Добавим немного пространства между кнопками */
}

.send_code {
  font-weight: 600;
  width: 186px;
  height: 35px;
  border-radius: 20px;
  color: white;
  font-size: 10px;
}
</style>
