<template>
  <v-container>
    <h1>Обратная связь</h1>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
        outlined
        dense
      />
      <v-textarea
        v-model="comment"
        :rules="commentRules"
        label="Сообщение"
        required
        outlined
        dense
      />

      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="validate"
      >
        Отправить
      </v-btn>
    </v-form>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    valid: true,
    comment: '',
    commentRules: [
      v => !!v || 'Обязательно для заполнения'
    ],
    email: '',
    emailRules: [
      v => !!v || 'Поле E-mail обязательно для заполнения',
      v => /.+@.+\..+/.test(v) || 'Поле E-mail не верно'
    ]

  }),
  computed: {
    ...mapGetters({
      GEO: 'GEO/STATE'
    })
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    }
  },
  head () {
    return {
      title: 'Обратная связь',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
           'Страница для обратной связи с супермаркетом Ayanmarket. Звоните: 8 778 097-07-05 | Ayanmarket'
        }
      ],
      link: [{ rel: 'canonical', href: `https://ayanmarket.kz${this.$route.path}` }]
    }
  }
}
</script>
