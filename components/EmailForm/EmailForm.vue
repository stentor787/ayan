<template>
  <section v-if="show" class="email">
    <v-dialog
      v-if="dialog"
      v-model="modal"
      max-width="70%"
      :content-class="$vuetify.breakpoint.xsOnly ? 'mobile' : ''"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      transition="slide-y-reverse-transition"
      @click:outside="modal = false"
    >
      <v-card style="background-color:#503CC3; border-radius: 10px;" :class="$vuetify.breakpoint.xsOnly && 'mobile_card'">
        <v-card-title class="email_title">
          Хотите получать скидки первым?
        </v-card-title>
        <v-card-text>
          <v-form ref="email">
            <v-text-field
              v-model="personal.email"
              placeholder="Введите свой email"
              outlined
              dense
              class="email_input"
              color="#503CC3"
              hide-details
              background-color="#F4F6FA"
              :rules="[rules.hasAtSymbol]"
              @keyup.enter="sendMail()"
            >
              <template slot="append">
                <v-icon large color="#503CC3" class="email_icon" @click="sendMail()">
                  mdi-email
                </v-icon>
              </template>
            </v-text-field>
          </v-form>
          <div class="email_text">
            Нажимая "Подписаться" вы соглашаетесь с пользовательским соглашением, политикой конфиденциальности и получением информационных рассылок
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <div v-else class="email_block">
      <v-card flat style="background-color:#503CC3; border-radius: 10px;" class="email_card">
        <v-card-title class="email_title pa-0 pb-1 title-small">
          Хотите получать скидки первым?
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form ref="email">
            <v-text-field
              v-model="personal.email"
              placeholder="Введите свой email"
              outlined
              dense
              class="email_input-small"
              color="#503CC3"
              hide-details
              background-color="#F4F6FA"
              :rules="[rules.hasAtSymbol]"
              required
              @keyup.enter="sendMail()"
            >
              <template slot="append">
                <v-icon color="#503CC3" class="email_icon" @click="sendMail()">
                  mdi-email
                </v-icon>
              </template>
            </v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
      <div class="email_text mini">
        Нажимая "Подписаться" вы соглашаетесь с пользовательским соглашением, политикой конфиденциальности и получением информационных рассылок
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'EmailForm',
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    row: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: false,
      modal: false,
      personal: {
        email: ''
      },
      rules: {
        hasAtSymbol (value) {
          const regex = /@/
          if (!regex.test(value)) {
            return 'Текст должен содержать символ "@"'
          }
          return true
        }
      }

    }
  },
  computed: {
    ...mapGetters({
      PERSONAL: 'Personal/STATE'
    })
  },
  watch: {
    'PERSONAL.clientSingle': function () {
      if (!this.PERSONAL.clientSingle.email) {
        this.personal = JSON.parse(JSON.stringify(this.PERSONAL.clientSingle))
        this.show = true
        this.setTimer()
      } else {
        this.show = false
        this.modal = false
      }
    }
  },
  methods: {
    ...mapActions({
      saveClient: 'Personal/editClient'
    }),
    setTimer () {
      let iteration = 0
      const intId = setInterval(() => {
        if (iteration >= 2) {
          clearInterval(intId)
        }
        this.modal = true
        iteration++
      }, 4 * 60 * 1000)
    },
    async sendMail () {
      if (this.$refs.email.validate()) {
        const response = await this.saveClient(this.personal)
        if (response !== 'error') {
          this.$notify({
            group: 'app',
            type: 'success',
            duration: 1000,
            title: 'Данные успешно сохранены',
            text: 'Ваши данные были успешно обновлены.'
          })
        }
      }
    }
  }
}
</script>

  <style lang="scss">
  @import "./style";
  </style>
