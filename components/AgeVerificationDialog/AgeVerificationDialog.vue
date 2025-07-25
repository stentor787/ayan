<!-- TODO: нужно ли нам это диалоговое окно? -->
<template>
  <v-dialog
    v-model="dialogValue"
    width="740px"
    persistent
    overlay-opacity="1"
    @click:outside="
      $emit('cancel-dialog', $event);
    "
  >
    <v-card style="border-radius: 10px">
      <v-card-title class="d_age_confirm_title">
        <img src="@/assets/img/logo.png" alt="logo">
        <div>
          <span style="color: #438F34">21+</span>
        </div>
      </v-card-title>
      <v-card-text class="text-center">
        <span
          v-if="ageConfirmed === 'not-confirmed'"
          class="d_age_confirm_text"
        >
          Данная категория содержит информацию не рекомендованную
          <br>для лиц не достигших 21 года.<br>
          Для доступа к категории подтвердите пожалуйста свой возраст
        </span>
        <span v-else class="d_age_confirm_text--error">
          Вы еще не достигли возраста, официально разрешенного для потребления
          спиртных напитков и табачных изделий.
          <br><br>К сожалению, вы не можете посетить данную категорию. Вам
          должно быть больше 21 года.
        </span>
        <v-row v-if="ageConfirmed === 'not-confirmed'">
          <v-col cols="7" class="button-media-left">
            <v-btn
              small
              block
              color="#438F34"
              class="white--text"
              @click="
                // dialog = !dialog;
                // setLocal('confirmed');
                $emit('cancel-dialog', $event);
                $emit('set-local-confirmed', $event);
              "
            >
              Мне есть 21 год
            </v-btn>
          </v-col>
          <v-col cols="5" class="button-media-right">
            <v-btn
              small
              block
              color="#FF0100"
              class="white--text"
              @click="
                // setLocal('under');
                $emit('set-local-under', $event);
              "
            >
              Мне нет 21 года
            </v-btn>
          </v-col>
          <div class="text-center" style="width: 100%">
            <v-btn
              x-small
              color="#438F34"
              class="white--text button-media-xs"
              width="150px"
              height="28px"
              @click="
                // dialog = !dialog;
                // setLocal('confirmed');
                $emit('cancel-dialog', $event);
                $emit('set-local-confirmed', $event);
              "
            >
              Мне есть 21 год
            </v-btn>
            <v-btn
              x-small
              color="#FF0100"
              class="white--text button-media-xs"
              height="28px"
              @click="
                // setLocal('under');
                $emit('set-local-under');
              "
            >
              Мне нет 21 года
            </v-btn>
          </div>
        </v-row>
        <v-btn
          v-if="ageConfirmed === 'under'"
          block
          color="#438F34"
          class="white--text mb-6 mt-6"
          :to="`/`"
          @click="
            // dialog = !dialog;
            $emit('cancel-dialog', $event);
          "
        >
          Вернуться к витрине
        </v-btn>
        <span class="d_age_confirm_subtext">
          Сведения, размещенные на сайте, не являются рекламой, носят
          исключительно информационный характер, и предназначены только для
          личного использования. Мы выступаем категорически против употребления
          алкоголя несовершеннолетними.
        </span>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapGetters
  // mapActions
} from 'vuex'
export default {
  props: {
    ageConfirmed: {
      type: String,
      default: 'not-confirmed'
    },
    dialogValue: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE'
    })
  }
}
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
