<template>
  <v-dialog v-model="show" width="423px" color="black" persistent @click:outside="$emit('update:show', false)">
    <v-card>
      <v-card-title class="pb-2">
        {{ $i18n.t("cancelModal.cancel") }}
        <v-spacer />
        <v-btn icon color="#503CC3" @click="$emit('update:show', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pb-0">
        <span>
          {{ $i18n.t("cancelModal.reason") }}
        </span>
        <v-chip-group column :value="tagId">
          <v-chip
            v-for="item in tags"
            :key="item.id"
            :value="item.id"
            label
            active-class="success"
            @click="tagId = item.id"
          >
            {{ $i18n.locale === 'ru' ? item.name : item.nameKz }}
          </v-chip>
        </v-chip-group>
      </v-card-text>
      <v-card-actions class="pt-3 pb-3 justify-end">
        <v-btn class="mr-3 white--text" color="#503CC3" @click="cancelOrder()">
          {{ $i18n.t("cancelModal.confirm") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'CancelModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      tagId: null
    }
  },
  computed: {
    ...mapGetters({
      tags: 'Order/TAGS'
    })
  },
  watch: {
    show (val) {
      //   подтягиваем список тегов для отмены если их нет в сторе
      if (val && this.tags.length === 0) {
        this.GET_CANCEL_TAGS()
      }
      //   обнуляем данные при закрытии модалки
      if (!val) {
        this.tagId = null
      }
    }
  },
  methods: {
    ...mapActions({
      GET_CANCEL_TAGS: 'Order/GET_CANCEL_TAGS',
      CANCEL_ORDER: 'Order/CANCEL_ORDER'
    }),
    async cancelOrder () {
      if (!this.tagId) {
        this.$notify({
          group: 'app',
          type: 'error',
          duration: 2000,
          title: this.$i18n.t('errors.err'),
          text: this.$i18n.t('cancelModal.reason')
        })
        return
      }
      const response = await this.CANCEL_ORDER({ orderId: this.order, tagId: this.tagId })
      if (response.type === 'error') {
        this.$notify({
          group: 'app',
          type: 'error',
          duration: 2000,
          title: this.$i18n.t('errors.err'),
          text: response.data.message
        })
      } else {
        this.$notify({
          group: 'app',
          type: 'success',
          duration: 2000,
          title: this.$i18n.t('errors.success2'),
          text: 'Заказ отменен'
        })
        this.$eventBus.$emit('getOrdersHistory')
        this.$emit('update:show', false)
      }
    }
  }
}
</script>
