<template>
  <div class="pagination">
    <div v-if="totalPages" class="pagination_bottom">
      <v-btn v-if="fetching" color="#503CC3" dark class="pagination_btn">
        <v-progress-circular
          v-if="fetching"
          :size="20"
          :width="2"
          indeterminate
          color="white"
          class="mr-5"
        />
        {{ $i18n.t("collection.moreBtn") }}
      </v-btn>
      <v-btn v-if="totalPages !== activePage+1 && !fetching" color="#503CC3" dark class="pagination_btn" @click="$emit('change-page')">
        {{ $i18n.t("collection.moreBtn") }}
      </v-btn>
      <v-pagination
        v-if="totalPages > 1"
        :value="activePage + 1"
        :length="totalPages"
        :total-visible="$vuetify.breakpoint.xsOnly ? 5 : 7"
        color="#503CC3"
        class="mt-2 mb-2 pagination_num"
        @input="$emit('change-page', $event - 1)"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    totalPages: {
      type: Number,
      default: 0
    },
    activePage: {
      type: Number,
      default: 0
    },
    fetching: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: false
    }
  },
  methods: {
    openModal () {
      this.modal = true
    },
    closeModal () {
      this.modal = false
    }
  }
}
</script>
  <style lang="scss">
 .pagination{
  width: 100%;
  height: max-content;
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  &_bottom{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &_btn{
    text-transform: none;
    &:hover{
      transform: translateY(-1px);
    }
  }
  &_num{
    .v-pagination__item--active {
      background-color: white !important;
      color: #503CC3 !important;
      border: 1px solid #503CC3 !important;
    }
    li{
      &:first-child{
        button{
          width: max-content;
          &::after{
            content: 'Назад';
            padding-right: 10px;
            @media (max-width:700px) {
              content: '';
              padding-right: 0px;
              }
          }
        }
    }
    &:last-child{
        button{
          width: max-content;
          &::before{
            content: 'Вперед';
            padding-left: 10px;
            @media (max-width:700px) {
              content: '';
              padding-left: 0px;
              }
          }
        }
    }
    }

    @media (max-width:700px) {
      width: 97% !important;
    }
  }
}
  </style>
