<template>
  <v-card v-if="!loading" class="personal">
    <section v-if="personal && showMenu" class="personal_left-box">
      <div class="personal_menu-item-box" :class="list === 0 && !smallScreen ? 'active-link' : ''">
        <div v-if="smallScreen" class="personal_mob-menu-item">
          <img class="personal_avatar" src="@/assets/img/user.jpg" alt="user" width="80">
          <div>
            <p class="personal_text">
              {{ personal.name }} {{ personal.surname }}
            </p>
            <p>{{ personal.phone }}</p>
            <v-btn text color="#3C4DE6" small class="pl-0" @click="changeData(0)">
              Изменить
            </v-btn>
          </div>
        </div>
        <div
          v-else
          class="personal_menu-item"
          @click="changeData(0)"
        >
          <v-icon color="#503CC3" :x-large="smallScreen">
            mdi-account
          </v-icon>
          <p class="personal_text">
            Профиль
          </p>
        </div>
      </div>

      <div
        v-for="item in items"
        :key="item.title"
        class="personal_menu-item-box"
        :class="list === item.id && !smallScreen ? 'active-link' : ''"
      >
        <div
          class="personal_menu-item"
          @click="changeData(item.id)"
        >
          <v-icon color="#503CC3" :x-large="smallScreen">
            {{ item.icon }}
          </v-icon>
          <div v-if="item.data && smallScreen" class="pb-10">
            <p class="personal_text">
              {{ item.title }}
            </p>
            <p class="personal_text2">
              Активных заказов {{ personal.activeOrders }}
            </p>
            <p class="mb-0">
              Всего оформлено заказов {{ personal.allOrders }}
            </p>
          </div>
          <p v-else class="personal_text">
            {{ item.title }}
          </p>
        </div>
      </div>
      <v-btn
        v-if="smallScreen"
        text
        color="#3C4DE6"
        small
        class="pl-0"
        @click="logout()"
      >
        Выход из профиля
      </v-btn>
    </section>
    <!-- Меняющиеся блоки  -->
    <section v-if="personal && showData" class="personal_right-box">
      <div v-if="smallScreen" class="personal_header">
        <v-btn icon>
          <v-icon color="white" @click="closeData()">
            mdi-arrow-left-bold
          </v-icon>
        </v-btn>
        <span>{{ textForSmallScreen }}</span>
      </div>
      <DPersonal v-if="list === 0" :input="personal" @close="closeData()" />
      <BalanceCard v-if="list === 1" @close="closeData()" />
      <OrderHistory v-show="list === 2" @close="closeData()" />
      <CreditCards v-if="list === 3" @close="closeData()" />
    </section>
    <!-- Незарегистрированный -->
    <div v-if="!personal" class="not-regist">
      <p class="not-regist_text">
        Вы не зарегистрированы, войдите чтобы пользоваться личным кабинетом
      </p>
      <v-btn
        dark
        color="#503CC3"
        @click="openLogin()"
      >
        Войти
      </v-btn>
    </div>
    <LoyaltyRemindModal :show.sync="loyaltyRemind" @registrate="list=1; loyaltyRemind=false" />
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DPersonal from '@/components/PersonalComponents/Personal'
import BalanceCard from '@/components/PersonalComponents/BalanceCard'
import CreditCards from '@/components/PersonalComponents/CreditCards'
import LoyaltyRemindModal from '@/components/PersonalComponents/Modals/LoyaltyRemindModal'
import OrderHistory from '@/pages/page/orders/index.vue'

export default {
  components: {
    DPersonal,
    BalanceCard,
    CreditCards,
    OrderHistory,
    LoyaltyRemindModal
  },
  data () {
    return {
      list: 0,
      personal: null,
      clientId: 0,
      loading: true,
      rendered: false,
      showMenu: true,
      showData: true,
      smallScreen: false,
      items: [
        { id: 2, title: 'Мои заказы', icon: 'mdi-truck-check', data: true },
        { id: 1, title: 'Клуб AyanMarket', icon: 'mdi-percent-circle' },
        { id: 3, title: 'Мои карты оплаты', icon: 'mdi-card-bulleted-outline' }
      ],
      mini: false,
      loyaltyRemind: false
    }
  },
  computed: {
    ...mapGetters({
      PERSONAL: 'Personal/STATE'
    }),
    textForSmallScreen () {
      const text = this.items.find(item => item.id === this.list)
      return text?.title || 'Профиль'
    }
  },
  watch: {
    'PERSONAL.isLoggin': async function () {
      this.loading = true
      if (!this.$cookies.get('TOKEN')) {
        this.personal = null
      } else {
        await this.rerender()
      }
      this.loading = false
    }
  },
  async mounted () {
    this.loading = true
    if (this.$vuetify.breakpoint.xsOnly) {
      this.smallScreen = true
      this.showData = false
    }
    if (this.$cookies.get('TOKEN')) {
      await this.rerender()
    }
    this.loading = false
  },
  methods: {
    ...mapActions({
      getClient: 'Personal/getClient',
      tokenInfo: 'Personal/tokenInfo',
      LOG_IN_OUT: 'Personal/LOG_IN_OUT',
      CLEAR_CART_PRODUCTS: 'Cart/CLEAR_CART_PRODUCTS'
    }),
    async rerender () {
      // иначе функция срабатывает дважды, при маунте и при вотчере
      if (this.rendered) {
        return
      }
      this.rendered = true
      if (!this.PERSONAL.tokenInfo) {
        await this.tokenInfo()
      }
      if (!this.PERSONAL.tokenInfo) {
        return
      }
      this.$cookies.set('clientId', this.PERSONAL.tokenInfo)
      this.clientId = this.PERSONAL.tokenInfo
      if (!this.PERSONAL.clientSingle.name) {
        await this.getClient(this.clientId)
      }
      this.personal = JSON.parse(JSON.stringify(this.PERSONAL.clientSingle))
      this.loyaltyRemind = !this.personal.isLoyalty
      this.rendered = false
    },
    changeData (id) {
      this.list = id
      if (this.smallScreen) {
        this.showMenu = false
        this.showData = true
      }
    },
    closeData () {
      this.showMenu = true
      this.showData = false
    },
    openLogin () {
      this.$eventBus.$emit('openDialog', true)
    },
    async logout () {
      this.$cookies.remove('TOKEN')
      this.$cookies.remove('clientId')
      localStorage.removeItem('refToken')
      await this.LOG_IN_OUT(false)
      this.CLEAR_CART_PRODUCTS()
    }
  }
}
</script>

<style lang="scss">
@import "./style";
</style>
