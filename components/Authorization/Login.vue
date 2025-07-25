
<template>
  <div v-if="value" class="modal-overlay" @click="closeDialog">
      <div
  class="modal-content"
  :class="{ fullscreen: isFullscreen }"
  :style="{ height: modalContentHeight }" 
  @click.stop
>
      <div class="login" :class="$vuetify.breakpoint.xsOnly ? 'mobile' : ''">
        <v-card-title
          v-if="$vuetify.breakpoint.xsOnly"
          :class="$vuetify.breakpoint.xsOnly ? 'login_header' : ''"
        >
          <div class="login_header__item">
            <v-btn icon>
              <v-icon
                color="white"
                @click="
                  $emit('closedialog');
                  reset = false;
                "
              >
                mdi-arrow-left-bold
              </v-icon>
            </v-btn>
            <img
              src="@/assets/img/svg/ayan_market.svg"
              alt="logo"
              height="50px"
            />
          </div>
        </v-card-title>
        <v-card-text class="login_text">
          <p class="login_text__title">
            {{ stage === 0 ? headerText : "Введите код из СМС" }}
          </p>

          <v-form ref="form">
            <!-- На отправку кода -->
            <v-tabs-items v-if="type" v-model="stage">
              <!-- ввод номера для отправки смс -->
              <v-tab-item>
                <input
                :placeholder="$i18n.t('personalOffice.number2')"
                  id="reset_phone"
                  v-model="login_input.phone"
                  v-mask="'+# (###) ### ####'"
                  class="login_input"
                  :label="$i18n.t('login.enterTel')"
                  :rules="[rules.required, rules.PHONE]"
                  style="
                    margin-bottom: 20px;
                    margin-left: 5px;
                    font-size: 14px;
                    padding: 0px 25px 0px 23px;
                    border-radius: 34px;
                    width: 393px;
                    background-color: rgb(239, 236, 255);
                    max-width: 393px;
                    height: 34px;
                  "
                />

                <div class="text-center">
                  <div class="button-container">
                    <v-btn
                      style="height: 35px"
                      class="send_code"
                      color="#503CC3"
                      :disabled="isButtonDisabled"
                      @click="sendSms"
                    >
                     {{
              $i18n.t("button.logIn")
            }}
                    </v-btn>
                    <v-btn
                      class="send_code"
                      :style="{
                        backgroundColor: isHovered ? '#503CC3' : '#503CC380',
                      }"
                      :disabled="isButtonDisabled"
                      @mouseover="isHovered = true"
                      @mouseleave="isHovered = false"
                      @click="closeDialog"
                    >
                      {{
              $i18n.t("button.Notnow")
            }}
                    </v-btn>
                  </div>

                  <div v-if="isButtonDisabled">
                    {{ $i18n.t("login.sendMore") }} : {{ countdown }} секунд
                  </div>
                </div>
              </v-tab-item>
              <!-- ввод смски -->
              <v-tab-item>
                <div class="login_checked"></div>
                <Code @complete="authSms($event)" @closedialog="closeDialog" />
               
              </v-tab-item>
            </v-tabs-items>
            <!-- регистрация пользователя -->
            <div v-else>
              <div class="input-row">
                <input
                  v-model="register_input.name"
                  class="login_input"
                  :rules="[rules.required]"
                  :placeholder="$i18n.t('personalOffice.name')"
                  style="margin-bottom: 20px; font-size: 14px; padding: 0px 25px 0px 23px; border-radius: 34px; background-color: rgb(239, 236, 255); width: 100%; height: 34px;"
                />
                <input
                  v-model="register_input.surname"
                  :rules="[rules.required]"
                  class="login_input"
                 :placeholder="$i18n.t('personalOffice.secondName')"
                  style="margin-bottom: 20px; font-size: 14px; padding: 0px 25px 0px 23px; border-radius: 34px; background-color: rgb(239, 236, 255); width: 100%; height: 34px;"
                />
                <input
                  v-model="register_input.middlename"
                  :rules="[rules.required]"
                  class="login_input"
                  :placeholder="$i18n.t('personalOffice.surName')"
                  style="margin-bottom: 20px; font-size: 14px; padding: 0px 25px 0px 23px; border-radius: 34px; background-color: rgb(239, 236, 255); width: 100%; height: 34px;"
                />
                <input
                  v-model="register_input.phone"
                  v-mask="'+# (###) ### ####'"
                  :rules="[rules.required, rules.PHONE]"
                  class="login_input"
                   :placeholder="$i18n.t('personalOffice.number2')"
                  style="margin-bottom: 20px; font-size: 14px; padding: 0px 25px 0px 23px; border-radius: 34px; background-color: rgb(239, 236, 255); width: 100%; height: 34px;"
                />
                
                <v-checkbox
                  v-model="personalProcessing"
                  :rules="[rules.requiredCheckbox]"
                  checked
                  :off-icon="'mdi-circle-outline'"
                  :on-icon="'mdi-circle-slice-8'"
                  color="#503CC3"
                  class="order_checkbox"
                  :label="$i18n.t('order.agree')"
                />
              </div>
            </div>
          </v-form>
        </v-card-text>
        <!-- нижние кнопки подтверждения -->
        <div v-if="reset !== true" class="text-center pb-3">
          <div class="button-container">
    <!-- Кнопка Создать -->
    <v-btn v-if="!type" 
          
           color="#503CC3" 
           class="send_code raised-button" 
           @click="register">
      {{
              $i18n.t("button.logIn")
            }}
    </v-btn>

    <!-- Кнопка Войти -->
    <v-btn v-if="!type" 
          
           color="#503CC380" 
           class="send_code raised-button" 
           @click="type = !type">
      {{ $i18n.t('button.Notnow') }}
    </v-btn>
  </div>

        <div v-if="type && stage === 0" class="actions__text">
          <span>Нет аккаунта?</span>
          <v-btn text color="#503CC3" @click="type = !type">
            {{ $i18n.t('login.create') }}
          </v-btn>
        </div>
       
      </div>
        
      </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Code from "@/components/Authorization/Code";

export default {
  components: { Code },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isHovered: false,
      countdown: 0,
      isButtonDisabled: false,
      personalProcessing: false,
      login_input: {
        phone: "",
        password: "",
        authCode: 4125,
      },
      register_input: {
        authCode: 8547,
        cityId: 1,
        comment: "Регистрация",
        dateBirthday: "",
        email: "",
        id: 0,
        middlename: "",
        name: "",
        password: "",
        phone: "",
        surname: "",
        gender: "",
      },
      ressInput: {
        password: "",
        phone: "",
      },
      phone: "",
      type: true,
      reset: false,
      stage: 0,
      code: "",
      rules: {
        required: (value) => !!value || "Обязательно для заполнения",
        PHONE(data) {
          if (!data) {
            return false;
          }
          data = data.replace(/[^0-9]/g, "");
          if (data.length < 10) {
            return false;
          }
          return true;
        },
        requiredCheckbox: (value) => !!value || this.$i18n.t("order.offer"),
        min: (value) => value.length >= 8 || "Минимум 8 символов",
        email(value) {
          if (value !== 0) {
            const pattern =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || "Не правильный email.";
          }
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      AUTH: "Auth/STATE",
      PERSONAL: "Personal/STATE",
      GEO: "GEO/STATE",
    }),
    modalContentHeight() {
      return this.type ? "247px" : "450px"; // Если регистрация, то высота 416px, иначе 208px
    },
    captionText() {
      if (this.type === true) {
        return this.$i18n.t("login.notAcc");
      }
      return this.$i18n.t("login.withAcc");
    },
    headerText() {
      if (this.reset === true) {
        return this.$i18n.t("login.refreshPas");
      }
      if (this.type === true) {
        return this.$i18n.t("login.enter2");
      }
      return this.$i18n.t("login.regist");
    },
  },
  mounted() {
    const timerEnd = localStorage.getItem("timerEnd");
    if (timerEnd) {
      const timerEndTimestamp = parseInt(timerEnd);
      const now = Date.now();

      if (now < timerEndTimestamp) {
        this.isButtonDisabled = true;
        this.countdown = Math.ceil((timerEndTimestamp - now) / 1000);
        this.updateCountdown();
      } else {
        localStorage.removeItem("timerEnd");
      }
    }
  },
  methods: {
    ...mapActions({
      singIn: "Auth/singIn",
      signUp: "Auth/signUp",
      tokenInfo: "Personal/tokenInfo",
      SET_IS_LOGGIN: "Personal/LOG_IN_OUT",
      smsSend: "SMS/CREATE_CLIENT_CODE",
      smsVerify: "SMS/CODE_VERIFY",
      resetPass: "Auth/resetPass",
      smsAuth: "SMS/CODE_AUTH",
    }),
    formatPhoneNumber() {
      let phone = this.login_input.phone.replace(/\D/g, "");

      if (phone.startsWith("8")) {
        phone = "7" + phone.slice(1); // Если номер начинается с 8, заменяем на 7
      }

      if (phone.startsWith("7")) {
        phone = "+" + phone; // Добавляем плюс в начале
      }

      if (phone.length > 2) {
        phone = phone.slice(0, 2) + " " + phone.slice(2);
      }
      if (phone.length > 6) {
        phone = phone.slice(0, 6) + " " + phone.slice(6);
      }
      if (phone.length > 10) {
        phone = phone.slice(0, 10) + " " + phone.slice(10);
      }
      if (phone.length > 13) {
        phone = phone.slice(0, 13) + " " + phone.slice(13);
      }

      this.login_input.phone = phone; // Обновляем значение поля
    },
    async login() {
      if (this.$refs.form.validate()) {
        const result = await this.singIn(this.login_input);
        if (result.type === "success") {
          this.$cookies.set("TOKEN", result.data);
          localStorage.setItem("refToken", JSON.stringify(result));
          await this.tokenInfo();
          await this.SET_IS_LOGGIN(true);
          this.$router.push("/page/personal-office/");
          this.$forceUpdate();
          this.$emit("closedialog");
        } else {
          this.$notify({
            group: "app",
            type: "error",
            duration: 10000,
            title: this.$i18n.t("errors.err"),
            text: "Пароль или телефон не совпадают",
          });
        }
      }
    },
    async register() {
      if (this.$refs.form.validate()) {
        let phoneNumber = this.register_input.phone.replace(/[()\s]/g, "");

        if (!phoneNumber.startsWith("+7")) {
          phoneNumber = "+7" + phoneNumber;
        }

        const operators = [
          "721",
          "700",
          "701",
          "702",
          "703",
          "705",
          "706",
          "707",
          "708",
          "747",
          "709",
          "750",
          "751",
          "760",
          "761",
          "762",
          "763",
          "764",
          "771",
          "775",
          "776",
          "777",
          "778",
        ];

        if (!operators.includes(phoneNumber.slice(2, 5))) {
          this.$notify({
            group: "app",
            type: "error",
            duration: 10000,
            title: this.$i18n.t("errors.err"),
            text: this.$i18n.t("errors.number"),
          });
          return;
        }

        this.register_input.phone = phoneNumber;

        const result = await this.signUp(this.register_input);
        if (result.type === "success") {
          this.login_input.phone = this.register_input.phone;
          this.login_input.password = this.register_input.password;
          await this.login();
          this.type = true;
          this.register_input = {};
        } else {
          this.$notify({
            group: "app",
            type: "error",
            duration: 10000,
            title: this.$i18n.t("errors.err"),
            text: this.$i18n.t("errors.createAcc"),
          });
        }
      }
    },
    async sendSms() {
      if (this.login_input.phone.length < 10) {
        this.$notify({
          group: "app",
          type: "error",
          duration: 10000,
          title: this.$i18n.t("errors.err"),
          text: this.$i18n.t("errors.fullPhone"),
        });
        return;
      }
      this.disableButton();

      const result = await this.smsSend({
        name: "",
        surname: "",
        phone: this.login_input.phone.replaceAll(" ", ""),
      });

      if (result.type !== "error") {
        this.code = "";
        this.stage = 1;
      } else {
        this.$refs.form.validate();
        this.$notify({
          group: "app",
          type: "error",
          duration: 10000,
          title: this.$i18n.t("errors.err"),
          text: result.text,
        });
      }
    },
    disableButton() {
      const timerEndTimestamp = Date.now() + 10000;
      localStorage.setItem("timerEnd", timerEndTimestamp);

      this.isButtonDisabled = true;
      this.countdown = 60;

      const id = setTimeout(() => {
        this.isButtonDisabled = false;
        localStorage.removeItem("timerEnd");
        this.countdown = 0;
        clearTimeout(id);
      }, 60000);

      this.updateCountdown();
    },
    goBack() {
      this.stage--;
    },
    updateCountdown() {
      if (this.countdown > 0) {
        setTimeout(() => {
          this.countdown--;
          this.updateCountdown();
        }, 1000);
      } else {
        this.isButtonDisabled = false;
      }
    },
    async authSms(code) {
      this.code = code;
      const result = await this.smsAuth({
        phone: this.login_input.phone.replaceAll(" ", ""),
        code: this.code,
      });
      if (result.type !== "error") {
        this.$cookies.set("TOKEN", result.token);
        localStorage.setItem("refToken", JSON.stringify(result));
        await this.tokenInfo();
        await this.SET_IS_LOGGIN(true);
        this.$router.push("/page/personal-office/");
        this.$emit("closedialog");
        this.code = "";
        this.stage = 0;
      } else {
        this.$refs.form.validate();
        this.$notify({
          group: "app",
          type: "error",
          duration: 10000,
          title: this.$i18n.t("errors.err"),
          text: result.text,
        });
        this.code = "";
      }
    },
    closeDialog() {
      this.$emit("closedialog");
    },
  },
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Убедитесь, что этот элемент будет наверху */
}

.modal-content {
  background: white;
  height: 208px;
  width: 441px;
  border-radius: 16px;
  z-index: 10000; /* Убедитесь, что этот элемент будет наверху, выше overlay */
}

.modal-content.fullscreen {
  width: 100%;
  height: 100%;
  border-radius: 16px;
}
.login_text__title {
  margin-bottom: 20px;
  margin-left: 8px;
  margin-top: 18px;
  font-weight: 700;
  font-size: 20px;
}
.button-container {
  margin-left: 4px;
  margin-top: 3px;
  display: flex;
  gap: 20px; /* Расстояние между кнопками */
  justify-content: center; /* Центрируем кнопки */
}

.send_code {
  font-weight: 600;
  height: 35px; /* Устанавливаем одинаковую высоту */
  width: 186px; /* Устанавливаем одинаковую ширину для всех кнопок */
  border-radius: 20px; /* Сглаживаем углы кнопок */
  color: white;
  font-size: 10px;
}

.raised-button {
  margin-top: -5px; /* Немного поднимаем кнопки */
}
</style>

