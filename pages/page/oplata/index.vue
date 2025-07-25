
<template>
  <div v-if="$i18n.locale === 'ru'">
    <div class="header-pay">
      ОПЛАТА ОНЛАЙН — УДОБНО!
    </div>
    <div class="allPay">
      <!-- Первая карточка -->
      <div
        class="pay_online"
      >
        <div>
          <img
            src="@/assets/img/svg/credit-card.svg"
            alt="Credit Card Icon"
            class="icon"
          >
          <div class="text_title" style="color: #21a038;">
            Онлайн оплата от Airba Pay
          </div>
        </div>

        <div class="text_description">
          <p>Минимальная сумма заказа зависит от поставщика.</p>
          <p>
            Вы можете оплатить свой заказ банковской картой. Оплата происходит
            через сервисы Airba Pay с использованием банковских карт.
          </p>
        </div>
        <div class="text_imgs">
          <img src="@/assets/img/visa.png" alt="payment-system" width="50">
          <img src="@/assets/img/master-card.png" alt="payment-system" width="50">
        </div>
        <div class="btn text_btn" @click="openOnlinePage()">
          Подробнее
        </div>
      </div>

      <!-- Вторая карточка -->
      <div
        class="pay_online"
      >
        <div>
          <img src="@/assets/img/svg/cash.svg" alt="cash" class="icon">
          <div class="text_title" style="color:#f7a600">
            Оплата курьеру при доставке
          </div>
        </div>

        <div class="text_description">
          <p>Минимальная сумма заказа зависит от поставщика.</p>
          <p>
            <span class="text_title-min">Оплата наличными.</span> Вы можете оплатить свой заказ наличными курьеру.
            Оплата наличными: Простота и Уверенность в Каждой Сделке.
          </p>
          <p>
            <span class="text_title-min">Оплата пластиковой картой.</span><br> Вы можете оплатить свой заказ пластиковой картой при получении.
          </p>
        </div>
        <div class="btn text_btn" @click="openOplataNal()">
          Подробнее
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="header-pay">
      ОНЛАЙН ТӨЛЕМ ҚОҢАЙЛЫ!
    </div>
    <div class="allPay">
      <!-- Первая карточка -->
      <div
        class="pay_online"
      >
        <div>
          <img
            src="@/assets/img/svg/credit-card.svg"
            alt="Credit Card Icon"
            class="icon"
          >
          <div class="text_title" style="color: #21a038;">
            Airba Pay-тен онлайн төлем
          </div>
        </div>
        <div class="text_description">
          <p>Ең аз тапсырыс сомасы жеткізушіге байланысты.</p>
          <p>
            Тапсырысыңызды несие картасымен төлей аласыз. Төлем жүзеге асырылады
            банк карталарын пайдалана отырып, Airba Pay қызметтері арқылы.
          </p>
        </div>
        <div class="text_imgs">
          <img src="@/assets/img/visa.png" alt="payment-system" width="50">
          <img src="@/assets/img/master-card.png" alt="payment-system" width="50">
        </div>
        <div class="btn text_btn" @click="openOnlinePage()">
          {{ "Толығырақ" }}
        </div>
      </div>

      <!-- Вторая карточка -->
      <div
        class="pay_online"
      >
        <div>
          <img src="@/assets/img/svg/cash.svg" alt="cash" class="icon">
          <div class="text_title" style="color:#f7a600">
            Жеткізу кезінде курьерге төлем
          </div>
        </div>
        <div class="text_description">
          <p>Ең аз тапсырыс сомасы жеткізушіге байланысты.</p>
          <p>
            <span class="text_title-min">Қолма-қол төлем.</span>Тапсырысыңызды курьерге қолма-қол төлей аласыз.
            Қолма-қол ақшамен төлеу: Әрбір транзакциядағы қарапайымдылық және сенімділік.
          </p>
          <p>
            <span class="text_title-min">Пластикалық карта арқылы төлеу.</span><br> Тапсырысыңызды пластикалық картамен алғаннан кейін төлей аласыз.
          </p>
          <p>
            <br>
          </p>
        </div>
        <div class="btn text_btn" @click="openOplataNal()">
          {{ "Толығырақ" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    openOnlinePage () {
      this.$router.push('/page/oplata/online-oplata')
    },
    openOplataNal () {
      this.$router.push('/page/oplata/oplata-kureru')
    }
  },
  head () {
    return {
      title: 'Условия оплаты | Cервис доставки продуктов и товаров для дома Ayanmarket',
      meta: [
        {
          hid: 'description',
          name: ' description',
          content:
           'Подробная информация обо всех условиях оплаты: наличному и безналичному расчету - Продукты питания и товары с доставкой на дом Ayanmarket'
        }
      ],
      link: [{ rel: 'canonical', href: `https://ayanmarket.kz${this.$route.path}` }]
    }
  }
}
</script>

<style lang="scss">
@import "./style.scss";
</style>
