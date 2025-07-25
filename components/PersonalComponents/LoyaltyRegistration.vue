<template>
  <section class="form">
    <v-form ref="form" class="form_container">
      <h2 class="form_title">
        Клуб AyanMarket - регистрация
      </h2>
      <div class="form_text">
        <v-text-field
          v-model="input.firstName"
          :label="$i18n.t('personalOffice.name')"
          color="#503CC3"
          outlined
          dense
          readonly
          background-color="#e9e9e9"
        />
      </div>
      <div class="form_text">
        <v-text-field
          v-model="input.lastName"
          :label="$i18n.t('personalOffice.surName')"
          color="#503CC3"
          outlined
          dense
          readonly
          background-color="#e9e9e9"
        />
      </div>
      <div class="form_text">
        <v-text-field
          v-model="input.phoneNumber"
          label="Телефон"
          color="#503CC3"
          outlined
          dense
          readonly
          background-color="#e9e9e9"
        />
      </div>
      <div class="form_text">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="input.birthdayDate"
              :label="$i18n.t('personalOffice.dateBirhday')"
              background-color="#e9e9e9"
              color="#503CC3"
              outlined
              dense
              append-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              :rules="[rules.required]"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="input.birthdayDate"
            color="#503CC3"
            :max="(new Date(Date.now())).toISOString().substring(0, 10)"
            min="1950-01-01"
            locale="ru"
            @change="menu = false"
          />
        </v-menu>
      </div>
      <div class="form_text">
        <v-select
          v-model="input.sex"
          :label="$i18n.t('personalOffice.gender')"
          :items="['Муж', 'Жен']"
          color="#503CC3"
          outlined
          dense
          background-color="#e9e9e9"
        />
      </div>
      <div class="form_text">
        <v-select
          v-model="selectedCity"
          label="Город"
          :items="cityes"
          item-text="name"
          return-object
          color="#503CC3"
          outlined
          dense
          :rules="[rules.required]"
          background-color="#e9e9e9"
        />
      </div>

      <div class="form_text">
        <v-text-field
          v-model="input.email"
          label="Почта"
          color="#503CC3"
          outlined
          dense
          background-color="#e9e9e9"
        />
      </div>
      <div class="form_text">
        <v-select
          v-model="input.maritalStatus"
          label="Семейное положение"
          :items="['Женат/замужем', 'Холост/не замужем']"
          color="#503CC3"
          outlined
          dense
          background-color="#e9e9e9"
        />
      </div>
      <div class="form_text">
        <v-select
          v-model="input.hasPet"
          label="Домашние животные"
          :items="pets"
          item-text="name"
          item-value="value"
          color="#503CC3"
          outlined
          dense
          background-color="#e9e9e9"
        />
      </div>
      <div class="form_text">
        <v-text-field
          v-model="input.login"
          label="Логин"
          color="#503CC3"
          outlined
          dense
          :rules="[rules.required]"
          background-color="#e9e9e9"
        />
      </div>
      <div class="form_text">
        <v-text-field
          v-model="input.password"
          label="Пароль"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPass ? 'text' : 'password'"
          color="#503CC3"
          outlined
          dense
          background-color="#e9e9e9"
          :rules="[rules.max]"
          @click:append="showPass = !showPass"
        />
      </div>
      <v-checkbox
        v-model="input.isTermsOfUsing"
        :rules="[rules.requiredCheckbox]"
        checked
        :off-icon="'mdi-circle-outline'"
        :on-icon="'mdi-circle-slice-8'"
        color="#503CC3"
        class="order_checkbox"
        :label="$i18n.t('order.agree')"
      />
      <div>
        <v-btn
          color="#503CC3"
          dark
          block
          @click="registrate()"
        >
          Создать аккаунт
        </v-btn>
      </div>
    </v-form>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LoyaltyRegistration',
  props: {

  },
  data () {
    return {
      cityes: [
        { name: 'Караганда', region: 'Карагандинская область' },
        { name: 'Темиртау', region: 'Карагандинская область' },
        { name: 'Астана', region: 'Акмолинская область' }
      ],
      pets: [
        { name: 'Да', value: true },
        { name: 'Нет', value: false }
      ],
      selectedCity: null,
      showPass: false,
      menu: false,
      input: {
        firstName: '',
        lastName: '',
        password: '',
        phoneNumber: '',
        birthdayDate: '',
        maritalStatus: null,
        hasPet: null,
        sex: null,
        login: '',
        email: '',
        isTermsOfUsing: false
      },
      rules: {
        required: value => !!value || 'Обязательно для заполнения',
        requiredCheckbox: value => !!value || this.$i18n.t('order.offer'),
        max (value) {
          if (!value || value.length < 6) {
            return 'Минимальная длина пароля 6 символов'
          } else {
            return true
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      PERSONAL: 'Personal/STATE'
    })
  },
  mounted () {
    this.input.firstName = this.PERSONAL.clientSingle.name
    this.input.lastName = this.PERSONAL.clientSingle.surname || ''
    this.input.phoneNumber = this.PERSONAL.clientSingle.phone || ''
    this.input.email = this.PERSONAL.clientSingle.email || ''
    this.input.sex = this.PERSONAL.clientSingle.gender || ''
    this.input.birthdayDate = this.PERSONAL.clientSingle.dateBirthday || ''
  },
  methods: {
    ...mapActions({
      REGISTRATION: 'Loyalty/REGISTRATION'
    }),
    async registrate () {
      if (this.$refs.form.validate()) {
        this.input.city = this.selectedCity.name
        this.input.region = this.selectedCity.region
        const resp = await this.REGISTRATION(this.input)
        if (resp.type !== 'error') {
          this.$emit('registrate')
        } else {
          this.$notify({
            group: 'app',
            type: 'error',
            duration: 2000,
            title: 'Ошибка авторизации',
            text: 'Неудалось зарегистрировать вас в системе лояльности AyanMarket'
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
