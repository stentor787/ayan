<template>
  <div class="balance">
    <div v-if="loading" class="loader-big">
      <v-progress-circular indeterminate color="#503CC3" />
    </div>
    <!-- секция с картами если у клиента есть лояльность -->
    <section v-if="hasLoyalty && !loading" class="cards">
      <div class="cards_list">
        <img v-for="card in loaylty.cards" :key="card.cardNumber" class="balance_img" src="@/assets/img/card.png" alt="card">
      </div>
      <div class="cards_right">
        <p class="cards_title">
          Баланс вашей бонусной карты  {{ loaylty.bonus }}
        </p>
        <p>
          Каждая покупка в сети супермаркетов АЯН становится выгоднее с бонусной картой!
          Копите баллы за каждую покупку, оплачивайте ими любимые товары и получайте
          дополнительные скидки на акционные предложения клуба Аян.
        </p>
        <p>
          Ваша карта — это ключ к выгодам: чем больше покупок, тем больше возможностей
          сэкономить и радовать себя и близких качественными продуктами по сниженным ценам
        </p>
      </div>
    </section>

    <section v-if="!hasLoyalty && !loading">
      <!-- вход в личный кабинет если есть физическая карта лояльности -->
      <div v-if="!registration" class="bal-login">
        <h2 class="bal-login_title">
          Клуб AyanMarket
        </h2>
        <div class="bal-login_btns">
          <v-btn
            v-for="item in types"
            :key="item.id"
            text
            class="bal-login_type"
            :class="input.type === item.type ? 'active-btn' : ''"
            @click="input.type = item.type; activeTitle = item.input"
          >
            {{ item.title }}
          </v-btn>
        </div>
        <v-form ref="login" class="bal-login_inputs">
          <div class="bal-login_inputs">
            <v-text-field
              v-model="input.authToken"
              :label="activeTitle"
              outlined
              dense
              color="#503CC3"
              :rules="[rules.required]"
              background-color="#f6f6f9"
            />
            <v-text-field
              v-model="input.password"
              label="Пароль"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              color="#503CC3"
              outlined
              dense
              :rules="[rules.required]"
              background-color="#f6f6f9"
              @click:append="showPass = !showPass"
            />
          </div>
        </v-form>
        <div class="bal-login_actions">
          <v-btn
            color="#503CC3"
            :block="$vuetify.breakpoint.xsOnly"
            dark
            @click="logIn()"
          >
            Войти
          </v-btn>
          <div class="bal-login_actions__text">
            <span>Нет аккаунта?</span>
            <v-btn text color="#503CC3" @click="registration = true">
              Регистрация
            </v-btn>
          </div>
        </div>
        <div class="bal-login_notify">
          <p>Если Вы ранее пользовались услугами бонусной карты AyanMarket и у Вас имеется личный кабинет , то после ввода логина и пароля Вам будут доступны Ваши карты и бонусы.  </p>
          <p> Если у Вас не имеется бонусной карты AyanMarket , Вам необходимо пройти регистрацию для получения виртуальной бонусной карты.</p>
        </div>
      </div>
      <!-- регистрация в лояльности -->
      <LoyaltyRegistration v-else @registrate="getCards()" />
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LoyaltyRegistration from '@/components/PersonalComponents/LoyaltyRegistration'

export default {
  components: { LoyaltyRegistration },
  data () {
    return {
      registration: false,
      showPass: false,
      loading: true,
      hasLoyalty: false,
      loaylty: null,
      types: [
        { id: 0, title: 'По логину', type: 'LOGIN', input: 'Логин' },
        { id: 1, title: 'По почте', type: 'EMAIL', input: 'Почта' },
        { id: 2, title: 'По карте', type: 'CARD', input: 'Номер карты' }
      ],
      activeTitle: 'Логин',
      input: {
        authToken: '',
        password: '',
        type: 'LOGIN',
        isInternal: false // Всегда фалс косяк бека, не знаю за что отвечает
      },
      rules: {
        required: value => !!value || 'Обязательно для заполнения'
      }
    }
  },
  computed: {
    ...mapGetters({
      PERSONAL: 'Personal/STATE'
    })
  },
  mounted () {
    if (this.PERSONAL.clientSingle.isLoyalty) {
      this.getCards()
    } else {
      this.loading = false
    }
  },
  methods: {
    ...mapActions({
      LOGIN: 'Loyalty/LOGIN',
      GET_CARDS: 'Loyalty/GET_CARDS'
    }),
    // вход если у клиента есть реальная карта
    async logIn () {
      if (this.$refs.login.validate()) {
        const resp = await this.LOGIN(this.input)
        if (resp.type !== 'error') {
          this.getCards()
        } else {
          this.$notify({
            group: 'app',
            type: 'error',
            duration: 2000,
            title: 'Ошибка авторизации',
            text: 'Пожалуйста, убедитесь в корректности данных'
          })
        }
      }
    },
    async getCards () {
      this.loading = true
      this.hasLoyalty = true
      const response = await this.GET_CARDS()
      if (response.type !== 'error') {
        this.loaylty = response
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>

  .bal-login{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &_type{
      border-bottom: #c5c3d0 1px solid;
      border-radius: 0px !important;
      color: #c5c3d0 !important;
    }
    &_title {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 20px;
      margin-left: 10px;
    }
    &_btns{
      display: flex;
      margin-bottom: 20px;
    }
    &_inputs{
      display: flex;
      width: 100%;
      flex-direction: column;
    }
    &_actions{
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 100%;
      align-items: center;
      margin-bottom: 20px;
      &__text{
        display: flex;
        align-items: center;
      }
    }
  }
  .active-btn{
  color: #503CC3 !important;
  border-bottom: #503CC3 1px solid;
}
  .balance{
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px;
    &_img{
        width: 400px;
        height: auto;
    }
  }
  .return-block{
    background-color: #503CC3;
    &_btn{
      text-transform: none;
    }
  }
  .cards{
    padding: 20px;
    display: flex;
    gap: 20px;
    @media screen and (max-width: 600px) {
        flex-direction: column;
      }
    &_right{
      font-size: 12px;
    }
    &_title{
      font-size: 16px;
      font-weight: 900;
      color: black;
    }
    &_list{
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
   }
  </style>
