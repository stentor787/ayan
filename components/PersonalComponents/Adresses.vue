<template>
  <div>
    <v-simple-table>
      <thead>
        <tr>
          <th class="pa-1 table_th">
            {{ $i18n.t("personalOffice.street") }}
          </th>
          <th class="pa-1 table_th">
            {{ $i18n.t("personalOffice.house") }}
          </th>
          <th class="pa-1 table_th">
            {{ $i18n.t("personalOffice.korpus") }}
          </th>
          <th class="pa-1 table_th">
            {{ $i18n.t("personalOffice.floor") }}
          </th>
          <th class="pa-1 table_th">
            {{ $i18n.t("personalOffice.entrance") }}
          </th>
          <th class="pa-1 table_th">
            {{ $i18n.t("personalOffice.code") }}
          </th>
          <th class="pa-1 table_th">
            {{ $i18n.t("personalOffice.apartment") }}
          </th>
          <th class="pa-1 table_th">
            {{ $i18n.t("personalOffice.type") }}
          </th>
          <th class="pa-1 table_th">
            {{ $i18n.t("personalOffice.city") }}
          </th>
          <th class="pa-1 table_th">
            {{ $i18n.t("personalOffice.delete") }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in addresses" :key="item.id">
          <td class="pa-1">
            {{ item.address.street || '-' }}
          </td>
          <td class="pa-1">
            {{ item.address.house || '-' }}
          </td>
          <td class="pa-1">
            {{ item.address.block || '-' }}
          </td>
          <td class="pa-1">
            {{ item.address.level || '-' }}
          </td>
          <td class="pa-1">
            {{ item.address.stairs || '-' }}
          </td>
          <td class="pa-1">
            {{ item.address.code || '-' }}
          </td>
          <td class="pa-1">
            {{ item.address.room || '-' }}
          </td>
          <td class="pa-1">
            {{ item.address.addressType.name || '-' }}
          </td>
          <td class="pa-1">
            {{ item.address.city.name || getCity(item.address.city) }}
          </td>
          <td class="pa-1">
            <v-btn color="error" icon @click="$emit('deleteaddress', item.address.id)">
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <div class="text-right">
      <v-btn fab color="#503CC3" small class="ma-12 white--text" @click="edit = true">
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </div>
    <d-address-add :value="edit" :types="types" :input="input" @closedialog="edit = false" @updateaddress="$emit('updateaddress')" />
  </div>
</template>
<script>
import DAddressAdd from './AddressAdd'
export default {
  components: {
    DAddressAdd
  },
  props: {
    addresses: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      types: [
        { id: 1, text: 'Квартира' },
        { id: 3, text: 'Офис' },
        { id: 2, text: 'Частный дом' }
      ],
      input: {},
      edit: false
    }
  },
  methods: {
    getCity (id) {
      switch (id) {
        case 1:
          return 'Караганда'
        case 2:
          return 'Темиртау'
        case 3:
          return 'Нур-Султан'
        default:
          return '-'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
