<template>
  <v-dialog v-model="show" width="423px" color="black" persistent @click:outside="$emit('close_modal')">
    <v-form>
      <v-card>
        <v-card-title class="pb-2">
          {{ $i18n.t("errorForm.report") }}
          <v-spacer />
          <v-btn icon color="#503CC3" @click="$emit('close_modal')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pb-0">
          <span>
            {{ $i18n.t("errorForm.chose") }}
          </span>
          <v-chip-group v-model="typeErrors" column multiple>
            <v-chip v-for="item in ERROR.errorsList" :key="item.id" label active-class="success">
              {{ $i18n.locale === 'ru' ? item.name : item.nameKz }}
            </v-chip>
          </v-chip-group>
          <span>
            {{ $i18n.t("errorForm.comment") }}
          </span>
          <v-textarea v-model="input.comment" class="mt-2 mb-1" outlined hide-details color="#503CC3" />
        </v-card-text>
        <v-card-actions class="pt-3 pb-3">
          <v-btn class="ml-2 white--text" color="#503CC3" @click="send()">
            {{ $i18n.t("errorForm.send") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      typeErrors: [],
      input: {
        name: '', // Навзагние продукта
        category: '', // Навзание категории
        typeError: '', // Тип ошибки
        comment: '' // Коммент
      }
    }
  },
  computed: {
    ...mapGetters({
      ERROR: 'Error/STATE'
    })
  },
  watch: {
    typeErrors: {
      handler (val) {
        const errors = []
        val.forEach((element) => {
          errors.push(this.ERROR.errorsList[element].name + ' ')
        })
        this.input.typeError = errors.toString()
      },
      deep: true
    }
  },
  async mounted () {
    if (this.ERROR.errorsList.length === 0) {
      await this.getAll()
    }
  },
  methods: {
    ...mapActions({
      getAll: 'Error/GET_ALL_ERRORS',
      sendError: 'Error/SEND_ERROR'
    }),
    async send () {
      if (this.input.typeError.length !== 0) {
        this.input.name = this.product.name
        this.input.category = this.product.categoryIds[0]
        const result = await this.sendError(this.input)
        if (result.type === 'success') {
          this.$emit('close_modal')
          this.input = {
            name: '', // Название продукта
            category: '', // Название категории
            typeError: '', // Тип ошибки
            comment: '' // Коммент
          }
          this.typeErrors = []
          this.$notify({
            group: 'appcenterbig',
            type: 'success',
            duration: 3000,
            title: this.$i18n.t('errors.thank'),
            text: this.$i18n.t('errors.success')
          })
        } else {
          this.$notify({
            group: 'appcenterbig',
            type: 'error',
            duration: 3000,
            title: this.$i18n.t('errors.err')
          })
        }
      } else {
        this.$notify({
          group: 'appcenterbig',
          type: 'error',
          duration: 3000,
          title: this.$i18n.t('errors.err'),
          text: this.$i18n.t('errors.choose')
        })
      }
    }
  }
}
</script>
