<template>
  <v-container fluid :class="footerbg">
    <v-footer app absolute color="#5D4BD0">
      <EmailForm />
      <v-row class="footer">
        <v-col class="footer_str">
          <div class="copyright2">
            <div class="titleFooter">
              <span>Покупателям</span>
              <v-btn class="titleFooter_btn" icon @click="show1 = !show1">
                <v-icon color="white"> mdi-plus </v-icon>
              </v-btn>
            </div>
            <div class="copyright2_menu" :class="show1 && 'show-menu'">
              <nuxt-link
                style="font-weight: 300"
                tag="a"
                class="mb-1 dis-footer_link"
                :to="`/page/oplata`"
              >
                {{ $i18n.t("button.paymentMethods") }}
              </nuxt-link>
              <nuxt-link
                style="font-weight: 300"
                tag="a"
                class="mb-1 dis-footer_link"
                :to="`/page/vopros-otvet`"
              >
                {{ $i18n.t("button.questions") }}
              </nuxt-link>
              <nuxt-link
                style="font-weight: 300"
                tag="a"
                class="mb-1 dis-footer_link"
                :to="`/page/order-return`"
              >
                {{ $i18n.t("button.return") }}
              </nuxt-link>
              <nuxt-link
                style="font-weight: 300"
                tag="a"
                class="mb-1 dis-footer_link"
                :to="`/actions`"
              >
                Акции
              </nuxt-link>
            </div>
          </div>
          <div class="copyright2">
            <div class="titleFooter">
              <span>О компании</span>
              <v-btn class="titleFooter_btn" icon @click="show2 = !show2">
                <v-icon color="white"> mdi-plus </v-icon>
              </v-btn>
            </div>
            <div class="copyright2_menu" :class="show2 && 'show-menu'">
              <nuxt-link
                style="font-weight: 300"
                tag="a"
                class="mb-1 dis-footer_link"
                :to="`/page/contacts`"
              >
                {{ $i18n.t("button.contacts") }}
              </nuxt-link>
              <nuxt-link
                tag="a"
                class="mb-1 dis-footer_link"
                :to="`/page/privacy-payment`"
              >
                {{ $i18n.t("button.confident") }}
              </nuxt-link>
              <nuxt-link
                style="font-weight: 300"
                tag="a"
                class="mb-1 dis-footer_link"
                :to="`/page/contract-offer`"
              >
                {{ $i18n.t("button.offert") }}
              </nuxt-link>
            </div>
          </div>
          <div class="copyright2">
            <div class="titleFooter">
              <span>Продавцам</span>
              <v-btn class="titleFooter_btn" icon @click="show3 = !show3">
                <v-icon color="white"> mdi-plus </v-icon>
              </v-btn>
            </div>
            <div class="copyright2_menu" :class="show3 && 'show-menu'">
              <nuxt-link
                style="font-weight: 300"
                tag="a"
                class="mb-1 dis-footer_link"
                :to="`/page/kak-zakazat`"
              >
                {{ $i18n.t("button.howCreateDelivery") }}
              </nuxt-link>
              <nuxt-link
                style="font-weight: 300"
                tag="a"
                class="mb-1 dis-footer_link"
                :to="`/page/vacancy`"
              >
                {{ $i18n.t("button.workInAyanDelivery") }}
              </nuxt-link>
            </div>
          </div>
          <div class="copyright2">
            <div class="titleFooter mobile-only">
              <span>Контакты</span>
              <v-btn class="titleFooter_btn" icon @click="show4 = !show4">
                <v-icon color="white"> mdi-plus </v-icon>
              </v-btn>
            </div>
            <div style="margin-left: 150px">
              <a
                style="color: white; font-size: 16px; margin-left: 12px"
                class="links_info"
                href="tel:87780970705"
                @click="$Ecomerce.phoneClick()"
              >
                8 778 097-07-05
              </a>
              <a
                style="
                  color: white;
                  font-size: 16px;
                  text-decoration: underline;
                  text-underline-offset: 2px;
                "
                class="links_info"
                href="mailto:dostavka@ayan.kz"
                @click="$Ecomerce.emailClick('dostavka@ayan.kz')"
              >
                dostavka@ayan.kz
              </a>
            </div>

            <div
              style="
                margin-top: 72px;
                display: flex;
                position: absolute;
                margin-left: 100px;
              "
            >
              <div>
                <img
                  src="../../assets/img/header/Item → Link.svg"
                  alt="apple"
                  width="106px"
                  height="25px"
                  @click="openModal"
                />
              </div>
              <div>
                <img
                  src="../../assets/img/header/Item → Link (1).svg"
                  alt="google"
                  width="106px"
                  height="25px"
                  @click="openModal"
                />
              </div>
            </div>
          </div>
          <br />
          <v-dialog v-model="modal" max-width="400">
            <v-card>
              <v-card-title style="z-index: 1">
                <span class="headline pl-4">Отсканируйте QR Code</span>
                <v-btn icon @click="closeModal">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <div>
                <v-card-text>
                  <div class="qrCode">
                    <img
                      src="@/assets/img/svg/qrcode.svg"
                      alt="qr"
                      class="prev_img-small"
                      style="width: 100%"
                    />
                  </div>
                </v-card-text>
              </div>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-footer>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import EmailForm from "~/components/EmailForm/EmailForm.vue";
export default {
  components: {
    EmailForm,
  },
  data() {
    return {
      modal: false,
      show1: false,
      show2: false,
      show3: false,
      show4: false,
    };
  },
  computed: {
    ...mapGetters({
      GEO: "GEO/STATE",
    }),
    isHomePage() {
      return this.$route.path === "/shop/collection/vse-categoryy-0";
    },
    footerbg() {
      // Применяем footerbgCollection ко всем страницам, где есть /shop/collection/
      return this.$route.path.startsWith("/shop/collection/")
        ? "footerbgCollection"
        : "footerbg";
    },
  },
  methods: {
    openModal() {
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
  },
};
</script>
<style lang="scss">
@import "./style";
.links_info {
  display: block; /* Элементы будут расположены друг под другом */
  margin-bottom: 3px; /* Добавим немного отступа между ними */
  font-size: 20px;
}
</style>