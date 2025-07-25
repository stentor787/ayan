
<template>
  <div class="div-container">
    <!-- Верхняя часть хедера -->
    <div class="header-container">
      <header class="top-header">
        <!-- Логотип и адрес с возможностью редактирования -->
        <div class="top-logo">
          <div>
            <img src="../../assets/img/header/Vector (2).svg" alt="" />
          </div>
          <!-- Адрес с кнопкой для редактирования -->
          <div
            style="cursor: pointer"
            class="haddress__dataitem"
            @click="editaddress"
          >
            <span
              v-if="GEO.info.address.street === ''"
              style="cursor: pointer"
              >{{ $i18n.t("button.deliveryAddress") }}</span
            >
            <span v-else>{{ GEO.info.address.street }}</span>
            <v-icon small color="#68676A" class="mdi-chevron-down">
              mdi-chevron-down
            </v-icon>
          </div>
          <!-- Ссылка на страницу "Как заказать" -->
          <nuxt-link tag="a" style="margin-left: 10px" to="/page/kak-zakazat">
            <div class="app">
              <span>{{ $i18n.t("button.howCreateDelivery2") }}</span>
              <img src="../../assets/img/header/Group.svg" alt="Icon" />
            </div>
          </nuxt-link>
        </div>

        <!-- Иконки для переключения языка -->
        <div class="top-icon">
          <a href="https://ayanmarket.shop/">
            <div class="forsales">{{ $i18n.t("button.forSalers") }}</div>
          </a>

          <!-- Иконка для переключения на русский язык -->
          <div
            class="languageicon"
            :class="{ active: selectedIcon === 1 }"
            @click="changeLanguage(1)"
          >
            RU
          </div>
          <!-- Иконка для переключения на казахский язык -->
          <div
            class="languageicon2"
            :class="{ active: selectedIcon === 2 }"
            @click="changeLanguage(2)"
          >
            KZ
          </div>
        </div>
      </header>

      <!-- Основной хедер -->
      <header class="header">
        <div class="logo">
          <nuxt-link to="/">
            <div class="logo_ayan_market">
              <img src="../../assets/img/header/Group (2).svg" alt="" />
            </div>
          </nuxt-link>
        </div>

        <!-- Кнопка для отображения каталога -->
        <div class="catalog-container">
          <div class="icon-category" @click="toggleCatalogWindow">
            <i
              :class="
                isCatalogWindowVisible ? 'categoryclose-icon' : 'category-icon'
              "
            ></i>
          </div>
        </div>

        <!-- Окно с категориями каталога -->
        <transition name="fade-catalog">
          <div
            v-if="isCatalogWindowVisible"
            class="catalog-window"
            @click="toggleCatalogWindow"
          >
            <!-- Многоуровневые категории -->
            <v-list class="hover_panel" v-if="CATALOG_CATEGORIES.length">
              <v-list-item-group>
                <div
                  class="panel_one"
                  v-for="item in MAIN_CATEGORIES"
                  :key="item.id"
                  @mouseover="getSecond(item, event)"
                  @click="handleItemClick(item)"
                >
                  <nuxt-link
                    v-if="!item.isShop"
                    :to="makeLink(item)"
                    style="display: flex; color: inherit; width: 100%"
                  >
                    <v-list-item-title class="hover_panel_body_title">
                      {{
                        $i18n.locale === "kz"
                          ? item.nameKz || item.name
                          : item.name
                      }}
                    </v-list-item-title>
                  </nuxt-link>
                  <span v-else style="font-size: 14px; cursor: pointer">
                    {{
                      $i18n.locale === "kz"
                        ? item.nameKz || item.name
                        : item.name
                    }}
                  </span>
                </div>
              </v-list-item-group>
            </v-list>

            <!-- Подкатегории -->
            <v-list v-show="secondData.length" class="hover_panel_second">
              <v-list-item-group>
                <div
                  class="child_panel"
                  v-for="item in secondData"
                  :key="item.id"
                  @mouseover="getThird(item)"
                  @click="handleItemClick(item)"
                >
                  <nuxt-link
                    v-if="!item.isShop"
                    :to="makeLink(item)"
                    style="display: flex; color: inherit; width: 100%"
                  >
                    <v-list-item-title class="hover_panel_body_title">
                      {{
                        $i18n.locale === "kz"
                          ? item.nameKz || item.name
                          : item.name
                      }}
                    </v-list-item-title>
                  </nuxt-link>
                  <span class="ggwpwp" v-else>
                    {{
                      $i18n.locale === "kz"
                        ? item.nameKz || item.name
                        : item.name
                    }}
                  </span>
                </div>
              </v-list-item-group>
            </v-list>

            <!-- Третий уровень категорий -->
            <v-list v-show="thirdData.length" class="hover_panel_third">
              <v-list-item-group>
                <div
                  class="child_panel"
                  v-for="item in thirdData"
                  :key="item.id"
                  @mouseover="getFourth(item, event)"
                  @click="handleItemClick(item)"
                >
                  <nuxt-link
                    v-if="!item.isShop"
                    :to="makeLink(item)"
                    style="display: flex; color: inherit; width: 100%"
                  >
                    <v-list-item-title class="hover_panel_body_title">
                      {{
                        $i18n.locale === "kz"
                          ? item.nameKz || item.name
                          : item.name
                      }}
                    </v-list-item-title>
                  </nuxt-link>
                  <v-list-item-title v-else style="font-size: 14px; cursor: pointer">
                    {{
                      $i18n.locale === "kz"
                        ? item.nameKz || item.name
                        : item.name
                    }}
                  </v-list-item-title>
                </div>
              </v-list-item-group>
            </v-list>

            <!-- Четвертый уровень категорий -->
            <v-list v-show="fourthData.length" class="hover_panel_fourth">
              <v-list-item-group>
                <div
                  class="child_panel_4"
                  v-for="item in fourthData"
                  :key="item.id"
                >
                  <nuxt-link
                    v-if="!item.isShop"
                    :to="makeLink(item)"
                    style="display: flex; color: inherit; width: 100%"
                  >
                    <v-list-item-title class="hover_panel_body_title">
                      {{
                        $i18n.locale === "kz"
                          ? item.nameKz || item.name
                          : item.name
                      }}
                    </v-list-item-title>
                  </nuxt-link>
                  <span v-else style="font-size: 14px; cursor: pointer">
                    {{
                      $i18n.locale === "kz"
                        ? item.nameKz || item.name
                        : item.name
                    }}
                  </span>
                </div>
              </v-list-item-group>
            </v-list>
          </div>
        </transition>

        <!-- Компонент для поиска -->
        <div>
          <div>
            <d-search />
          </div>
        </div>

        <!-- Иконки для разных действий (избранное, корзина и т.д.) -->
        <div class="icons">
          <!-- Иконка для избранного -->
          <div class="icon">
            <nuxt-link to="/">
              <div class="icons-page">
                <i class="call-icon"></i>
              </div>
            </nuxt-link>
          </div>

          <!-- Иконка корзины с количеством элементов в корзине -->
          <div
            class="icon"
            @mouseover="hoveredIcon = 'cart'"
            @mouseleave="hoveredIcon = null"
          >
            <v-badge
              :value="CART.details.totalLength > 0"
              :content="CART.details.totalLength"
              color="#8CCD28"
              overlap
              bordered
            >
              <nuxt-link to="/basket">
                <div class="icons-page">
                  <i class="notification-icon"></i>
                </div>
              </nuxt-link>
            </v-badge>
            <CartPreview
              v-if="CART.details.totalLength"
              :value="cartPreviewVisibility"
              @open-preview="cartPreviewVisibility = true"
              @close-preview="cartPreviewVisibility = false"
            />
          </div>

          <!-- Иконка для второго избранного -->
          <div class="icon">
            <div class="icons-page" @click="openFavorites">
              <i class="favorite-icon"></i>
            </div>
          </div>

          <!-- Логин/выход -->
          <div class="icon">
            <div v-if="!PERSONAL.isLoggin" @click="openLogin">
              <div class="openLogin">
                <span class="gggtext"> {{ $i18n.t("button.logIn") }}</span>
                <span class="gggimg"
                  ><img src="../../assets/img/header/Vector (4).svg" alt=""
                /></span>
              </div>
            </div>

            <div v-else>
              <v-menu offset-y left>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <div class="openLogin">
                      <span class="gggtext">{{
                         $i18n.t("button.logOut")
                      }}</span>
                      <span class="gggimg"
                        ><img
                          src="../../assets/img/header/Vector (4).svg"
                          alt=""
                      /></span>
                    </div>
                  </div>
                </template>
                <v-list>
                  <v-list-item to="/page/personal-office">
                    <v-list-item-icon
                      ><v-icon>mdi-account-outline</v-icon></v-list-item-icon
                    >
                    <v-list-item-title>{{
                      $i18n.t("header.private")
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="logout">
                    <v-list-item-icon
                      ><v-icon>mdi-logout</v-icon></v-list-item-icon
                    >
                    <v-list-item-title>{{
                      $i18n.t("button.logOut")
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </header>
    </div>

    <!-- Кнопка, открывающая полезные ссылки -->
    <div>
      <div class="bottom-right-corner">
        <div class="button-container">
          <button class="custom-button" @click="toggleWindow">
            Полезные ссылки
            <img
              src="../../assets/img/header/Frame 29469 (2).svg"
              alt="icon"
              class="button-icon"
            />
          </button>
        </div>
      </div>
      <!-- Фон для затемнения при открытии модального окна -->
      <transition name="fade-overlay">
        <div v-if="isWindowVisible" class="overlay" @click="closeWindow"></div>
      </transition>
      <!-- Модальное окно с полезными ссылками -->
      <transition
        name="fade"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <div v-if="isWindowVisible" class="con">
          <!-- Секции с ссылками -->
          <div class="topi">
            <div class="section">
              <h3>Покупателям</h3>
              <nuxt-link to="/page/oplata" style="color: black">
                <p>{{ $i18n.t("button.paymentMethods") }}</p>
              </nuxt-link>
              <nuxt-link to="/page/vopros-otvet" style="color: black">
                <p>{{ $i18n.t("button.questions") }}</p>
              </nuxt-link>
              <nuxt-link to="/page/order-return" style="color: black">
                <p>{{ $i18n.t("button.return") }}</p>
              </nuxt-link>
              <nuxt-link to="/actions" style="color: black">
                <p>Акции</p>
              </nuxt-link>
              <div class="qr_image">
                <img src="../../assets/img/header/image 71 (1).svg" alt="" />
              </div>
            </div>
            <div class="section" style="padding-left: 39px">
              <h3>О компании</h3>
              <nuxt-link to="/page/contacts" style="color: black">
                <p>{{ $i18n.t("button.contacts") }}</p>
              </nuxt-link>
              <nuxt-link to="/page/privacy-payment" style="color: black">
                <p>{{ $i18n.t("button.confident") }}</p>
              </nuxt-link>
              <nuxt-link to="/page/contract-offer" style="color: black">
                <p>{{ $i18n.t("button.offert") }}</p>
              </nuxt-link>
            </div>
            <div class="section" style="padding-left: 39px">
              <h3>Продавцам</h3>
              <nuxt-link to="/page/kak-zakazat" style="color: black">
                <p>{{ $i18n.t("button.howCreateDelivery") }}</p>
              </nuxt-link>
              <nuxt-link to="/page/vacancy" style="color: black">
                <p>{{ $i18n.t("button.workInAyanDelivery") }}</p>
              </nuxt-link>
            </div>
          </div>
          <div class="ff">
            <div class="left">
              <p>
                <img
                  style="cursor: pointed"
                  src="../../assets/img/header/Mask group.svg"
                  @click="openModal"
                  alt="Mask group"
                />
              </p>
              <p>
                <img
                  style="cursor: pointed"
                  src="../../assets/img/header/Mask group (1).svg"
                  @click="openModal"
                  alt="Mask group (1)"
                />
              </p>
            </div>
            <div class="right">
              <p style="margin-bottom: 1px">
                <a
                  style="color: black; font-size: 14px"
                  href="tel:87780970705"
                  @click="$Ecomerce.phoneClick()"
                  >8 778 097-07-05</a
                >
              </p>
              <p style="margin-bottom: 1px">
                <a
                  style="
                    color: black;
                    text-decoration: underline;
                    font-size: 14px;
                  "
                  href="mailto:dostavka@ayan.kz"
                  @click="$Ecomerce.emailClick('dostavka@ayan.kz')"
                  >dostavka@ayan.kz</a
                >
              </p>
            </div>
          </div>
          <!-- Модальное окно для QR-кода -->
          <v-dialog v-model="modal" max-width="400">
            <v-card>
              <v-card-title style="z-index: 1">
                <span class="headline pl-4">Отсканируйте QR Code</span>
                <v-btn icon @click="closeModal">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
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
            </v-card>
          </v-dialog>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DSearch from "../Search/Search.vue";
import { buildShopsItem } from "@/utils/buildShops";
export default {
  components: {
    DSearch,
  },
  data() {
    return {
      modal: false, // Состояние модального окна
      secondData: [],
      selectedCategory: null, // Добавление переменной для отслеживания выбранной категории
      selectedCategory2: null, // Добавление переменной для отслеживания выбранной категории
      selectedCategory3: null, // Добавление переменной для отслеживания выбранной категории
      thirdData: [],
      fourthData: [],
      lastScroll: 0,
      defaultOffset: 200,
      topOfPage: true,
      headerHidden: false,
      searchData: "",
      searchItems: [],
      searchLoaded: false,
      searchProductVal: "",
      searchSyncVal: null,
      headScroll: false,
      hoveredIcon: null,
      IputSearchData: "",
      isWindowVisible: false, // Флаг для отображения окна
      input: {
        search: "",
      },
      productCartCount: 0,
      inClient: false,
      cart: false,
      cartPreviewVisibility: false,
      selectedIcon: 1, // Отслеживает выбранную иконку языка (1 - русский, 2 - казахский)
      isCatalogWindowVisible: false, // Стейт для отображения окна каталога
    };
  },
  watch: {
    $route(to, from) {
      // Закрываем окно при изменении маршрута
      this.isWindowVisible = false;
    },
  },

  computed: {
    ...mapGetters({
      CART: "Cart/STATE",
      GEO: "GEO/STATE",
      PERSONAL: "Personal/STATE",
      CATALOG_CATEGORIES: "Category/HOVER_PANEL_CATEGORIES",
      GEO: "GEO/STATE",
      DEPARTMENT_CATEGORIES: "Category/DEPARTMENT_CATEGORIES",
    }),
    MAIN_CATEGORIES() {
      // Создаём «корень» магазинов
      const shopsItem = buildShopsItem(this.GEO.info.depEntities);
      return [shopsItem, ...this.CATALOG_CATEGORIES];
    },
  },
  async mounted() {
    this.$eventBus.$on("changeDepartment", () => {
      this.GET_HOVER_PANEL_CATEGORIES(
        this.$cookies.get("availableDepartments")
      );
    });
    this.GET_HOVER_PANEL_CATEGORIES(this.$cookies.get("availableDepartments"));
    this.$eventBus.$on("cartAmount", (data) => {
      this.productCartCount = data;
    });
    if (this.$cookies.get("TOKEN")) {
      await this.LOG_IN_OUT(true);
    } else {
      await this.LOG_IN_OUT(false);
    }
    this.inClient = true;

    // Добавляем обработчик для кликов по документу
    document.addEventListener("click", this.handleDocumentClick);

    if (process.browser) {
      window.addEventListener("scroll", this.handleScroll);
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    ...mapActions({
      SET_ACTIVE_SHOP: "GEO/SET_ACTIVE_SHOP",
      SEARCH_PRODUCT: "Products/SEARCH_PRODUCT",
      LOG_IN_OUT: "Personal/LOG_IN_OUT",
      CLEAR_CART_PRODUCTS: "Cart/CLEAR_CART_PRODUCTS",
      GET_HOVER_PANEL_CATEGORIES: "Category/GET_HOVER_PANEL_CATEGORIES",
      GET_CATEGORIES_BY_DEPARTMENT: "Category/GET_CATEGORIES_BY_DEPARTMENT",
    }),
    // Главное действие при клике
    async handleItemClick(item) {
      // Если это конкретный филиал
      if (item.isShop) {
        // Закрываем панель
        this.closeModal();
        // Активируем филиал
        await this.activateShop(item);
      } else {
        // Иначе — «старая» логика: просто закрываем меню
        this.closeModal();
      }
    },
    // Активируем филиал (логика как на странице товара)
    async activateShop(item) {
      // Если уже активен
      if (this.GEO.activeShop.id === item.id) {
        this.$router.push(
          `/${this.GEO.activeShop.route}/collection/vse-categoryy-0/`
        );
        return;
      }
      const route = `shop-${this.$translit(item.name)}`;
      const newShop = {
        id: item.id,
        route,
      };
      // Устанавливаем активный филиал
      await this.SET_ACTIVE_SHOP(newShop);
      // Подгружаем категории
      await this.GET_HOVER_PANEL_CATEGORIES([item.id]);
      // Переходим на страницу
      this.$router.push(`/${route}/collection/vse-categoryy-0/`);
    },
    handleDocumentClick(event) {
      // Проверяем, не был ли кликнут элемент внутри каталога или кнопка
      const catalogContainer = this.$el.querySelector(".catalog-container");
      const catalogWindow = this.$el.querySelector(".catalog-window");

      if (
        catalogWindow &&
        !catalogWindow.contains(event.target) &&
        catalogContainer &&
        !catalogContainer.contains(event.target)
      ) {
        // Если клик был вне каталога, закрываем окно
        this.isCatalogWindowVisible = false;
      }
    },
    changeLanguage(iconNumber) {
      if (iconNumber === 1) {
        this.$i18n.locale = "ru"; // Переключение на русский
        this.selectedIcon = 1; // Обновление выбранной иконки на русский
      } else if (iconNumber === 2) {
        this.$i18n.locale = "kz"; // Переключение на казахский
        this.selectedIcon = 2; // Обновление выбранной иконки на казахский
      }
    },
    async logout() {
      this.$cookies.remove("TOKEN");
      this.$cookies.remove("clientId");
      localStorage.removeItem("refToken");
      await this.LOG_IN_OUT(false);
      this.CLEAR_CART_PRODUCTS();
    },

    // Метод для переключения видимости окна каталога
    toggleCatalogWindow() {
      this.isCatalogWindowVisible = !this.isCatalogWindowVisible;

      // Сброс данных и снятие выделения при закрытии окна каталога
      if (!this.isCatalogWindowVisible) {
        this.resetData();
        if (this.selectedCategory) {
          this.selectedCategory.classList.remove("selected");
          this.selectedCategory = null;
        }
      }
    },
    makeLink(item) {
      if (item.id === "shops") {
        return `/${this.GEO.activeShop.route}/collection/group-all`;
      }
      if (item.isShopGroup) {
        return `/${this.GEO.activeShop.route}/collection/group-${item.id}`;
      }
      if (item.isShop) {
        // Для филиала делаем «заглушку» (у нас будет programmatic navigate)
        return "";
      }
      return `/${this.GEO.activeShop.route}/collection/${this.$translit(
        item.name
      )}-${item.id}`;
    },
    toggleWindow() {
      this.isWindowVisible = !this.isWindowVisible;
    },
    beforeRouteLeave(to, from, next) {
      this.isWindowVisible = false; // Закрываем окно при переходе на другой маршрут
      next(); // Переход на следующий маршрут
    },

    openModal() {
      this.modal = true;
    },
    // Метод для закрытия модального окна
    closeModal() {
      this.modal = false;
    },

    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.transform = "translateY(600px)"; // Начало анимации с большого расстояния снизу
    },

    enter(el, done) {
      el.offsetHeight; // Трюк для форсирования перерисовки
      el.style.transition = " transform 0.5s ease";
      el.style.opacity = 1;
      el.style.transform = "translateY(0)"; // Конечная позиция (нормальная)
      done();
    },

    leave(el, done) {
      el.style.transition = "transform 0.5s ease";
      el.style.opacity = 1;
      el.style.transform = "translateY(600px)"; // Окно уходит обратно вниз
      setTimeout(() => {
        done();
      }, 250); // Задержка 500 мс перед удалением элемента
    },

    closeWindow() {
      this.isWindowVisible = false; // Закрываем окно при клике на фон
    },
    editaddress() {
      this.$eventBus.$emit("editAddress", true);
    },

    getSecond(item) {
      // Сбрасываем дочерние элементы
      this.thirdData = [];
      this.secondData = item.children;

      // Убираем класс подсветки с предыдущей категории
      if (this.selectedCategory) {
        this.selectedCategory.classList.remove("selected2");
      }

      // Добавляем класс подсветки к текущей категории
      this.selectedCategory = event.currentTarget;
      this.selectedCategory.classList.add("selected2");
    },

    getThird(item) {
      // Сбрасываем дочерние элементы
      this.fourthData = [];
      this.thirdData = item.children;
      // Убираем класс подсветки с предыдущей категории
      if (this.selectedCategory2) {
        this.selectedCategory2.classList.remove("selected3");
      }

      // Добавляем класс подсветки к текущей категории
      this.selectedCategory2 = event.currentTarget;
      this.selectedCategory2.classList.add("selected3");
    },

    getFourth(item) {
      // Сбрасываем дочерние элементы
      this.fourthData = item.children;
      // Убираем класс подсветки с предыдущей категории
      if (this.selectedCategory3) {
        this.selectedCategory3.classList.remove("selected4");
      }

      // Добавляем класс подсветки к текущей категории
      this.selectedCategory3 = event.currentTarget;
      this.selectedCategory3.classList.add("selected4");
    },

    // Сброс данных
    resetData() {
      this.secondData = [];
      this.thirdData = [];
      this.fourthData = [];
    },

    // Действия для кнопок, такие как редактирование адреса, открытие страниц
    editaddress() {
      this.$eventBus.$emit("editAddress", true);
    },
    editcity() {
      this.$eventBus.$emit("editCity", true);
    },
    openLogin() {
      this.$eventBus.$emit("openDialog", true);
    },
    openFavorites() {
      const clientId = this.$cookies.get("clientId");
      const availableDepartments = this.$cookies.get("availableDepartments");
      if (!clientId) {
        this.openLogin();
      } else if (!availableDepartments) {
        this.editaddress();
      } else {
        this.$router.push("/favorites");
      }
    },
    async searchProduct(val) {
      if (typeof val === "object") {
        val = this.IputSearchData;
      }
      if (!val) {
        return;
      }
      if (val === null) {
        return;
      }
      if (this.searchProductVal === val) {
        return;
      }
      if (val.length >= 3) {
        if (this.searchLoaded === false) {
          // Если не идет загрузка то мы её можем запустить
          this.searchLoaded = true;
          // Здесь await на поиск
          const data = await this.SEARCH_PRODUCT({
            name: val,
            departmentId: this.GEO.departmentId,
            page: 0,
            pageSize: 40,
          });
          if (data.type === "success") {
            this.$set(this, "searchItems", data.data);
          }
          const id = setTimeout(() => {
            this.searchLoaded = false;
            if (val !== this.searchProductVal) {
              this.searchProduct(this.searchProductVal); // Ищем то что не могли найти так как были в ожидании
            }
            clearTimeout(id);
          }, 2000);
        } else {
          this.searchProductVal = val;
        }
      }
    },
    async changeLocalization() {
      if (this.selectedIcon === 1) {
        this.$i18n.locale = "ru";
        this.selectedIcon = 1;
      } else {
        this.$i18n.locale = "kz";
        this.selectedIcon = 2;
      }
    },
  },
};
</script>

<style lang="scss">
@import "./style";
.ggwpwp{
  font-size: 14px; cursor: pointer
}
</style>
