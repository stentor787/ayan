
<template>
  <v-dialog
    v-model="mapDialog"
    max-width="750px"
    :content-class="$vuetify.breakpoint.xsOnly ? 'mobile-map' : ''"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    transition="slide-y-reverse-transition"
  >
   <v-card style="background-color:#f7f7f7;border-radius: 16px; max-height: 700px;">

  <v-card-title>
  <div class="map-title_text" style="font-size: 1.25rem;
    font-weight: 600;
    ">
    Адрес доставки
  </div>
  <span style="margin-left: 410px;" class="map-title_city" @click="$emit('editCity')">
          {{ GEO.activeCityTitle }} </span>

</v-card-title>

      <v-card-text class="pa-0" style="margin-top: -10px;">
        <div v-if="clientAdress.length" class="text-center">
          <v-chip-group
            v-model="addressItem"
            class="chip-center"
            column
            mandatory
          >
            <div v-for="item in clientAdress" :key="item.id">
              <v-chip
                v-if="
                  item.city.id == $cookies.get('cityId') ||
                    item.city == $cookies.get('cityId')
                "
                label
                class="white--text"
                color="#503CC3"
                :disabled="map.loading"
                @click="
                  input.search =
                    item.street + ', ' + item.house;
                  searchAddress();
                "
              >
                {{ item.street + ", " + item.house }}
              </v-chip>
            </div>
          </v-chip-group>
        </div>
      <v-col class="justify-center align-center">
        <div @click="!map.loading && searchAddress()" class="search-icon-input">
        <img src="../../assets/img/header/Vector (5).svg" alt="icon" >

        </div>
  <input
  placeholder="Введите адрес доставки"
    id="maptester3"
    ref="maptester3"
    v-model="input.search"
    style="
           margin-bottom: 20px;
    margin-left: 10px;
    font-size: 14px;
    padding: 0px 25px 0px 45px;
    border-radius: 34px;
    width: 700px;
    background-color: rgb(239, 236, 255);
    max-width: 1000px;
    height: 34px;"
    :label="$i18n.t('layout.search')"
    icon
    single-line
    outlined
    dense
    clearable
    hide-details
    prepend-inner-icon="mdi-magnify"
    class="save-btn"
    @click:clear="clearSearch"
    @keyup.enter="!map.loading && searchAddress()"
  />

  <!-- The updated button -->
  <button
    color="#5D4BD0"
    @click="!map.loading && searchAddress()"
    style="
       height: 34px;
    width: 700px;
    letter-spacing: 1.4px;
    font-weight: 700;
    margin-left: 10px;
    margin-bottom: 10px;
    border-radius: 34px;
    background-color: rgb(93, 75, 208);
    color: white;
    text-align: center;
    font-size: 12px;
    border: none;
    display: flex
;
    justify-content: center;
    align-items: center;
    "
  >
    Выбрать
  </button>
</v-col>

        <!-- <div class="body-2 red--text ml-3 mt-n2">
          {{ $i18n.t('layout.startEnter') }}
        </div> -->
        <div class="map_dialog__block">
          <div v-if="map.loading" class="map_dialog__progress">
            <v-progress-circular indeterminate size="64" color="#503CC3" />
          </div>
          <div
            v-if="!map.MarkerVisible"
            class="map_dialog__label elevation-4"
          >
            <v-icon color="#333">
              mdi-map-marker-outline
            </v-icon>
            {{ $i18n.t('layout.canChoose') }}
          </div>
          <div class="savemapbtn">
          <v-btn
  color="#503CC3"
  style="color:#fff; border-radius: 34px; width: 150px; font-size: 10px; height: 34px; margin-top: 10px;letter-spacing: 1.4px;
    font-weight: 700;"
  class="elevation-4 save-btn"
  :disabled="!addressAcive"
  @click="saveUserAddress"
>
  {{ $i18n.t('orderItem.save') }}
</v-btn>



          </div>
          <div class="mr-3 ml-3 map_dialog__canvas">
            <yandex-map
  :controls="map.controls"
  :zoom="map.zoom"
  :settings="map_settings"
  :coords="map.coords"
  :options="map.options"
  @click="mapClick"
  @map-was-initialized="initMap"
  style="width: 724px; height: 400px; margin-left:10px"
>
  <ymap-marker
    v-if="map.MarkerVisible"
    :coords="map.coords"
    marker-id="index"
  />
</yandex-map>

          </div>
          <div class="body-2 red--text ml-3 pb-2">
            <!-- {{ $i18n.t('layout.orClick') }} -->
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { loadYmap } from 'vue-yandex-maps'
export default {
  name: 'YandexMapDialog',
  props: {
    cityId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      mapDialog: false,
      addressItem: null,
      suggestView: {},
      mapInput: {
        street: '',
        geo: []
      },
      map: {
        zoom: 15,
        coords: [49.807754, 73.088504],
        controls: ['geolocationControl', 'zoomControl'],
        geolocation: {},
        MarkerVisible: false,
        loading: true,
        options: {
          restrictMapArea: false
        }
      },
      map_settings: {
        apiKey: '5535f356-6443-4552-a75c-355d8dfc69a4',
        lang: 'ru_RU',
        coordorder: 'latlong',
        version: '2.1'
      },
      loadYmap: false,
      input: {
        search: ''
      },
      myMap: {},
      MyYmaps: {},
      actualCity: 0,
      addressAcive: false,
      addresChanged: false // Является ли адрес авторезованным через яндекс
    }
  },
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE',
      PERSONAL: 'Personal/STATE'
    }),
    clientAdress () {
      const arr = this.PERSONAL.clientAdress.map(item => item.address)
      return arr.reduce((accum, adress) => {
        if (!accum.find(v => v.street === adress.street && v.house === adress.house)) {
          accum.push(adress)
        }
        return accum
      }, [])
    }
  },
  watch: {
    'input.search': function (val) {
      if (val === this.GEO.info.address.street && val !== '') {
        // Если адрес в поиске не отличается от того который выбран
        this.addressAcive = true
      } else if (this.addresChanged === true) {
        // Если есть авторизованный адрес
        this.addressAcive = true
        this.addresChanged = false
      } else {
        this.addressAcive = false
      }
    },
    mapDialog (show) {
      if (!show) {
        // если адрес не сохранен а город изменен то вызываем новую дефолтуню геоточку
        if (!this.GEO.info.address.save && this.actualCity !== this.$cookies.get('cityId')) {
          this.$cookies.remove('availableDepartments')
          this.$eventBus.$emit('changeDepartment', 5)
        }
      }
    },
    cityId (val) {
      if (val) {
        this.changeCityID(val)
      }
    }
  },
  mounted () {
    this.$eventBus.$on('editAddress', this.openmap)
  },
  methods: {
    ...mapMutations({
      SET_DEPARTMENT: 'GEO/SET_DEPARTMENT'
    }),
    ...mapActions({
      CHANGE_CITY: 'GEO/CHANGE_CITY',
      CHANGE_ADDRESS_STATUS: 'GEO/CHANGE_ADDRESS_STATUS',
      GET_DEPARTMENT_BY_ADDRESS: 'GEO/GET_DEPARTMENT_BY_ADDRESS',
      SAVE_ADDRESS: 'GEO/SAVE_ADDRESS',
      REFRESH_PRODUCT_DATA_WITH_NEW_DEPARTMENT:
        'Cart/REFRESH_PRODUCT_DATA_WITH_NEW_DEPARTMENT',
      GET_CLIENT_CART: 'Cart/GET_CLIENT_CART',
      CLEAR_CART_PRODUCTS: 'Cart/CLEAR_CART_PRODUCTS'
    }),
    restrictMap () {
      switch (this.$cookies.get('cityId')) {
        case 1:
          this.map.options.restrictMapArea = [
            [49.998097, 72.88492],
            [49.698621, 73.558862]
          ]
          break
        case 2:
          this.map.options.restrictMapArea = [
            [50.196238, 72.706821],
            [50.018276, 73.198793]
          ]
          break
        case 3:
          this.map.options.restrictMapArea = [
            [51.315195, 71.053339],
            [50.97939, 71.931419]
          ]
          break
      }
      if (
        typeof this.myMap !== 'undefined' &&
        typeof this.myMap.options !== 'undefined'
      ) {
        this.myMap.options.set(
          'restrictMapArea',
          this.map.options.restrictMapArea
        )
      }
    },
    async openmap () {
      this.actualCity = this.$cookies.get('cityId')
      if (this.GEO.info.address.street !== '') {
        this.map.MarkerVisible = true
        this.map.zoom = 17
        this.map.coords = JSON.parse(JSON.stringify(this.GEO.info.address.geo))
        this.input.search = JSON.parse(
          JSON.stringify(this.GEO.info.address.street)
        )
        this.addressAcive = true // Адрес активный
        this.addresChanged = false
      } else {
        this.getCityCoords()
      }
      this.restrictMap()
      this.mapDialog = true
      if (this.loadYmap === false) {
        // Храним 1 экземпляр
        this.loadYmap = true
      } else {
        return
      }
      await loadYmap({ ...this.map_settings, debug: true })
      /*eslint-disable*/
      this.MyYmaps = ymaps
    },
    mapClick (e) {
      this.addressAcive = false // Адрес активный
      this.addresChanged = false

      this.map.coords = e.get('coords')
      
      this.MyYmaps.geocode(this.map.coords).then( (result) => {
        const userAddress = result.geoObjects.get(0).properties.get('text')
        const userCoodinates = result.geoObjects.get(0).geometry.getCoordinates()
        const clearAdress = this.getClearAddress(userAddress)
        this.input.search = clearAdress 
        this.mapInput.street = clearAdress 
        this.mapInput.geo = userCoodinates

        const map = document.getElementById('maptester3')
        if (map.parentNode.querySelector('ymaps')) {
          map.parentNode.querySelector('ymaps').style.opacity = '0'
          map.parentNode.querySelector('ymaps').style.height = '0px'
        }
        // если выбран дом, то можно сохранить адрес
        if (clearAdress && clearAdress.split(',').length > 1) {
          this.addressAcive = true // Адрес активный
          this.addresChanged = true
        }
        const id = setTimeout(() => {
            this.map.MarkerVisible = true
            clearTimeout(id)
        }, 300)
      })
    },
    clearSearch () {
      this.map.MarkerVisible = false
      this.addresChanged = false
      this.addressAcive = false // Адрес не активный
    },

    initMap (map) {
      this.myMap = map
      this.map.loading = false
    },
    searchAddress () {
      const map = document.getElementById('maptester3')
      if (map.parentNode.querySelector('ymaps')) {
        map.parentNode.querySelector('ymaps').style.opacity = '0'
        map.parentNode.querySelector('ymaps').style.height = '0px'
      }

      let activeCityTitle = this.GEO.activeCityTitle
      if (this.GEO.activeCityTitle == 'Hур-Султан') {
        activeCityTitle = 'Астана'
      }
      this.MyYmaps.geocode(activeCityTitle + ' ' + this.input.search).then(
         (result) => {
          const userAddress = result.geoObjects.get(0).properties.get('text')
          const userCoodinates = result.geoObjects
            .get(0)
            .geometry.getCoordinates()
        this.map.coords = userCoodinates
        this.map.MarkerVisible = true
        const clearAdress = this.getClearAddress(userAddress)

        this.input.search = clearAdress 

        this.mapInput.street = clearAdress
        this.mapInput.geo = userCoodinates

        // если выбран дом, то можно сохранить адрес
        if (clearAdress && clearAdress.split(',').length > 1) {
          this.addressAcive = true // Адрес активный
          this.addresChanged = true
        }

        this.CHANGE_ADDRESS_STATUS(true)
          setTimeout(() => {
            this.map.zoom = 17
          }, 1200)
        }
      )
    },
    async saveUserAddress () {
      const response = await this.GET_DEPARTMENT_BY_ADDRESS(this.mapInput.geo)
      // условие:
      if (response && response.type !== 'error') {
        this.$notify({
          group: 'bigapp',
          type: 'warn',
          duration: 3000,
          title: this.$i18n.t('errors.atention'),
          text: this.$i18n.t('errors.changeAdress')
        })
        const department = response.data[0].id
        this.SET_DEPARTMENT(department)
        this.$eventBus.$emit('changeDepartment', this.GEO.departmentId)
        this.CHANGE_ADDRESS_STATUS(true)
        this.$cookies.set('departmentId', department)
        this.$cookies.set('addressTimeCreate', Math.floor(Date.now() / 1000))
        this.mapDialog = false
        this.SAVE_ADDRESS({
          street: this.mapInput.street,
          geo: this.mapInput.geo,
          department
        })
        if (this.$cookies.get('clientId')) {
          const request = {
            clientId: this.$cookies.get('clientId'),
            departmentIds: this.$cookies.get('availableDepartments')
          }
          this.GET_CLIENT_CART(request)
        } else {
          this.CLEAR_CART_PRODUCTS()
        }
      }
      // условие: выбранный адрес клиента не работает с доставкой :(
      else {
        this.SAVE_ADDRESS({
          street: '',
          geo: [],
          department: 0
        })
        this.$notify({
          group: 'app',
          type: 'error',
          duration: 10000,
          title: this.$i18n.t('errors.err'),
          text: this.$i18n.t('errors.wrongAdress')
        })
      }
    },
    getCityCoords () {
      if (this.GEO.cityId == 1) { this.map.coords = [49.807754, 73.088504] }
      if (this.GEO.cityId == 2) { this.map.coords = [50.056413, 72.955194] }
      if (this.GEO.cityId == 3) { this.map.coords = [51.146034, 71.452748] }
    },
    getClearAddress (data) {
      // Уберем минус слова и если улицы двойные разделенные через запятую, то уберем её
      const replaces_text = [
        'Казахстан, ',
        this.GEO.activeCityTitle + ', ',
        'Карагандинская область, ',
        'Нур-Султан (Астана), ',
        'район имени Казыбек би, '
      ]
      for (let i = 0; i < replaces_text.length; i++) {
        data = data.replace(replaces_text[i], '')
      }
      const arr = data.split(',')
      return arr.join(',')
    },
    changeCityID (id) {
      this.addresChanged = false
      if (
        typeof this.myMap !== 'undefined' &&
        typeof this.myMap.options !== 'undefined'
      ) {
        this.myMap.options.set('restrictMapArea', false) // Убираем ограничения зоны для перемещения центра карты
      }
      this.$cookies.set('cityId', id)
      this.$cookies.set(
        'departmentId',
        this.GEO.allCitiesListById[id].departments[0].id
      )
      this.CHANGE_CITY(id)
      this.map.MarkerVisible = false
      this.input.search = ''
      this.getCityCoords()
      this.$emit('cancel-dialog')
      this.$notify({
        group: 'bigapp',
        type: 'warn',
        duration: 3000,
        title: this.$i18n.t('errors.atention'),
        text: this.$i18n.t('errors.changeAdress')
      })
      this.mapInput.street = null
      this.mapInput.geo = []
      setTimeout(() => {
        this.restrictMap()
      }, 1500) // Включаем ограничения карты после анимации перемещения на новый центр карты
    }
  }
}
</script>
<style lang="scss">
@import './style';
.search-icon-input{
  margin: 7px 7px 7px 20px;
  position: absolute;
}
</style>