<template>
  <div class="inputs">
    <div class="form">
      <v-form ref="form" class="form_container">
        <p class="form_top-title">
          Личные данные
        </p>
        <div class="form_text">
          <span class="form_title">
            Email
          </span>
          <v-text-field
            v-if="edit"
            v-model="input.email"
            color="#503CC3"
            class="form_input"
            hide-details
            dense
            :rules="[rules.required, rules.hasAtSymbol]"
            @keyup.enter="saveClient"
          />
          <span v-if="edit" class=" mini">При вводе почты , Вы соглашаетесь с пользовательским соглашением, политикой конфиденциальности и получением информационных рассылок</span>
          <span v-if="!edit" class="text">
            {{ input.email }}
          </span>
        </div>

        <div class="form_text">
          <span class="form_title">
            {{ $i18n.t("personalOffice.number") }}
          </span>
          <v-text-field
            v-if="edit"
            v-model="input.phone"
            color="#503CC3"
            class="form_input"
            dense
            :rules="[rules.max]"
            @keyup.enter="saveClient"
          />
          <span v-if="!edit" class="text">
            {{ input.phone }}
          </span>
        </div>

        <div class="form_text">
          <span class="form_title">
            {{ $i18n.t("personalOffice.name") }}
          </span>
          <v-text-field
            v-if="edit"
            v-model="input.name"
            dense
            color="#503CC3"
            class="form_input"
            :rules="[rules.required]"
            @keyup.enter="saveClient"
          />
          <span v-if="!edit" class="text">
            {{ input.name }}
          </span>
        </div>

        <div class="form_text">
          <span class="form_title">
            {{ $i18n.t("personalOffice.surName") }}
          </span>
          <v-text-field
            v-if="edit"
            v-model="input.surname"
            color="#503CC3"
            class="form_input"
            dense
            :rules="[rules.required]"
            @keyup.enter="saveClient"
          />
          <span v-if="!edit" class="text">
            {{ input.surname }}
          </span>
        </div>

        <div class="form_text">
          <span class="form_title">
            {{ $i18n.t("personalOffice.secondName") }}
          </span>
          <v-text-field
            v-if="edit"
            v-model="input.middlename"
            color="#503CC3"
            class="form_input"
            dense
            @keyup.enter="saveClient"
          />
          <span v-if="!edit" class="text">
            {{ input.middlename || 'Отсутствует' }}
          </span>
        </div>
        <div class="form_text">
          <span class="form_title">
            {{ $i18n.t("personalOffice.dateBirhday") }}
          </span>
          <v-date-picker
            v-if="edit"
            v-model="input.dateBirthday"
            color="#503CC3"
            dense
            locale="ru"
            @keyup.enter="saveClient"
          />
          <span v-if="!edit" class="text">
            {{ input.dateBirthday }}
          </span>
        </div>

        <div class="form_text gender">
          <span class="form_title ml-4">
            {{ $i18n.t("personalOffice.gender") }}
          </span>
          <div class="form_gender-box">
            <v-btn
              rounded
              class="form_gender-btn"
              :color="input.gender === 'Муж' ? '#D9DCDE' : 'white'"
              @click="input.gender = 'Муж'"
            >
              Мужской
            </v-btn>
            <v-btn
              rounded
              class="form_gender-btn"
              :color="input.gender === 'Жен' ? '#D9DCDE' : 'white'"
              @click="input.gender = 'Жен'"
            >
              Женский
            </v-btn>
          </div>
        </div>

        <div class="d-flex justify-start mt-5">
          <v-btn
            v-if="!edit"
            small
            color="#503CC3"
            dark
            @click="edit = !edit"
          >
            Изменить
          </v-btn>
          <v-btn
            v-else
            small
            color="#503CC3"
            dark
            @click="saveClient()"
          >
            Сохранить
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    input: {
      type: Object,
      default: () => ({
        name: '',
        surname: '',
        middlename: '',
        gender: '',
        dateBirthday: '',
        email: '',
        phone: '',
        id: null
      })
    }
  },
  data () {
    return {
      rules: {
        required: value => !!value || 'Обязательно для заполнения',
        max (value) {
          if (!value || value.length < 11 || value.length > 12) {
            return 'Введите верный номер'
          } else {
            return true
          }
        },
        hasAtSymbol (value) {
          const regex = /@/
          if (!regex.test(value)) {
            return 'Текст должен содержать символ "@"'
          }
          return true
        }
      },
      edit: false
    }
  },
  methods: {
    ...mapActions({
      save: 'Personal/editClient'
    }),
    showOrders () {
      this.$router.push('/page/orders/')
    },
    setIcon (val) {
      if (val === false) {
        return 'mdi-pencil'
      } else {
        return 'mdi-check'
      }
    },
    async saveClient () {
      if (this.$refs.form.validate()) {
        try {
          await this.save(this.input)
          this.$notify({
            group: 'app',
            type: 'success',
            duration: 1000,
            title: 'Данные успешно сохранены',
            text: 'Ваши данные были успешно обновлены.'
          })
          this.edit = !this.edit
        } catch (error) {
          this.$notify({
            group: 'app',
            type: 'error',
            duration: 1000,
            title: 'Ошибка при сохранении данных',
            text: 'Пожалуйста, убедитесь, что введенные данные для электронной почты и номера телефона корректны, и не содержат лишних символов.'
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "./style";
</style>
