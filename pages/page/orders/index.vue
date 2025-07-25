<template>
  <div v-if="loading" class="loader-big">
    <v-progress-circular indeterminate color="#503CC3" />
  </div>
  <v-container v-else class="pr-0 pl-0">
    <section v-if="personal !== null && PERSONAL.isLoggin === true">
      <!-- шапка страницы с информацией -->
      <div v-if="$route.name === 'page-orders'" class="conteiner">
        <div class="adress">
          <div class="adress_data">
            <p class="adress_data__text">
              {{ $i18n.t("personalOffice.deliveryAdres") }}
            </p>
            <p v-if="adress" class="adress_data__adress">
              {{ adress.address.city.name + ', ' + adress.address.street + ', ' + adress.address.house }}
            </p>
            <v-btn v-if="!showAdress" text x-small class="white--text" @click="showAdress=true">
              {{ $i18n.t("personalOffice.open1") }}
            </v-btn>
            <v-btn v-else text x-small class="white--text" @click="showAdress=false">
              {{ $i18n.t("personalOffice.open2") }}
            </v-btn>
          </div>
          <div class="adress_data">
            <p class="adress_data__text">
              {{ personal.name + '  ' + personal.surname + ' ' + personal.middlename }}
            </p>
            <p class="adress_data__adress">
              {{ personal.phone }}
            </p>
            <v-btn text x-small class="white--text">
              {{ $i18n.t("personalOffice.deleteAcc") }}  <v-icon
                right
                dark
              >
                mdi-trash-can-outline
              </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <!-- блок с заказами -->
      <div v-if="!showAdress" class="orders" :class="$route.name !== 'page-orders' && 'history-orders'">
        <div v-if="$route.name === 'page-orders'" class="orders_header">
          <h2 class="orders_title">
            {{ $i18n.t("personalOffice.history") }}
          </h2>
          <v-tooltip left color="#e9e9e9" content-class="custom-tooltip">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="#503CC3"
                :loading="loadHistory"
                class="orders_title__btn"
                v-bind="attrs"
                v-on="on"
                @click="refreshOrders()"
              >
                <v-icon>
                  mdi-refresh
                </v-icon>
              </v-btn>
            </template>
            <span class="orders_header__tooltip">{{ $i18n.t('personalOffice.refresh') }}</span>
          </v-tooltip>
        </div>
        <d-orders
          :orders="orders"
          @moreinfo="moreinfo"
        />
      </div>
      <!-- блок с адресами -->
      <div v-else class="orders">
        <h2 class="orders_title">
          {{ $i18n.t("personalOffice.adresses") }}
        </h2>
        <d-adresses
          :addresses="addresses"
          @updateaddress="updateaddress()"
          @deleteaddress="deleteAddress"
        />
      </div>
      <d-order-item
        :value="dialog"
        :item="order"
        @closedialog="dialog = false"
        @getorders="getData()"
      />
    </section>
    <v-row v-else>
      <v-col cols="12">
        <v-icon>
          mdi-smile
        </v-icon>
        {{ $i18n.t("personalOffice.logIn") }}
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import DAdresses from '@/components/PersonalComponents/Adresses'
import DOrders from '@/components/PersonalComponents/Order'
import DOrderItem from '@/components/PersonalComponents/OrderItem'
export default {
  components: {
    DAdresses,
    DOrders,
    DOrderItem
  },
  data () {
    return {
      addresses: [],
      adress: {},
      personal: null,
      loading: true,
      rendered: false,
      orders: [],
      order: {},
      dialog: false,
      showAdress: false,
      loadHistory: false
    }
  },
  computed: {
    ...mapGetters({
      PERSONAL: 'Personal/STATE'
    })
  },
  watch: {
    'PERSONAL.isLoggin': async function () {
      this.loading = true
      if (this.$cookies.get('TOKEN')) {
        await this.getData()
      }
      this.loading = false
    }
  },
  async mounted () {
    this.$eventBus.$on('getOrdersHistory', () => {
      this.refreshOrders()
    })
    this.loading = true
    if (this.$cookies.get('TOKEN')) {
      await this.getData()
    }
    this.loading = false
  },
  methods: {
    ...mapActions({
      getClientAdress: 'Personal/getClientAdress',
      clientAdDelete: 'Personal/deleteClientAdress',
      getClient: 'Personal/getClient',
      getOrders: 'Personal/getClientOrders',
      tokenInfo: 'Personal/tokenInfo'
    }),
    async getData () {
      // иначе функция срабатывает дважды, при маунте и при вотчере
      if (this.rendered) {
        return
      }
      this.rendered = true
      if (!this.PERSONAL.tokenInfo) {
        await this.tokenInfo()
      }
      this.$cookies.set('clientId', this.PERSONAL.tokenInfo)
      this.clientId = this.PERSONAL.tokenInfo
      if (!this.PERSONAL.clientAdress.length) {
        await this.getClientAdress(this.clientId)
      }
      this.adress = this.PERSONAL.clientAdress[0]
      this.addresses = this.PERSONAL.clientAdress.filter(item => !item.address.deleted)
      if (!this.PERSONAL.clientSingle.name) {
        await this.getClient(this.clientId)
      }
      this.personal = this.PERSONAL.clientSingle
      await this.getOrders(this.clientId)
      this.orders = this.PERSONAL.clientOrders
      this.rendered = false
    },
    async refreshOrders () {
      this.loadHistory = true
      await this.getOrders(this.clientId)
      this.orders = this.PERSONAL.clientOrders
      this.loadHistory = false
    },
    async deleteAddress (id) {
      const response = await this.clientAdDelete(id)
      if (response.type !== 'success') {
        this.$notify({
          group: 'app',
          type: 'error',
          duration: 1000,
          title: 'Ошибка при удалении адреса',
          text: response.data.message
        })
      } else {
        this.getData()
      }
    },
    getContainerClass () {
      return this.$route.path === '/page/personal-office/' || this.$route.path === '/page/personal-office'
        ? 'personal-container'
        : 'conteiner'
    },
    moreinfo (val) {
      this.dialog = !this.dialog
      this.order = val
    },
    async updateaddress () {
      this.loading = true
      await this.getClientAdress(this.clientId)
      this.addresses = this.PERSONAL.clientAdress
      this.loading = false
    }
  },
  head () {
    return {
      title: 'История заказов',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'История заказов пользователя супермаркета Ayanmarket'
        }
      ],
      link: [{ rel: 'canonical', href: `https://ayanmarket.kz${this.$route.path}` }]
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
