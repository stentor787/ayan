<template>
  <div>
    <!-- модалка с данными пользователя -->
    <v-dialog
      v-model="modals.nameDialog"
      width="50%"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      @click:outside="modals.nameDialog = false"
    >
      <v-card>
        <v-card-title>
          <span class="title-text">{{ endClient ? $i18n.t('order.data') : 'Данные заказчика' }}</span>
          <v-spacer />
          <v-btn icon color="#503CC3" @click="modals.nameDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="text-style2">
            {{ $i18n.t('order.passport') }}
          </div>
          <div class="inputs-block">
            <div class="inputs-block_item">
              <v-text-field
                v-if="endClient"
                v-model.trim="input.endClientDto.nameUser"
                label="Имя и Фамилия"
                :rules="[rules.required]"
                outlined
                dense
                class="order_input"
                color="#503CC3"
                hide-details
                background-color="#F4F6FA"
              />
              <v-text-field
                v-else
                v-model.trim="input.nameUser"
                label="Имя и Фамилия"
                :rules="[rules.required]"
                outlined
                dense
                class="order_input"
                color="#503CC3"
                hide-details
                background-color="#F4F6FA"
              />
              <v-text-field
                v-if="endClient"
                v-model.trim="input.endClientDto.phoneUser"
                v-mask="'+7 ### ### ## ##'"
                :label="$i18n.t('order.phone')"
                :rules="[rules.required, rules.PHONE]"
                outlined
                dense
                class="order_input"
                color="#503CC3"
                hide-details
                background-color="#F4F6FA"
              />
              <v-text-field
                v-else
                v-model.trim="input.phoneUser"
                v-mask="'+7 ### ### ## ##'"
                :label="$i18n.t('order.phone')"
                :rules="[rules.required, rules.PHONE]"
                outlined
                dense
                class="order_input"
                color="#503CC3"
                hide-details
                background-color="#F4F6FA"
              />
            </div>

            <div v-if="showSMSInput" class="inputs-block_item2">
              <v-text-field
                v-model.trim="sms"
                v-mask="'######'"
                :label="$i18n.t('order.sms')"
                :rules="[rules.required]"
                outlined
                dense
                class="order_input"
                color="#503CC3"
                hide-details
                background-color="#F4F6FA"
              />
              <v-btn
                small
                dark
                color="#503CC3"
                class="mt-2"
                @click="confirmTelefon()"
              >
                {{ $i18n.t('order.smsVerify') }}
              </v-btn>
            </div>
          </div>
          <div class="btn-block">
            <v-btn
              dark
              color="#503CC3"
              class="mt-2"
              @click="closeModalName()"
            >
              {{ $i18n.t('orderItem.save') }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- модалка с адресом -->
    <v-dialog
      v-model="modals.adressDialog"
      width="60%"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      @click:outside="modals.adressDialog = false"
    >
      <v-card>
        <v-card-title>
          <span class="title-text"> {{ $i18n.t('order.adressDelivery') }}</span>
          <v-spacer />
          <v-btn icon color="#503CC3" @click="modals.adressDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p class="text-style2">
            {{ $i18n.t('order.adressDeliveryAdd') }}
          </p>
          <v-form ref="form">
            <!-- улица и дом -->
            <div class="adress">
              <v-text-field
                v-model="input.address.street"
                :label="$i18n.t('personalOffice.street')"
                :rules="[rules.required]"
                outlined
                dense
                class="order_input"
                color="#503CC3"
                hide-details
                background-color="#F4F6FA"
                readonly
              />
              <v-text-field
                v-model="input.address.house"
                :label="$i18n.t('personalOffice.house')"
                :rules="[rules.required]"
                outlined
                dense
                readonly
                class="order_input"
                color="#503CC3"
                hide-details
                background-color="#F4F6FA"
              />

              <v-select
                v-model="input.address.addressTypeId"
                :items="addressType"
                item-text="text"
                item-value="id"
                :label="$i18n.t('order.adress')"
                :rules="[rules.required]"
                item-color="#503CC3"
                outlined
                dense
                class="order_input adress_select"
                color="#503CC3"
                hide-details
                background-color="#F4F6FA"
                @change="changeAddressType"
              />
              <div
                v-if="
                  input.address.addressTypeId === 1 ||
                    input.address.addressTypeId === 3
                "
                class="adress_floor"
              >
                <v-text-field
                  v-model="input.address.level"
                  :label="$i18n.t('personalOffice.floor')"
                  class="order_input"
                  color="#503CC3"
                  hide-details
                  outlined
                  background-color="#F4F6FA"
                  :rules="[rules.notEqualZero(input.address.level)]"
                  dense
                />
                <v-text-field
                  v-model="input.address.stairs"
                  v-mask="'###'"
                  :label="$i18n.t('personalOffice.entrance')"
                  outlined
                  class="order_input"
                  color="#503CC3"
                  hide-details
                  background-color="#F4F6FA"
                  :rules="[rules.notEqualZero(input.address.stairs)]"
                  dense
                />
              </div>
              <div v-if="input.address.addressTypeId !== 2" class="adress_code">
                <v-text-field
                  v-if="input.address.addressTypeId === 1"
                  v-model="input.address.code"
                  v-mask="'#######'"
                  label="Домофон"
                  outlined
                  class="order_input"
                  color="#503CC3"
                  hide-details
                  background-color="#F4F6FA"
                  :rules="[rules.notEqualZero(input.address.code)]"
                  dense
                />
                <v-text-field
                  v-if="input.address.addressTypeId === 1"
                  v-model="input.address.room"
                  :label="$i18n.t('personalOffice.apartment')"
                  outlined
                  dense
                  class="order_input"
                  color="#503CC3"
                  hide-details
                  background-color="#F4F6FA"
                  :rules="[
                    rules.required,
                    rules.notEqualZero(input.address.room)
                  ]"
                />
                <v-text-field
                  v-if="input.address.addressTypeId === 3"
                  v-model="input.address.room"
                  :label="$i18n.t('personalOffice.office')"
                  outlined
                  dense
                  class="order_input"
                  color="#503CC3"
                  hide-details
                  background-color="#F4F6FA"
                />
              </div>
            </div>
          </v-form>
          <div class="btn-block">
            <v-btn
              dark
              color="#503CC3"
              class="mt-2"
              @click="modals.adressDialog = false"
            >
              {{ $i18n.t('order.saveAndGo') }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- модалка с информацией пока не нужна-->
    <!-- <v-dialog
      v-model="modals.infoDialog"
      width="60%"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      @click:outside="modals.infoDialog = false"
    >
      <v-card>
        <v-card-title>
          <span class="title-text">{{ $i18n.t('order.deliveryOptions') }}</span>
          <v-spacer />
          <v-btn icon color="#503CC3" @click="modals.infoDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p>
            {{ $i18n.t('order.deliveryOptions1') }}
          </p>
          <div class="inf">
            <v-icon color="#503CC3" large>
              mdi-home-clock
            </v-icon>
            <div>
              <p class="inf_title">
                {{ $i18n.t('order.faster') }}
              </p>
              <p>{{ $i18n.t('order.fasterText') }}</p>
            </div>
          </div>
          <div class="inf">
            <v-icon color="#503CC3" large>
              mdi-truck-check
            </v-icon>
            <div>
              <p class="inf_title">
                {{ $i18n.t('order.together') }}
              </p>
              <p>{{ $i18n.t('order.togetherText') }}</p>
            </div>
          </div>
          <v-btn
            dark
            color="#503CC3"
            class="mt-2"
            @click="modals.infoDialog = false"
          >
            {{ $i18n.t('cart.close') }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    input: {
      type: Object,
      default: () => {}
    },
    modals: {
      type: Object,
      default: () => {}
    },
    validate: {
      type: Boolean,
      default: false
    },
    tel: {
      type: Boolean,
      default: false
    },
    endClient: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showSMSInput: false,
      sms: '',
      addressType: [
        { id: 1, text: 'Квартира' },
        { id: 3, text: 'Офис' },
        { id: 2, text: 'Частный дом' }
      ],
      phoneUser: '',
      surnameUser: '',
      nameUser: '',
      rules: {
        required: value => !!value || this.$i18n.t('order.mustFill'),
        notEqualZero: (value) => {
          if (value === '0') {
            return 'Поле не может быть равно 0'
          } else {
            return true
          }
        },
        PHONE: (data) => {
          if (!data) {
            return false
          }
          data = data.replace(/[^0-9]/g, '')
          if (data.length < 11) {
            return false
          }
          return true
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      CART: 'Cart/STATE',
      GEO: 'GEO/STATE',
      PAYMENT: 'Payment/STATE',
      PERSONAL: 'Personal/STATE',
      ORDER: 'Order/STATE'
    })
  },
  watch: {
    validate (val) {
      if (val) {
        const id = setTimeout(() => {
          this.$refs.form.validate()
          clearTimeout(id)
        }, 100)
      }
    }
  },
  methods: {
    ...mapActions({
      CREATE_CLIENT_CODE: 'SMS/CREATE_CLIENT_CODE',
      CODE_AUTH: 'SMS/CODE_AUTH'
    }),
    async confirmTelefon () {
      if (!this.sms) {
        return
      }
      const payload = {
        phone: this.input.phoneUser.replaceAll(' ', ''),
        code: this.sms
      }
      const response = await this.CODE_AUTH(payload)
      if (response.type === 'error') {
        this.$notify({
          group: 'appcenterbig',
          type: 'error',
          duration: 3000,
          title: 'Неверный СМС-код подтверждения номера'
        })
      } else {
        this.$emit('confirm')
        this.modals.nameDialog = false
        this.showSMSInput = false
        this.$notify({
          group: 'appcenterbig',
          type: 'success',
          duration: 3000,
          title: 'Телефон подтвержден'
        })
      }
      this.codeSended = false
    },
    // если пользователь незареган то подтвержадем телефон
    closeModalName () {
      if (this.PERSONAL.isLoggin || this.tel) {
        this.modals.nameDialog = false
      } else if (this.input.phoneUser !== '+7') {
        this.showSMSInput = true
        if (this.codeSended) {
          return
        }
        this.codeSended = true
        const payload = {
          name: this.input.nameUser,
          surname: '',
          phone: this.input.phoneUser.replaceAll(' ', '')
        }
        this.CREATE_CLIENT_CODE(payload)
      }
    },
    changeAddressType () {
      switch (this.input.address.addressTypeId) {
        case 2:
          this.input.address.room = ''
          this.input.address.block = ''
          this.input.address.code = ''
          this.input.address.level = ''
          this.input.address.stairs = ''
          break
        case 3:
          this.input.address.code = ''
          break
      }
    }
  }
}
</script>
<style lang="scss">
.inputs-block_item{
  .error--text{
    color: white !important;
    .v-input__slot{
      background-color: #E61E78 !important;
    }
   }
}
.adress{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    .error--text{
    color: white !important;
    .v-input__slot{
      background-color: #E61E78 !important;
    }
   }
    &_select{
       max-width: 200px !important;
       @media screen and (max-width: 1200px) {
        max-width: 100% !important
      }
    }
    &_floor {
        display: flex;
        width: 100%;
        gap: 10px;
      }
    &_code {
        display: flex;
        gap: 10px;
        width: 100%;
      }
}
.btn-block{
  display: flex;
  justify-content: center;
}
</style>
