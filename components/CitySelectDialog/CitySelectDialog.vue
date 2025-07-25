<template>
  <div v-if="cityDialog" class="dialog-overlay-ggg" @click="handleOutsideClick">
    <div class="dialog-ggg" :class="{ 'mobile-dialog-ggg': isMobile }">
      <div class="text">Уточните город доставки</div>
      <div class="city-name" @click="toggleCityList">
        <img
          class="city-icon"
          src="../../assets/img/header/Vector (6).svg"
          alt=""
        />

        {{ selectedCity ? selectedCity.name : "Выберите город" }}
      </div>
      <div class="icon"></div>
      <div class="button-container-2">
        <button class="button-choose" @click="confirmCitySelection">
          Выбрать
        </button>
        <button class="button-cancel" @click="handleOutsideClick">
          Отмена
        </button>
      </div>

      <!-- City list that appears under the selected city -->
      <div v-if="showCityList" class="city-list-dropdown">
        <div
          v-for="item in filteredCities"
          :key="item.id"
          :class="[
            'city-list-item-ggg',
            { 'active-ggg': selectedCity && selectedCity.id === item.id },
          ]"
          @click="selectCity(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from "vuex";

export default {
  props: {
    cityDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showCityList: false, // Flag to show the city list
      selectedCity: null, // Current selected city
    };
  },
  computed: {
    ...mapGetters({
      GEO: "GEO/STATE", // Mapping state for city data
    }),
    // Filtered list of cities excluding the currently selected city
    filteredCities() {
      return this.GEO.allCitiesList.filter(
        (city) => city.id !== (this.selectedCity ? this.selectedCity.id : null)
      );
    },
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  watch: {
    // Watch for changes in the cityId in global state
    "GEO.cityId": function (newCityId) {
      const city = this.GEO.allCitiesList.find((item) => item.id === newCityId);
      if (city) {
        this.selectedCity = city; // Set the selected city
      }
    },
  },
  mounted() {
    // Set the selected city on component mount based on the global state
    const defaultCity = this.GEO.allCitiesList.find(
      (item) => item.id === this.GEO.cityId
    );
    if (defaultCity) {
      this.selectedCity = defaultCity; // Set the default city
    }
  },
  methods: {
    toggleCityList() {
      // Toggle visibility of the city list
      this.showCityList = !this.showCityList;
    },
    selectCity(city) {
      // Set the selected city
      this.selectedCity = city;
      this.showCityList = false; // Close the city list after selection
    },
    confirmCitySelection() {
      if (this.selectedCity) {
        // Emit the selected city to the parent component
        this.$emit("change-city-id", null, this.selectedCity.id);
        this.$eventBus.$emit("change-city", this.selectedCity.id);
        this.$emit("confirm-city", this.selectedCity); // Send the selected city to the parent component
      }
    },
    handleOutsideClick(event) {
      if (event.target === event.currentTarget) {
        // Close the dialog if the overlay is clicked
        this.$emit("cancel-dialog", event);
      }
    },
  },
};
</script>
<style lang="scss">
.dialog-overlay-ggg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure the overlay is on top of everything */
}

.dialog-ggg {
  height: 160px;
  background-color: #f7f7f7;
  border-radius: 16px;
  max-width: 323px;
  width: 100%;
  padding: 20px;
  z-index: 10000;
  position: relative;
}

.city-name {
  font-size: 20px;
  font-weight: bold;
  color: #5d4bd0;
  position: relative;
  cursor: pointer;
  text-transform: uppercase; /* Add uppercase transformation */
}

.city-name::after {
  content: "";
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 92%;
  height: 1px;
  background-color: #5d4bd0;
}

.city-list-dropdown {
  margin-top: -10px;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 107px;
  width: 100%;
  position: absolute;
  top: 90px;
  left: 0;
}

.city-list-item-ggg {
  padding-left: 21px;
  font-weight: 700;
  font-size: 16px;
  color: #868591;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.city-list-item-ggg::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 21px;
  width: 80%;
  height: 1px;
  background-color: #b3b3b3;
}

.city-list-item-ggg:hover {
  background-color: #f1f1f1; /* Light background color on hover */
}

.city-list-item-ggg.active-ggg {
  font-weight: bold;
  color: #5d4bd0;
}

.text {
  font-size: 14px;
  color: #333;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.button-container-2 {
  display: flex;
  gap: 20px;
  margin-top: 32px;
}

.button-choose {
  width: 127px;
  height: 34px;
  background-color: #5d4bd0;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-cancel {
  width: 127px;
  height: 34px;
  background-color: #503cc380;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-choose:hover {
  background-color: #4b3fae;
}

.button-cancel:hover {
  background-color: #4b3fae;
}

.button-container-2 {
  margin-bottom: 20px;
}
.city-icon {
  position: absolute;
  left: 248px;
  top: 14px;
}
</style>
