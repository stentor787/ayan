<template>
<div>
  <div  v-if="isLoaded">
    <v-container class="order-container">
    <div class="order-box">
      <div class="order">
        <!-- оплата -->
        <div class="order_payment">
          <h1 class="order_payment__hidden">
            {{ $i18n.t('order.title') }}
          </h1>
          <p class="title-text">
            {{ $i18n.t('order.payment') }}
          </p>
          <div class="payment">
            <div v-for="pay in PAYMENT.alltype.slice(0,4)" :key="pay.id" class="payment_type" @click="chosePayment(pay.id)">
              <div class="payment_colored" :class="input.paymentTypeId === pay.id && 'yellow-pay'">
                <span class="payment_colored__text">{{ $i18n.locale === 'ru' ? pay.name : pay.nameKz }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="order_block">
          <!-- инфо пользователя -->
          <div class="order_block-item">
            <p class="title-text">
              Заказчик
            </p>
            <div class="order_text-box">
              <span>
                <span>{{ input.nameUser }} {{ input.phoneUser }}</span>
              </span>
            </div>
            <div>
              <v-btn small text color="#503CC3" class="pl-0" @click="endClient = false; modals.nameDialog = true">
                Изменить
              </v-btn>
            </div>
          </div>

          <!-- инфо получателя -->
          <div class="order_block-item">
            <p class="title-text">
              Получатель товара
            </p>
            <div class="order_text-box">
              <span>
                <span>{{ input.endClientDto.nameUser }} {{ input.endClientDto.phoneUser }}</span>
              </span>
            </div>
            <div>
              <v-btn small text color="#503CC3" class="pl-0" @click="endClient = true;modals.nameDialog = true">
                Изменить
              </v-btn>
            </div>
          </div>
          <!-- способ получения -->
          <div class="order_block-item">
            <p class="title-text">
              {{ $i18n.t('order.getType') }}
            </p>
            <div class="order_text-box">
              <span>
                {{ $i18n.t('order.byCourier') }}
                г.{{ GEO.activeCityTitle }} {{ input.address.street }} {{ input.address.house }}
              </span>
            </div>
            <div>
              <v-btn small text color="#503CC3" class="pl-0" @click="modals.adressDialog = true">
                Изменить
              </v-btn>
            </div>
          </div>

          <!--Промокод -->
          <div class="order_block-item">
            <p class="title-text red-text">
              Промокод
            </p>
            <v-text-field
              outlined
              dense
              class="order_input mt-2"
              color="#503CC3"
              hide-details
              background-color="#F4F6FA"
            />
            <div>
              <v-btn small text color="#503CC3" class="pl-0">
                Применить
              </v-btn>
            </div>
          </div>

          <!-- блок вместе быстрее -->
          <div class="order_block-item">
            <p class="title-text">
              {{ $i18n.t('order.deliveryOptions') }}
            </p>
            <div class="half">
              <div class="half_btn" :class="faster && 'picked'" @click="faster = true">
                <span class="half_btn__text">{{ $i18n.t('order.fasterFree') }}</span>
              </div>
              <div class="half_btn" :class="!faster && 'picked'" @click="!sameDeliveryDates ? faster = false : null">
                <span class="half_btn__text">{{ $i18n.t('order.togetherFree') }}</span>
                <span v-if="oldestDate">  {{ oldestDate[1] }} {{ oldestDate[0].slice(0,3) }}</span>
              </div>
            </div>
          </div>
          <!-- блок комменты -->
          <div class="order_block-item">
            <p class="title-text">
              {{ $i18n.t('order.commentTo') }}
            </p>
            <div class="order_text-box">
              <v-textarea
                v-model="comment"
                row-height="5"
                auto-grow
                outlined
                dense
                hide-details
                class="order_area"
                color="#503CC3"
                background-color="#F4F6FA"
                :rules="[checkIsCommentValid()]"
              />
            </div>
            <div>
              <v-btn
                small
                text
                color="#503CC3"
                class="pl-0"
                @click="checkIsCommentValid() ? input.comment = comment : null"
              >
                Применить
              </v-btn>
            </div>
          </div>
        </div>
      </div>
      <!-- блок с подтверждением -->
      <div class="confirm">
        <div class="confirm_block">
          <v-btn
            :dark="!creatingOrder"
            color="#503CC3"
            class="order_btn"
            block
            :loading="creatingOrder"
            :disabled="creatingOrder"
            @click="createOrder()"
          >
            {{ $i18n.t('order.confirm') }}
          </v-btn>
          <v-alert
            v-if="depDatesAndTime.length"
            class="alert"
            color="#F5F7FA"
          >
            <template v-slot:prepend>
              <v-icon large color="#A5AEB8">
                mdi-information-outline
              </v-icon>
            </template>
            <template v-slot:default>
              <div v-for="[depId, date, name] in depDatesAndTime" :key="depId" class="ml-2 mb-1 text-style4">
                {{ $i18n.t('order.orderFor') }} {{ name }} <br> {{ $i18n.t('order.go') }} {{ date }}
              </div>
            </template>
          </v-alert>
          <v-form ref="personalProcessing">
            <v-checkbox
              v-model="personalProcessing"
              :rules="[rules.requiredCheckbox]"
              checked
              :off-icon="'mdi-circle-outline'"
              :on-icon="'mdi-circle-slice-8'"
              color="#503CC3"
              class="order_checkbox"
              :label="$i18n.t('order.agree')"
            />
          </v-form>
        </div>
        <div>
          <p class="confirm_title">
            {{ $i18n.t('order.yourOrder') }}
          </p>
          <div class="confirm_info">
            <p>
              Количество товаров
            </p>
            <p class="text-style2">
              {{ ORDER.orderProducts.length }} {{ differentEnding }}
            </p>
          </div>
          <div class="confirm_info">
            <p>
              {{ $i18n.t('order.delPrice') }}
            </p>
            <p class="text-style2">
              {{ totalDeliveryPrice ? `${(totalDeliveryPrice).toLocaleString('ru')}₸` : 'Бесплатно' }}
            </p>
          </div>
          <div class="confirm_info">
            <p>
              Сумма заказов
            </p>
            <p class="text-style2">
              {{ (totalPrice.total).toLocaleString('ru') }}₸
            </p>
          </div>
          <div v-if="totalPrice.discount" class="confirm_info">
            <p>
              Сумма скидки
            </p>
            <p class="red-text text-style2">
              {{ (totalPrice.discount).toLocaleString('ru') }}₸
            </p>
          </div>
        </div>
        <div class="confirm_info">
          <p class="confirm_colored">
            Итого {{ (totalPrice.totalWithDiscount).toLocaleString('ru') }}₸
          </p>
        </div>
      </div>
      
    </div>
    <!-- товары по филиалам разбитые -->
    <p class="title-text">
      {{ $i18n.t('order.expected') }}
    </p>
    <div v-for="item in filterProducts" :key="item.depId" class="order_date-block">
      <!-- <p v-if="nextWeek" class="title-text">
        {{ $i18n.t('order.expected') }} {{ departmentDate[item.depId].day }} {{ departmentDate[item.depId].month.slice(0,3) }}
      </p> -->
      <div v-if="nextWeek" class="day-box">
        <div
          v-for="(day, i) in nextWeek[item.depId]"
          :key="i"
          class="day-box_item"
          :class="[departmentDate[item.depId].date === day.date && 'bordered', !day.isWork && 'bordered-red']"
          @click="day.isWork ? changeDay(item.depId, day) : null"
        >
          <div class="text-style2">
            <span>{{ day.day }}</span>
            <span>{{ day.month.slice(0,3) }}</span>
          </div>
          <span>{{ day.weekDay }}</span>
        </div>
      </div>
      <ProductsSlider :products-arr="item.products" />
      <v-select
        v-if="timeDelivery[item.depId]"
        v-model="departmentTime[item.depId]"
        :items="timeDelivery[item.depId]"
        :label="$i18n.t('order.time2')"
        item-text="text"
        item-value="id"
        outlined
        dense
        class="order_input time-input mt-5"
        color="#503CC3"
        hide-details
        background-color="#F4F6FA"
        validate-on-blur
        @change="checkTodayDelivery()"
      />
      
    </div>
    <Modals
      :input="input"
      :modals="modals"
      :validate="validate"
      :tel="telefonConfirmed"
      :end-client="endClient"
      @confirm="telefonConfirmed = true"
    />
    <OnlinePayModal :show.sync="showOnlinePayModal" />
    <v-dialog v-model="priceChangedDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">Изменились цены на товары</v-card-title>
          <v-card-text>
            <div v-html="changedPricesMessage"></div>
          </v-card-text>
          <v-card-actions>  
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closePriceChangedDialog">ОК</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-container>
  </div>
  <div v-else class="loader-container" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <v-progress-circular indeterminate color="#503CC3" size="64"></v-progress-circular>
    </div>
</div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { mask } from 'vue-the-mask'
import Modals from '@/components/NewOrder/Modals.vue'
import OnlinePayModal from '@/components/NewOrder/OnlinePayModal.vue'
export default {
  components: { Modals, OnlinePayModal },
  directives: { mask },
  data () {
    return {
      modals: {
        adressDialog: false,
        nameDialog: false,
        infoDialog: false,
          isLoaded: false,
      },
      isLoaded: false,
      showOnlinePayModal: false,
      endClient: false, // флаг в модалке изменять пользователя или конечного получаетеля
      priceChangedDialog: false,    // флаг отображения модального окна с изменёнными ценами
      changedPricesMessage: '',     // текст с информацией о изменившихся ценах
      telefonConfirmed: false,
      validate: false,
      personalProcessing: false,
      faster: true,
      sameDeliveryDates: false,
      departmentDate: {},
      departmentTime: {},
      oldestDate: 0,
      oldestDay: 0,
      comment: '',
      input: {
        address: {
          addressTypeId: 1,
          block: '',
          city: 1,
          code: '',
          house: '',
          level: '',
          room: '',
          stairs: '',
          street: '',
          comment: ''
        },
        deliveryTime: '',
        departmentId: 0,
        paymentTypeId: 1,
        phoneUser: '+7',
        products: [],
        device: 'Site',
        promoCode: '',
        nameUser: '',
        surnameUser: '',
        endClientDto: {
          phoneUser: '',
          nameUser: ''
        }
      },
      timeDelivery: {}, // доступное время для заказа в выбранный день
      depDatesAndTime: [],
      nextWeek: null,
      creatingOrder: false,
      seoData: {},
      rules: {
        requiredCheckbox: value =>
          !!value || this.$i18n.t('order.offer')
      }
    }
  },
  computed: {
    ...mapGetters({
      CART: 'Cart/STATE',
      GEO: 'GEO/STATE',
      PAYMENT: 'Payment/STATE',
      PERSONAL: 'Personal/STATE',
      ORDER: 'Order/STATE',
      UTM: 'SEO/UTM'
    }),
    differentEnding () {
      if (this.$i18n.locale === 'kz') {
        return 'өнім'
      }
      let str = ''
      switch (this.ORDER.orderProducts.length) {
        case 1:
          str = 'товар'
          break
        case 2:
        case 3:
        case 4:
          str = 'товара'
          break
        default:
          str = 'товаров'
      }
      return str
    },
    totalDeliveryPrice () {
      const fullDeps = this.GEO.info.depEntities.filter(dep => this.ORDER.orderDepartments.includes(dep.id))
      const price = fullDeps.reduce((acc, item) => item.totalDeliveryPrice + acc, 0)
      return price
    },
    totalPrice () {
      console.log(0)
      const price = this.ORDER.orderProducts.reduce(
        (acc, item) => {
          const totalWithDiscount = item.totalDiscountPrice ? parseFloat(item.totalDiscountPrice) : parseFloat(item.totalPrice)
          let discount = 0
          if (item.totalDiscountPrice) {
            discount = parseFloat(item.totalPrice) - parseFloat(item.totalDiscountPrice)
          }
          acc.totalWithDiscount = (acc.totalWithDiscount || 0) + totalWithDiscount // общая цена со скидкой
          acc.discount = (acc.discount || 0) + discount // общая скидка
          acc.total = (acc.total || 0) + item.totalPrice // общая цена без скидки
          console.log(1)
          return acc
        },
        {}
      )
      price.totalWithDiscount = price.totalWithDiscount + this.totalDeliveryPrice// общая цена со скидкой и доставкой
      console.log(price)
      return price
    },
    // Разделяет продукты по департаментам
    filterProducts () {
      const filtered = []
      for (const dep of this.ORDER.orderDepartments) {
        const depProducts = {
          products: this.ORDER.orderProducts.filter(product => product.departmentId === dep),
          depId: dep
        }
        filtered.push(depProducts)
      }
      return filtered
    }
  },
  watch: {
    faster (val) {
      if (val) {
        this.getWorkDays()
      } else {
        this.setSameDeliveryDate()
      }
      this.getDepTime()
      this.checkTodayDelivery()
    }
  },
  async created () {
    if (this.ORDER.orderProducts.length === 0) {
      this.$router.replace({ path: '/basket' })
      return
    }
    // получаем список всех способов оплаты
    await this.GET_ALL_PAY_TYPE(this.ORDER.orderDepartments)
    this.input.paymentTypeId = this.PAYMENT.alltype[0].id
  },
  async mounted () {
    this.$eventBus.$on('changeDepartment', () => this.$router.push('/'))
    this.parseStreet()
    const token = this.$cookies.get('clientId') || null
    if (token !== null) {
      this.telefonConfirmed = true
      await this.getClientAdress(token)
      await this.getClient(token)
      this.input.nameUser =
          this.PERSONAL.clientSingle.surname +
          ' ' +
          this.PERSONAL.clientSingle.name +
          ' ' +
          this.PERSONAL.clientSingle.middlename
      if (this.input.nameUser.trim().length === 0) {
        this.input.nameUser = ''
      }
      this.input.phoneUser = this.PERSONAL.clientSingle.phone
    }
    await this.GET_ORDER_DELIVERY({ products: this.filterProducts, cityId: this.GEO.info.activeCity })
    this.getWorkDays()
    this.getDepTime()
    this.checkTodayDelivery()
    this.createSeoData()
    // если единственный способ это онлайн сразу вызываем модалку
    if (this.PAYMENT.alltype.length === 1 && this.PAYMENT.alltype[0].id === 5) {
      this.showOnlinePayModal = true
    } // После всех загрузок устанавливаем флаг:
    this.isLoaded = true
  },
  methods: {
   // 1) Подключаем мутации (для обновления цены и филиала):
    ...mapMutations('Order', ['UPDATE_PRODUCT_PRICE', 'UPDATE_PRODUCT_DEPARTMENT']), 
    ...mapActions({
      SEND_ORDER: 'Order/SEND_ORDER',
      createOrderV2: 'Order/CREATE_ORDER_V2', // Используйте camelCase
      APPLY_CHECK_RESULTS: 'Order/APPLY_CHECK_RESULTS',
      CHECK_ORDER: 'Order/CHECK_ORDER',
      GET_ORDER_DELIVERY: 'Order/GET_ORDER_DELIVERY',
      ADD_LAST_ORDER: 'Order/ADD_LAST_ORDER',
      CLEAR_LAST_ORDER: 'Order/CLEAR_LAST_ORDER',
      CLEAR_CART_PRODUCTS: 'Cart/CLEAR_CART_PRODUCTS',
      GET_ALL_PAY_TYPE: 'Payment/GET_ALL_PAY_TYPE',
      GET_ONLINE_PAY_LINK: 'Payment/GET_ONLINE_PAY_LINK',
      getClientAdress: 'Personal/getClientAdress',
      getClient: 'Personal/getClient'
    }),

    closePriceChangedDialog() {
    this.priceChangedDialog = false
  },

    chosePayment (payId) {
      if (payId === 5) {
        this.showOnlinePayModal = true
      }
      this.input.paymentTypeId = payId
      this.sendGTMEvent(true)
    },
    //  вручную меняем день
    changeDay (depId, day) {
      this.departmentDate[depId] = day
      this.getDepTime()
      this.checkSameDelivery()
      this.checkTodayDelivery()
    },
    //  Проверка в один ли день доставка у филиалов
    checkSameDelivery () {
      // все первые дни доставки товаров
      const dates = Object.values(this.departmentDate)
      // если все дни равны
      if (dates.every(date => date.date === dates[0].date)) {
        this.sameDeliveryDates = true
      } else {
        this.sameDeliveryDates = false
        let oldest = new Date()
        dates.forEach((item) => {
          if (oldest < new Date(item.date)) {
            oldest = new Date(item.date)
          }
        })
        // дата для отображения на кнопке
        this.oldestDate = this.$moment(oldest).format('MMMM:DD:dddd').split(':')
        // число для сравнения в функции
        this.oldestDay = this.$moment(oldest).date()
      }
    },
    // назначаем одну дату для всех филиалов
    setSameDeliveryDate () {
      for (const item of this.filterProducts) {
        const newDate = this.nextWeek[item.depId].find(date => this.$moment(date.date).date() === this.oldestDay)
        // если у одного из филиалов не рабочий день, ставим еще плюс 1 день и снова проверяем
        if (newDate && newDate.isWork) {
          this.departmentDate[item.depId] = newDate
        } else if (!newDate) {
          this.faster = true
          return
        } else {
          const newNextDate = this.$moment(newDate.date).add(1, 'day')
          // если новый назначенный день выходит из интервала 5 дней доставки, прекращаем функцию
          if (newNextDate.isAfter(this.nextWeek[item.depId][this.nextWeek[item.depId].length - 1].date)) {
            this.faster = true
            return
          }
          this.oldestDay = newNextDate.date()
          this.oldestDate = this.$moment(newNextDate).format('MMMM:DD:dddd').split(':')
          this.setSameDeliveryDate()
        }
      }
    },
    // получает доступные даты для заказа (5 дней от текущего)
    getWorkDays () {
      const dates = {}
      for (const item of this.filterProducts) {
        const arr = []
        const deliveryTimes = this.ORDER.delivery[item.depId][0].deliveryTimes
        for (let i = 0; i < deliveryTimes.length; i++) {
          const date = this.$moment(deliveryTimes[i].date)
          const data = date.format('MMMM:DD:dddd').split(':')
          const weekDayEn = deliveryTimes[i].dayOfWeek
          const shedule = deliveryTimes[i]
          const obj = {
            date: date.format('YYYY-MM-DD'),
            month: data[0],
            day: data[1],
            weekDay: data[2],
            weekDayEn,
            // день рабочий если у него есть график
            isWork: shedule.startTime && shedule.endTime ? shedule.startTime : false,
            endTime: shedule.endTime
          }
          arr.push(obj)
        }
        dates[item.depId] = arr
        // Назначаем текущий день для доставки
        this.departmentDate[item.depId] = arr.filter(day => day.isWork)[0]
      }
      this.nextWeek = dates
      this.checkSameDelivery()
    },
    // Проверяет сегодня ли доставка, если нет выводит алерт с данными о доставке
    checkTodayDelivery () {
      const today = new Date().getDate()
      const dates = Object.entries(this.departmentDate)
      const notToday = dates.some(date => Number(date[1].day) > today)
      if (notToday) {
        this.depDatesAndTime = dates.map((arr) => {
          const current = this.GEO.info.depEntities.find(dep => dep.id === Number(arr[0]))
          arr[1] = `${arr[1].date} ${+this.departmentTime[arr[0]].slice(0, 2) + 1}:00`
          arr.push(current.name)
          return arr
        })
      } else {
        this.depDatesAndTime = []
      }
    },
    // получает доступное время для заказа в выбранный день
    getDepTime () {
      const timesObj = {}
      for (const item of this.filterProducts) {
        const actualDayShed = this.departmentDate[item.depId]
        const timeStart = parseInt(actualDayShed.isWork.substr(0, 2), 10)
        const timeEnd = parseInt(actualDayShed.endTime.substr(0, 2), 10)
        const result = []
        for (let i = timeStart; i < timeEnd; i++) {
          const deliveryTimeFrom = ('0' + i).slice(-2)
          const deliveryTimeTo = ('0' + (i + 1)).slice(-2)
          result.push({
            id: `${deliveryTimeFrom}:00`,
            text: `${deliveryTimeFrom}.00-${deliveryTimeTo}.00`
          })
        }
        timesObj[item.depId] = result.length ? result : null
        this.departmentTime[item.depId] = `${this.departmentDate[item.depId].isWork.substr(0, 2)}:00`
      }
      this.timeDelivery = timesObj
    },

    // функция создания заказа и проверки введенных полей
    async createOrder() {
  // 1) Базовые проверки
  if (!this.checkAdress()) {
    this.validate = true
    this.modals.adressDialog = true
    return
  }
  if (!this.verifyData(this.input.nameUser, this.input.phoneUser)) {
    return
  }
  if (!this.$refs.personalProcessing.validate()) {
    return
  }
  if (!this.telefonConfirmed) {
    this.modals.nameDialog = true
    this.$notify({
      group: 'app',
      type: 'warn',
      duration: 5000,
      title: 'Подтвердите телефон'
    })
    return
  }

  this.creatingOrder = true

  // Приводим телефон, город, флаги.
  this.input.phoneUser = this.input.phoneUser.replaceAll(' ', '')
  if (this.input.endClientDto.phoneUser) {
    this.input.endClientDto.phoneUser = this.input.endClientDto.phoneUser.replaceAll(' ', '')
  }
  this.input.address.city = this.GEO.cityId
  this.input.isSoloOrder = (this.ORDER.orderDepartments.length === 1)

  // 2) Считаем общую стоимость (из вашего computed.totalPrice)
  //   Тут вы уже суммировали все товары + доставку
  //   Если у вас есть скидки, это всё заложено в totalWithDiscount
  this.input.totalPrice = this.totalPrice.totalWithDiscount

  // 3) Формируем checkRequests (по каждому филиалу)
  const checkRequests = this.filterProducts.map(depBlock => {
    // Частичная сумма по товарам данного depBlock
    const partialTotal = depBlock.products.reduce((acc, p) => {
      if (p.totalDiscountPrice) {
        return acc + Number(p.totalDiscountPrice)
      } else if (p.totalPrice) {
        return acc + Number(p.totalPrice)
      }
      return acc + (Number(p.price) * Number(p.amount))
    }, 0)

    return {
      phoneUser: this.input.phoneUser,
      nameUser: this.input.nameUser,
      surnameUser: this.input.surnameUser,

      departmentId: depBlock.depId,
      totalPrice: partialTotal,
      // добавляем новое поле (общее) — loyaltyDiscount:
      loyaltyDiscount: this.input.loyaltyDiscount,
      products: depBlock.products.map(p => ({
        productId: p.productId,
        amount: p.amount,
        price: p.price,
        providerId: p.providerId,
        loyaltyPrice: p.loyaltyPrice
      })),
      paymentTypeId: this.input.paymentTypeId,
      address: this.input.address,
      deliveryTime: this.input.deliveryTime,
      comment: this.input.comment,
      device: this.input.device,
      promoCode: this.input.promoCode,
      coupon: this.input.coupon,
      isSoloOrder: this.input.isSoloOrder,
      seoData: this.seoData,
      endClientDto: this.input.endClientDto,
      paidForDelivery: this.input.paidForDelivery,
      deliveryOptionKeyName: this.input.deliveryOptionKeyName
    }
  })

  try {
    // 4) Проверка на бэкенде
    const checkResponse = await this.CHECK_ORDER(checkRequests)
    // 5) Применяем результаты к локальным товарам (APPLY_CHECK_RESULTS)
    const result = await this.APPLY_CHECK_RESULTS(checkResponse)

    // 6) Обработка результата
    if (result.type === 'error') {
      // Есть товар isAvailable === false
      this.creatingOrder = false
      // Вы уже уведомили о недоступности, либо можете уведомить здесь
      return
    }
    if (result.type === 'changed') {
      // Цены поменялись (или филиал)
      const changedPriceProducts = result.changed
      const productsList = changedPriceProducts
      .map(prod => {
      // Находим продукт в хранилище Vuex по productId
      const product = this.ORDER.orderProducts.find(p => p.productId === prod.productId)
      // Получаем название продукта, если oldName отсутствует
      const name = product ? (prod.oldName || product.productName) : 'Неизвестный товар'
      return `«${name}»: ${prod.oldPrice} → ${prod.newPrice}`
    })
    .join('<br>')
      // Сообщаем пользователю
  // Формируем сообщение для модального окна
  this.changedPricesMessage = `
    <p>Новые цены для следующих товаров:</p>
    <p>${productsList}</p>
    <p>Пожалуйста, проверьте корзину и повторите оформление.</p>
  `
  // Открываем модальное окно и прекращаем выполнение оформления заказа
  this.priceChangedDialog = true
  this.creatingOrder = false
  return
    }

    // 7) Если дошли сюда => type === 'ok'
    //    при повторном нажатии, когда уже нет изменений
    // Ещё раз (если нужно) актуализируем общую сумму:
    this.input.totalPrice = this.totalPrice.totalWithDiscount

    // 8) Создаём заказы (по филиалам)
    const ordersResult = await this.createOrdersByDepartments()
    if (ordersResult.type === 'success') {
      // Успех — уведомляем и переходим на success
      this.$notify({
        group: 'app',
        type: 'success',
        duration: 3000,
        title: this.$i18n.t('errors.successOrder')
      })
      this.$router.push('/page/successOrder/')
    } else {
      // Ошибка при создании
      this.$notify({
        group: 'appcenterbig',
        type: 'error',
        duration: 3000,
        title: this.$i18n.t('errors.errOrder'),
        text: ordersResult.message || 'Неизвестная ошибка оформления'
      })
    }
  } catch (err) {
    // Сетевая ошибка / API-ошибка
    this.$notify({
      group: 'appcenterbig',
      type: 'error',
      duration: 3000,
      title: 'Ошибка при проверке заказа',
      text: err.message
    })
  } finally {
    this.creatingOrder = false
  }
},

// Реализация многократного создания заказов (по филиалам)
async createOrdersByDepartments() {
  const onlinePaymentOrders = []
  const responseList = []
  const isSoloOrder = !(this.ORDER.orderDepartments.length > 1)

  for (const item of this.filterProducts) {
    // Подставим расчётную дату/время доставки для данного филиала
    this.input.deliveryTime = this.departmentDate[item.depId].date + ` ${this.departmentTime[item.depId]}:00`
    this.input.departmentId = item.depId

    // При желании можно пересчитать totalPrice под товары именно этого филиала
    // или просто отправить общую this.input.totalPrice, если бэкенд сам раскинет.

    // Собираем products именно для этого филиала
    const depProducts = item.products

    // Отправляем createOrderV2
    const res = await this.createOrderV2({
      ...this.input,
      isSoloOrder,
      products: depProducts
      // При необходимости: paidForDelivery: (найдём доставку для этого филиала)
      // ...и т.д.
    })
    responseList.push(res)

    if (res.type === 'success') {
      // Отправляем GTM-ивент
      this.sendGTMEvent(false, res.data.orderId)
      // Добавляем в "последние заказы"
      this.ADD_LAST_ORDER({
        ...this.input,
        products: depProducts,
        id: res.data.orderId,
        payment: this.PAYMENT.alltype.find(type => type.id === this.input.paymentTypeId),
        paidForDelivery: this.totalDeliveryPrice // или филиальную доставку
      })
      // Если нужна онлайн-оплата, собираем в список
      if (res.data.paymentTypeId === 5) {
        onlinePaymentOrders.push(res.data.orderId)
      }
    } else {
      // Если упало - прерываем цикл и возвращаем ошибку
      return { type: 'error', message: 'Один из заказов не создался' }
    }
  }

  // Если всё ок по всем филиалам, чистим корзину
  this.CLEAR_CART_PRODUCTS(this.ORDER.orderProducts)

  // Если нужно объединить несколько заказов на одну онлайн-оплату
  if (onlinePaymentOrders.length) {
    const linkUrl = await this.GET_ONLINE_PAY_LINK(onlinePaymentOrders)
    if (linkUrl) {
      this.$notify({
        group: 'appcenterbig',
        type: 'success',
        duration: 3000,
        title: 'Перенаправление',
        text: 'Вы будете перенаправлены на страницу для онлайн оплаты вашего заказа'
      })
      // Через 3 секунды редиректим на страницу оплаты
      setTimeout(() => {
        window.location = linkUrl
      }, 3000)
      return { type: 'success', redirectToPayment: true }
    }
  }

  return { type: 'success', redirectToPayment: false }
},

    //   отправляем отдельный заказ для каждого филиала
    async makeSeveralRequestsForOrder () {
      const onlinePaymentOrders = []
      const response = [] 
      const isSoloOrder = !(this.ORDER.orderDepartments.length > 1)
      for (const item of this.filterProducts) {
        // если время указано отправляем его, если нет, но пишем ближайшее доступное время полученное из апи
        this.input.deliveryTime = this.departmentDate[item.depId].date + ` ${this.departmentTime[item.depId]}:00`
        this.input.departmentId = item.depId
        const fullDep = this.GEO.info.depEntities.find(dep => dep.id === item.depId)
        const res = await this.SEND_ORDER({
          ...this.input,
          isSoloOrder,
          products: item.products,
          seoData: this.seoData,
          paidForDelivery: fullDep.totalDeliveryPrice
        })
        response.push(res)
        if (res.type === 'success') {
          this.sendGTMEvent(false, res.data.orderId)
          // добавляем в список последних заказов
          this.ADD_LAST_ORDER({
            ...this.input,
            products: item.products,
            id: res.data.orderId,
            payment: this.PAYMENT.alltype.find(type => type.id === this.input.paymentTypeId),
            paidForDelivery: fullDep.totalDeliveryPrice
          })
          // онлайн платежи для оплаты картой нужны айдишники заказов
          if (res.data.paymentTypeId === 5) {
            onlinePaymentOrders.push(res.data.orderId)
          }
        }
      }
      //   если какой то из заказов упал
      for (const res of response) {
        if (res.type !== 'success') {
          return res
        }
      }
      this.CLEAR_CART_PRODUCTS(this.ORDER.orderProducts)
      if (onlinePaymentOrders.length) {
        const linkUrl = await this.GET_ONLINE_PAY_LINK(onlinePaymentOrders)
        if (linkUrl) {
          this.$notify({
            group: 'appcenterbig',
            type: 'success',
            duration: 3000,
            title: 'Перенаправление',
            text: 'Вы будете перенаправлены на страницу для онлайн оплаты вашего заказа'
          })
          // перенаправляет на страницу онлайн оплаты
          await new Promise((resolve) => {
            setTimeout(() => {
              const link = document.createElement('a')
              link.href = linkUrl
              link.click()
              URL.revokeObjectURL(link.href)
              resolve()
            }, 3000)
          })
        }
      }
      return { type: 'success' }
    },

    parseStreet () {
      const data = this.GEO.info.address.street
      let dataArr = []
      let street = ''
      let home = ''
      let block = ''
      if (data.length > 5) {
        if (data.includes(', ')) {
          dataArr = data.split(',')
          if (dataArr.length === 2) {
            street = dataArr[0]
            home = dataArr[1]
          }
          if (dataArr.length === 3) {
            street = `${dataArr[0]},${dataArr[1]}`
            home = dataArr[2]
          }
        }
        if (home.includes('/')) {
          const homeArr = home.split('/')
          home = homeArr[0]
          block = homeArr[1]
        }
      }
      this.input.address.street = street
      this.input.address.house = home
      this.input.address.block = block
      this.input.address.geo = this.GEO.info.address.geo.join(', ')
    },

    verifyData (name, phone) {
      let nameValid = false
      let phoneValid = false
      if (
        name.length > 4 &&
        name.split(' ').length > 1
      ) {
        const data = name.split(' ')
        if (data[0].length >= 2 && data[1].length >= 2) {
          nameValid = true
        }
      }
      if (phone !== '+7') {
        phoneValid = true
      }
      if (nameValid && phoneValid) {
        return true
      }
      this.modals.nameDialog = true
      this.$notify({
        group: 'app',
        type: 'warn',
        duration: 5000,
        title: 'Введите фамилию, имя и телефон'
      })
      return false
    },

    checkAdress () {
      let valid = true
      if (this.input.address.addressTypeId === 1 || this.input.address.addressTypeId === 3) {
        if (!this.input.address.room) {
          valid = false
        }
      }
      return valid
    },
    checkIsCommentValid () {
      if (!this.comment) {
        return false
      }
      if (this.comment.length > 300) {
        return 'Максимальная длина 300 символов'
      }
      return true
    },
    sendGTMEvent (payment, orderId = 0) {
      const eventObj = {
        payment_type: this.PAYMENT.alltype.filter(type => type.id === this.input.paymentTypeId)[0].name,
        products: this.CART.all,
        orderId
      }
      if (payment) {
        this.$Ecomerce.addPaymentInfo(eventObj)
      } else {
        this.$Ecomerce.order_buy(eventObj)
      }
    },
    createSeoData () {
      let googleId = this.$cookies.get('_ga')
      const yandexId = this.$cookies.get('_ym_uid')
      if (googleId) {
        // убираем лишние буквы, оставляя только цифровое значение
        googleId = googleId.match(/(\d+\.\d+)$/)[1]
      }
      this.seoData = {
        ...this.UTM,
        user_id: this.$cookies.get('clientId') || null,
        metrika_client_id: yandexId ? yandexId.toString() : null,
        google_client_id: googleId || null
      }
    }
  },
  head () {
    return {
      title: 'Оформление заказа | Ayanmarket',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
             'Страница оформления заказа Ayanmarket. Звоните: 8 778 097-07-05 | Ayanmarket'
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
