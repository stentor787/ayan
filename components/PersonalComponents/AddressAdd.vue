<template>
  <v-dialog v-model="value" max-width="450px" persistent @click:outside="$emit('closedialog')">
    <v-form>
      <v-card>
        <v-card-title class="justify-center">
          {{ $i18n.t("personalOffice.addAdress") }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="pa-1">
              <v-select
                v-model="inputData.addressTypeId"
                :items="types"
                item-text="text"
                item-value="id"
                :label="$i18n.t('personalOffice.adressType')"
                color="#503CC3"
                hide-details
                outlined
              />
            </v-col>
            <v-col cols="12" class="pa-1">
              <v-text-field
                v-model="inputData.street"
                :label="$i18n.t('personalOffice.street')"
                color="#503CC3"
                hide-details
                outlined
                readonly
                @click="$eventBus.$emit('editAddress', true)"
              />
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-text-field
                v-model="inputData.house"
                :label="$i18n.t('personalOffice.house')"
                color="#503CC3"
                hide-details
                outlined
                @click="$eventBus.$emit('editAddress', true)"
              />
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-text-field
                v-model="inputData.block"
                :label="$i18n.t('personalOffice.korpus')"
                color="#503CC3"
                hide-details
                outlined
                @click="$eventBus.$emit('editAddress', true)"
              />
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-text-field v-model="inputData.stairs" :label="$i18n.t('personalOffice.entrance')" color="#503CC3" hide-details outlined />
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-text-field v-model="inputData.level" :label="$i18n.t('personalOffice.floor')" color="#503CC3" hide-details outlined />
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-text-field v-model="inputData.code" label="Домофон" color="#503CC3" hide-details outlined />
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-text-field v-model="inputData.room" :label="$i18n.t('personalOffice.apartment')" color="#503CC3" hide-details outlined />
            </v-col>
          </v-row>
          <v-btn color="#503CC3" class="white--text mt-5" block @click="addAddress">
            {{ $i18n.t('personalOffice.add') }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    input: {
      type: Object,
      default: null
    },
    types: {
      type: Array,
      default: null
    },
    client: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      inputData: {
        id: 1,
        addressTypeId: 0,
        street: null,
        house: null,
        block: null,
        level: null,
        stairs: null,
        code: null,
        room: null,
        city: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE'
    })
  },
  watch: {
    'GEO.info.address.street': function () {
      this.parseStreet()
    }
  },
  methods: {
    ...mapActions({
      add: 'Personal/addClientAdress'
    }),
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
        }
        if (home.includes('/')) {
          const homeArr = home.split('/')
          home = homeArr[0]
          block = homeArr[1]
        }
      }
      this.inputData.street = street
      this.inputData.house = home
      this.inputData.block = block
    },
    async addAddress () {
      this.inputData.city = this.$cookies.get('cityId')
      const result = await this.add({ input: this.inputData, clientId: this.$cookies.get('clientId') })
      if (result.type === 'success') {
        this.$emit('updateaddress')
        this.$emit('closedialog')
      } else {
        this.$notify({
          group: 'app',
          type: 'error',
          duration: 10000,
          title: 'Ошибка',
          text: result.text
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
