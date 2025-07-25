<template>
  <section class="cards">
    <p class="cards_title">
      Мои карты оплаты
    </p>
    <div v-if="loading" class="loader-big">
      <v-progress-circular indeterminate color="#503CC3" />
    </div>
    <div v-else class="cards_block">
      <div class="cards_block">
        <div v-if="CREDIT_CARDS.length" class="cards_list">
          <div v-for="card in CREDIT_CARDS" :key="card.id" class="cards_item">
            <p>{{ card.issuer }}</p>
            <p class="cards_item__text">
              {{ card.masked_pan }}
            </p>
            <v-btn
              absolute
              icon
              color="black"
              class="cards_item__btn"
              @click="deleteCard(card.id)"
            >
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
            <img v-if="card.type === 'VISA'" src="@/assets/img/visa.png" alt="payment-system" width="50" class="cards_item__img">
            <img v-else src="@/assets/img/master-card.png" alt="payment-system" width="50" class="cards_item__img">
          </div>
          <v-btn
            dark
            color="#503CC3"
            @click="addCard()"
          >
            Добавить карту
          </v-btn>
        </div>
        <div v-else class="cards_block">
          <p class="cards_title">
            Нет доступных карт
          </p>
          <v-btn
            dark
            color="#503CC3"
            @click="addCard()"
          >
            Добавить карту
          </v-btn>
        </div>
        <div>
          <p>
            Оплачивать покупки в Аян Маркет стало ещё удобнее!<br>
            Сохраняйте свои платежные карты на сайте или в приложении и оплачивайте в один клик,
            без необходимости вводить данные каждый раз. Это не только экономит время, но и
            абсолютно безопасно. Ваши карты защищены платёжной организацией, а Аян Маркет не
            получает и не хранит данные ваших сохранённых карт.
          </p>
          <p>Доверяйте удобству и безопасности — делайте покупки легко и быстро!</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CreditCards',
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      CREDIT_CARDS: 'Payment/CREDIT_CARDS'
    })
  },
  mounted () {
    this.getCards()
  },
  methods: {
    ...mapActions({
      GET_CREDIT_CARDS: 'Payment/GET_CREDIT_CARDS',
      ADD_CREDIT_CARD: 'Payment/ADD_CREDIT_CARD',
      DELETE_CREDIT_CARD: 'Payment/DELETE_CREDIT_CARD'
    }),
    async getCards () {
      this.loading = true
      await this.GET_CREDIT_CARDS(this.$cookies.get('clientId'))
      this.loading = false
    },

    async addCard () {
      const linkUrl = await this.ADD_CREDIT_CARD(this.$cookies.get('clientId'))
      if (linkUrl) {
        this.$notify({
          group: 'appcenterbig',
          type: 'success',
          duration: 3000,
          title: 'Перенаправление',
          text: 'Вы будете перенаправлены на страницу для добавление новой карты'
        })
        // перенаправляет на страницу онлайн оплаты
        setTimeout(() => {
          const link = document.createElement('a')
          link.href = linkUrl
          link.click()
          URL.revokeObjectURL(link.href)
        }, 3000)
      }
    },
    async deleteCard (cardId) {
      const response = await this.DELETE_CREDIT_CARD(cardId)
      if (response.type !== 'error') {
        this.$notify({
          group: 'app',
          type: 'success',
          duration: 3000,
          title: 'Успешно',
          text: 'Ваша карта удалена'
        })
        this.GET_CREDIT_CARDS(this.$cookies.get('clientId'))
      } else {
        this.$notify({
          group: 'app',
          type: 'error',
          duration: 3000,
          title: 'Ошибка',
          text: response.data.message
        })
      }
    }
  }
}
</script>
  <style lang="scss">
   .cards{
    padding: 20px;
    &_title{
        font-weight: 800;
    }
    &_block{
       display: flex;
       gap: 50px;
       @media screen and (max-width:500px) {
        flex-direction: column;
       }
    }
    &_list{
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding-bottom: 30px;
      width: 100%;
    }
    &_item{
      width: 300px;
      height: 150px;
      border-radius: 20px;
      padding: 20px;
      background-color: #f6f6f9;
      position: relative;
      @media screen and (max-width:500px) {
         width: 100%;
         height: max-content;
       }
      &__btn{
        position: absolute;
        right: 5px;
        bottom: 5px;
      }
      &__img{
        position: absolute;
        right: 5px;
        top: 10px;
      }
      &__text{
        font-weight: 800;
        padding: 30px 0;
      }
    }
   }
  </style>
