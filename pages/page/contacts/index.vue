<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container>
    <div class="static_page">
      <h1>{{ $i18n.t('button.contacts') }}</h1>
      <div class="d-flex align-center">
        <v-icon color="#503CC3">
          mdi-phone
        </v-icon>
        <p class="ma-0 pl-3">
          {{ $i18n.t('personalOffice.number') }}: <a href="tel:87780970705" @click="$Ecomerce.phoneClick()"> 8(778) 097 07 05</a>
        </p>
      </div>
      <div class="d-flex align-center mt-4">
        <v-icon color="#503CC3">
          mdi-email-outline
        </v-icon>
        <p class="ma-0 pl-3">
          Email: <a href="mailto:ayandostavka@gmail.com" @click="$Ecomerce.emailClick()">ayandostavka@gmail.com</a>
        </p>
      </div>
      <h3> {{ $i18n.t('contacts.office') }}:</h3>
      <div class="d-flex align-center">
        <v-icon color="#503CC3">
          mdi-clock-time-three-outline
        </v-icon>
        <p class="ma-0 pl-3">
          с 09:00 до 18:00
        </p>
      </div>
      <h3>{{ $i18n.t('contacts.orders') }}:</h3>
      <div class="d-flex align-center">
        <v-icon color="#503CC3">
          mdi-clock-time-three-outline
        </v-icon>
        <p class="ma-0 pl-3">
          с 09:00 до 21:00
        </p>
      </div>
      <h3>{{ $i18n.t('contacts.urAdres') }}:</h3>
      <div class="d-flex align-center">
        <v-icon color="#503CC3">
          mdi-map-marker
        </v-icon>
        <p class="ma-0 pl-3">
          Казахстан, Карагандинская обл., г. Караганда, ул. Ермекова 73/2 кв.2
        </p>
      </div>
      <h3>{{ $i18n.t('contacts.mailAdres') }}:</h3>
      <div class="d-flex align-center">
        <v-icon color="#503CC3">
          mdi-map-marker
        </v-icon>
        <p class="ma-0 pl-3">
          Казахстан, Карагандинская обл., г. Караганда,ул. Комиссарова, 36
        </p>
      </div>
      <h1>
        РЕКВИЗИТЫ ТОО "«Аян Тех»"
      </h1>
      <p>
        БИН 230340023125
      </p>
      <p>
        БИК HSBKKZKX
      </p>
      <p>
        АО «Народный Банк Казахстана»
      </p>
      <p>
        TNG ИИК KZ32601A191004199021
      </p>
    </div>
  </v-container>
</template>
<script>
export default {
  head () {
    return {
      title: 'Контакты и реквизиты компании Ayanmarket',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Контактная информация и реквизиты | Сервис доставки продуктов и товаров для дома Ayanmarket'
        }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: `{
            "@context": "https://schema.org",
            "@type": "Organization",
            "image": "https://ayanmarket.kz/products/imageProdSmall/image_2023-10-16-10-58-342153000_Group%209.png",
            "url": "https://ayanmarket.kz/",
            "logo": "https://ayanmarket.kz/products/imageProdSmall/image_2023-10-16-10-58-342153000_Group%209.png",
            "name": "Ayan Market",
            "description": "Сервис доставки продуктов и товаров для дома",
            "email": "dostavka@ayan.kz",
            "telephone": "8(778) 097 07 05",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "ул. Ермекова 73/2 кв. 2",
              "addressLocality": "Казахстан",
              "addressCountry": "KZ",
              "addressRegion": "Карагандинская область",
              "postalCode": "100005"
            },
          }`
        }
      ]
    }
  }
}
</script>

<style lang="scss">
  @import '../staticPagesStyle/staticPagesStyle.scss';
</style>
