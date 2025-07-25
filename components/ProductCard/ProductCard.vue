
<template>
  <!--технический долг-->
    <div
      :class="{
        'not-main-page': !isHomePage,
        isCollection: isCollection,
        'search-card': search,
        'special-product': product.highlightInCategory,
        'special-product-category': special,
      }"
      class="dis-product_card"
    >
      <div v-if="notAvailable" class="not-available_cover" />
      <div :class="notAvailable && 'not-available'">
        <div class="dis-product_card__image_wrapper" >
          <div class="dis-product_card__header">
          <v-btn
            :elevation="0"
            :color="isFavorite ? '#EE4C48' : 'black'"
            icon
            @click="handleButtonClick()"
            style="position: absolute;top: 0px;right: 0px;z-index: 1;"
          >
            <v-icon>
              {{ isFavorite ? "mdi-heart" : "mdi-heart-outline" }}
            </v-icon>
          </v-btn>
          <lazy-product-discount
            v-if="isLoyalty"
            :class="{ promo: true, 'not-available': notAvailable }"
            :product-discount="discount"
            :product-price="minPrice"
            :product="product"
            :loyalty="isLoyalty && currentProvider.loyaltyDiscount"
            style="position: absolute;bottom: 10px;left: 10px;"
          />
          <lazy-product-discount
            v-if="!currentProvider.loyaltyDiscount && discount"
            :class="{ promo: true, 'not-available': notAvailable }"
            :product-discount="discount"
            :product-price="minPrice"
            :product="product"
            :loyalty="isLoyalty && currentProvider.loyaltyDiscount"
            style="position: absolute;bottom: 10px;left: 10px;"
          />
        </div>
          <nuxt-link
            :to="`/product/${$translit(product.name)}-${
              product.providerProductId
            }`"
          >
            <div
              class="dis-product_card__image"
              @mousemove="handleMouseMove"
              @mouseleave="handleMouseLeave"
            >
              <v-img
                ref="image"
                loading="lazy"
                :src="currentImage || ''"
                :alt="product.name"
                contain
                :title="product.name"
                @click="goToProductPage"
                 class="dis-product_card__vimg"
                @error="replaceImage()"
              />
              <div v-if="isMouseOver" class="image-indicator">
                <div
                  v-for="(_, index) in product.images"
                  :key="index"
                  :class="{ active: index === currentImageIndex }"
                />
              </div>
            </div>
          </nuxt-link>
        </div>
          <div class="card-info-wrapper" style="margin-left: 10px;margin-right: 10px;">
            <div
              v-if="!notAvailable"
              class="dis-product_card__price"
              @click="goToProductPage()"
              style="display: flex;flex-direction: row;"
            >
              <!-- Условие для отображения скидки с перечеркнутой оригинальной ценой -->
              <span
              style="font-size: 18px; color: #5d4bd0 !important;"
                v-if="!discount && !isLoyalty && !currentProvider.loyaltyDiscount"
              >
                {{ formatNumber(minPrice) }} ₸
              </span>
  
              
  
              <span
                v-if="!isLoyalty && currentProvider.loyaltyDiscount"
                class="dis-product_card_percent dis-product_card_green-percent"
              >
                С картой дешевле
              </span>
  
              <!-- Цена со скидкой -->
              <span
              style="font-size: 18px; color: #5d4bd0 !important;"
                v-if="
                  (currentProvider.loyaltyDiscount === false ||
                    currentProvider.loyaltyDiscount === null) &&
                  discount &&
                  !isLoyalty
                "
                class="dis-product_card__price-sale"
              >
                {{
                  currentProvider.discountPrice
                    ? formatNumber(currentProvider.discountPrice)
                    : formatNumber(minPrice)
                }}
                ₸
              </span>
              <!-- Оригинальная цена с перечеркиванием, если есть скидка -->
              <span
                style="padding-left: 21px;font-size: 16px;padding-right: 10px;"
                v-if="
                  (currentProvider.loyaltyDiscount === false ||
                    currentProvider.loyaltyDiscount === null) &&
                  discount &&
                  !isLoyalty &&
                  currentProvider.discountPrice
                "
                class="dis-product_card__old-price"
              >
                {{ formatNumber(minPrice) }} ₸
              </span>
  
              <!-- Если нет скидки и нет лояльности, показываем обычную цену -->
              <span
              style="font-size: 18px;  color: #5d4bd0 !important;"
                v-if="
                  !isLoyalty &&
                  !(
                    currentProvider.loyaltyDiscount === false ||
                    currentProvider.loyaltyDiscount === null
                  )
                "
              >
                {{ formatNumber(minPrice) }} ₸
              </span>
  
              <!-- Если есть скидка для лояльных клиентов -->
            
           <span
    v-else-if="currentProvider.discountPercent"
    class="percentCard"
   :class="{
      'dis-product_card_green-percent': (
        currentProvider.loyaltyDiscount !== false && 
        currentProvider.loyaltyDiscount !== null && 
        discount && isLoyalty
      ),
      
      'dis-product_card_red-percent': !(currentProvider.loyaltyDiscount !== false && currentProvider.loyaltyDiscount !== null && discount)
    }"
    :style="{ 'margin-bottom': hitProduct ? '10px' : '0' }"
  >
    <div style="margin-top: -1px;">
      {{'-' + currentProvider.discountPercent + "%" }}
    </div>
  </span>
  
  
              <!-- Отображение цены со скидкой для лояльных клиентов -->
              <span
              style="font-size: 18px;  color: #5d4bd0 !important;"
                v-if="discount && isLoyalty"
                :class="{
                  'dis-product_card__price-sale':
                    discount && currentProvider.discountPrice,
                }"
              >
                {{
                  currentProvider.discountPrice
                    ? formatNumber(currentProvider.discountPrice) + " ₸"
                    : ""
                }}
              </span>
  
              <!-- Отображение обычной цены при наличии скидки и лояльности -->
              <span
                style="padding-left: 18px;font-size: 16px;padding-right: 3px; color: #5d4bd0 !important;"
                v-if="isLoyalty"
                :class="{
                  'dis-product_card__old-price':
                    discount && currentProvider.discountPrice,
                  'dis-product_card__price-sale': !(
                    discount && currentProvider.discountPrice
                  ),
                }"
              >
                {{ formatNumber(minPrice) }} ₸
              </span>
            </div>
              <div v-else>Нет в наличии</div>
                <a class="dis-product_card__title_link" style="font-weight: bold;font-size: 15px;" @click="goToProductPage()">
                  {{ $capitalize($i18n.locale === "ru" ? product.name : product.nameKz) }}
                  <span v-if="product.measureType === 'кг'"
                    >, {{ product.measureType }}
                  </span>
                </a>
                <span class="dis-product_card__title_balance" @click="goToProductPage()">
                  {{ $i18n.t("productDialog.balance") }}:
                  {{ getBalance(currentProvider.balance) }}
                </span>
                <div class="dis-product_card_rating d-flex align-center">
                  <!-- Вместо v-rating одна иконка -->
                  <v-icon color="orange lighten-3" small>mdi-star</v-icon>
                  <!-- Отображаем само числовое значение рейтинга -->
                  <span style="color: #868686;" class="rating-value ml-1">{{ product.rating }}</span>
  
                  <!-- Если нужно оставить количество отзывов, отображаем рядом 
                  <span
                    class="dis-product_card__reviews ml-1"
                    @mouseover="tooltipVisible = true"
                    @mouseout="tooltipVisible = false"
                  >
                    ({{ product.reviewsCount }})
                    <div v-if="tooltipVisible" class="tooltip">Количество отзывов</div>
                  </span>-->
                </div>
  
              </div>
          </div>
        <div
        style="flex-direction: column;"
        :class="{
          'dis-product-count-control': true,
          'not-available': notAvailable,
        }"
      >
          <div style="display: flex; flex-direction: column;align-items: center;">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  elevation="0"
                  class="dis-product_card_button time"
                  :class="{ 'special-product_btn': product.highlightInCategory }"
                  :disabled="true" 
                  style="height: 46px !important;
                        width: 220px !important;
                        border-radius: 28px !important;
                        background-color: #32C8F0 !important;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <img :src="timeIcon" alt="Basket Icon" />
                  <span style="font-size: 16px; color: white; margin-left: 10px;">
                    {{ $i18n.t("productDialog.onTime") }}
                  </span>
                </v-btn>
              </template>
              <span>Пока не доступно</span>
            </v-tooltip>
  
            <v-btn
              v-if="amount === 0"
              small
              elevation="0"
              class="dis-product_card_button"
              :class="{ 'special-product_btn': product.highlightInCategory }"
              @click="amount > 0 ? plusCart() : addtoCart()"
              style="height: 46px !important;width: 220px !important;border-radius: 28px !important;"
            >
            <img :src="basketIcon" alt="Basket Icon"  />
              <span style="font-size: 16px; margin-left: 10px;">{{ $i18n.t("productDialog.buy") }}</span>
            </v-btn>
          </div>
          <div class="wrapper" style="display: flex;width: 100%;height: 100%;justify-content: center;">
            <v-btn
              v-if="amount > 0"
              class="dis-product_card_button_minus"
              :class="{ 'special-product_btn-minus': product.highlightInCategory }"
              style="height: 46px; min-width: 33px;padding: 0px;border-radius: 32px 0 0 32px !important;"
              small
              elevation="0"
              :ripple="false"
              @click="minusCart"
            >
              <v-icon small> mdi-minus </v-icon>
            </v-btn>
            <div style="min-width: 146px;padding: 0px;"
            v-if="amount > 0" class="dis-product_card_button_amount">
              {{ amount }}
            </div>
            <v-btn
              v-if="amount > 0"
              small
              elevation="0"
              :ripple="false"
              style="height: 46px; min-width: 32px;border-radius: 0 32px 32px 0 !important;"
              class="dis-product_card_button_plus"
              :class="{ 'special-product_btn-minus': product.highlightInCategory }"
              @click="amount > 0 ? plusCart() : addtoCart()"
            >
              <v-icon small> mdi-plus </v-icon>
            </v-btn>
          </div>
      </div>
    </div>
  </template>
  <script>
  import { mapActions, mapGetters } from "vuex";
  
  export default {
    props: {
      product: {
        type: Object,
        default: null,
      },
      // другой стиль для окна поиска
      search: {
        type: Boolean,
        default: false,
      },
      // другой стиль для окна спец категории
      special: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isHomePage: false,
        isCollection: false,
        tooltipVisible: false,
        isMouseOver: false,
        currentImageIndex: 0,
        images: [],
        count: "1",
        amount: 0,
        providerId: null,
        minPrice: 0,
        currentProvider: {},
        curDep: null,
        discount: false,
        departmentName: "",
        products: [],
        isFavorite: false,
        notAvailable: false,
        debounceId: null,
        isLoyalty: false,
        basketIcon: require('~/assets/img/svg/basket.svg'),
        timeIcon: require('~/assets/img/svg/time.svg')
        
      };
    },
    computed: {
      ...mapGetters({
        GEO: "GEO/STATE",
        CART: "Cart/STATE",
        PERSONAL: "Personal/STATE",
      }),
      currentImage() {
        return this.product.images && this.product.images.length > 0
          ? this.product.images[this.currentImageIndex]
          : "https://ayanmarket.kz/products/images/4770190051347.png";
      },
      isAuthorized() {
        return !!this.$cookies.get("clientId");
      },
      hasLoyaltyCard() {
        return this.PERSONAL.clientSingle.isLoyalty;
      },
      showLoyaltyDiscount() {
        return this.product.loyaltyDiscount && this.product.discountPrice > 0;
      },
       hitProduct () {
        return this.product && this.product.categoryIds && this.showForCategoryId(170535)
      }
    },
    watch: {
      "CART.details.totalPrice": function () {
        this.getAmount();
      },
    },
    created() {
      // Проверка текущий путь маршрута при создании компонента
      this.checkIfHomePage();
    },
    mounted() {
      // Устанавливаем индекс текущего изображения, если оно существует
      if (this.product.images && this.product.images.length > 0) {
        this.currentImageIndex = 0;
      }
  
      // Устанавливаем флаг, что мы в клиенте
      this.inClient = true;
  
      // Получаем количество (предположительно это вычисление суммы или количества)
      this.getAmount();
  
      // Ищем поставщиков продукта
      this.findProductProviders();
  
      // Проверяем, если пользователь не авторизован
      if (!this.isAuthorized) {
        // Если не авторизован, очищаем данные о лояльности из localStorage
        localStorage.removeItem("isLoyalty");
        this.isLoyalty = false; // Обнуляем локальное состояние лояльности
      } else {
        // Если авторизован, восстанавливаем данные о лояльности из localStorage
        const loyaltyStatus = localStorage.getItem("isLoyalty");
        if (loyaltyStatus !== null) {
          this.isLoyalty = JSON.parse(loyaltyStatus); // Восстанавливаем состояние лояльности
        } else if (
          this.PERSONAL.clientSingle.isLoyalty &&
          this.currentProvider.loyaltyDiscount
        ) {
          // Если нет в localStorage, проверяем, есть ли карта лояльности и скидка
          this.isLoyalty = true;
          localStorage.setItem("isLoyalty", JSON.stringify(true)); // Сохраняем лояльность в localStorage
        }
      }
  
      // Флаг, чтобы показывать скидки в зависимости от категории продукта
      this.isFavorite = this.product.isFavorite;
      this.shouldShowDiscount =
        this.product.categoryIds &&
        (this.product.categoryIds.includes(170554) ||
          this.product.categoryIds.includes(170535));
  
      // Сохранение скидок только по лояльности
      if (
        this.isLoyalty &&
        this.currentProvider.loyaltyDiscount !== false &&
        this.currentProvider.loyaltyDiscount !== null
      ) {
        // Если скидка лояльности существует и лояльность активна, сохраняем её в localStorage
        if (this.discount) {
          // Дополнительная проверка на наличие самой скидки
          localStorage.setItem("loyaltyDiscount", JSON.stringify(this.discount));
        }
      } else {
        // Если лояльность отключена или скидка не по лояльности, удаляем данные о скидке из localStorage
        localStorage.removeItem("loyaltyDiscount");
      }
    },
  
    methods: {
      ...mapActions({
        ADD_TO_CART: "Cart/ADD_TO_CART",
        REMOVE_IN_CART: "Cart/REMOVE_IN_CART",
        NEW_AMOUNT: "Cart/NEW_AMOUNT",
        ADD_PRODUCT_TO_FAV: "Favorites/ADD_PRODUCT_TO_FAV",
        REMOVE_PRODUCT_FROM_FAV: "Favorites/REMOVE_PRODUCT_FROM_FAV",
        CHANGE_CLIENT_CART: "Cart/CHANGE_CLIENT_CART",
        SEND_BROKEN_IMAGE: "Products/SEND_BROKEN_IMAGE",
      }),
       showForCategoryId (categoryId) {
        return this.product.categoryIds.includes(categoryId)
      },
  
      checkLoyalty() {
        const loyaltyStatus = localStorage.getItem("isLoyalty");
        if (loyaltyStatus !== null) {
          this.isLoyalty = JSON.parse(loyaltyStatus); // Восстанавливаем состояние лояльности
        } else {
          // Проверка, если клиент вошел в систему и имеет карту лояльности
          if (
            this.PERSONAL.clientSingle.isLoyalty &&
            this.currentProvider.loyaltyDiscount
          ) {
            this.isLoyalty = true;
            localStorage.setItem("isLoyalty", JSON.stringify(true)); // Сохраняем в localStorage
          }
        }
      },
  
      updateLoyaltyStatus(status) {
        this.isLoyalty = status;
        localStorage.setItem("isLoyalty", JSON.stringify(status)); // Обновляем состояние в localStorage
      },
      logout() {
        // Очистка данных о лояльности при выходе
        this.$cookies.remove("clientId");
        localStorage.removeItem("isLoyalty");
        localStorage.removeItem("loyaltyDiscount");
        this.updateLoyaltyStatus(false); // Сбрасываем статус лояльности в state
  
        // Обновляем состояние, чтобы вызвать перерисовку компонента
        this.$store.dispatch("Cart/RESET_CART"); // Если у вас есть экшен для сброса корзины
        this.$store.dispatch("Personal/RESET_STATE"); // Если нужно сбросить состояние личных данных
  
        // Перезагружаем страницу с помощью Vue
        this.$router.go(0); // Это аналогично перезагрузке страницы
      },
  
      checkIfHomePage() {
        if (this.$route.path === "/") {
          this.isHomePage = true;
        }
        // для страницы категорий и для поиска 4 карточки
        if (
          this.$route.name === "shop-collection-id" ||
          this.$route.name === "shop-search-id" ||
          this.$route.name === "favorites"
        ) {
          this.isCollection = true;
        }
      },
  
      // Для просмотра изображений при наведении
      handleMouseMove(event) {
        if (!this.product.images) {
          return;
        }
        if (this.product.images && this.product.images.length <= 1) {
          return;
        }
        const totalImages = this.product.images.length;
        const imageWidth = event.currentTarget.clientWidth;
        const rect = event.currentTarget.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        mouseX = Math.max(0, Math.min(mouseX, imageWidth));
        this.currentImageIndex = Math.floor((mouseX / imageWidth) * totalImages);
        this.isMouseOver = true;
      },
  
      handleMouseLeave() {
        this.currentImageIndex = 0;
        this.isMouseOver = false;
      },
  
      async addToFavorite() {
        await this.ADD_PRODUCT_TO_FAV(this.product.providerProductId);
        this.isFavorite = true;
        this.$Ecomerce.addToFavorite(this.createGTMProduct());
      },
  
      async removeFromFavorite() {
        await this.REMOVE_PRODUCT_FROM_FAV(this.product.providerProductId);
        this.$eventBus.$emit("delete-favorite");
        this.isFavorite = false;
      },
  
      handleButtonClick() {
        if (this.$cookies.get("clientId")) {
          // Пользователь зарегистрирован, добавляем и удаляем продукты
          if (this.isFavorite) {
            this.removeFromFavorite();
          } else {
            this.addToFavorite();
          }
        } else {
          // Пользователь не зарегистрирован, открываем окно регистрации
          this.$eventBus.$emit("openDialog", true);
        }
      },
  
      getAmount() {
        if (this.CART.details.totalLength > 0) {
          const currentProvider = this.CART.all.find(
            (item) => item.productId === this.product.providerProductId
          );
          this.products = this.CART.all.filter(
            (item) => item.productId === this.product.providerProductId
          );
          this.amount = Number(
            this.products.reduce((accum, product) => {
              accum += product.amount;
              return accum;
            }, 0)
          ).toFixed(1);
          if (currentProvider) {
            this.providerId = currentProvider.providerId;
          } else {
            this.amount = 0;
            this.findProductProviders();
          }
        } else {
          this.amount = 0;
        }
      },
  
      formatNumber(num) {
        if (num === null || num === undefined) {
          return "";
        }
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      },
  
      minusCart() {
        const amount = (
          parseFloat(this.getProviderAmount(this.providerId)) -
          parseFloat(this.product.measureStep)
        ).toFixed(1);
        const payload = {
          amount,
          departmentId: this.currentProvider.departmentId,
          productId: this.product.providerProductId,
          providerId: this.providerId,
          price: this.product.price,
          discountPrice: this.product.discountPrice,
          packetStep: this.curDep?.packetStep,
        };
        if (amount > 0) {
          this.NEW_AMOUNT(payload);
          if (this.$cookies.get("TOKEN")) {
            if (this.debounceId) {
              clearTimeout(this.debounceId);
            }
            this.debounceId = setTimeout(() => {
              this.CHANGE_CLIENT_CART(payload);
            }, 600);
          }
        } else {
          clearTimeout(this.debounceId);
          this.REMOVE_IN_CART([payload]);
        }
      },
  
      plusCart() {
        const amount = (
          parseFloat(this.getProviderAmount(this.providerId)) +
          parseFloat(this.product.measureStep)
        ).toFixed(1);
        // добавляет в корзину только если товара достаточно для покупки
        if (this.currentProvider.balance < parseFloat(amount)) {
          this.$notify({
            group: "app",
            type: "error",
            duration: 2000,
            title: this.$i18n.t("errors.atention"),
            text: this.$i18n.t("errors.noProducts"),
          });
          return;
        }
        // ошибка по лимитам для доставки
        if (
          this.product?.limit !== null &&
          this.product?.limit < parseFloat(amount)
        ) {
          this.$notify({
            group: "app",
            type: "error",
            duration: 2000,
            title: this.$i18n.t("errors.atention"),
            text: this.$i18n.t("errors.noMoreProducts"),
          });
          return;
        }
        const payload = {
          amount,
          departmentId: this.currentProvider.departmentId,
          productId: this.product.providerProductId,
          providerId: this.providerId,
          balance: this.currentProvider.balance,
          packetStep: this.curDep?.packetStep,
        };
        this.NEW_AMOUNT(payload);
        // если зареганный клиент то отправляем запрос только после того как он накликает нужное количество товара
        if (this.$cookies.get("TOKEN")) {
          if (this.debounceId) {
            clearTimeout(this.debounceId);
          }
          this.debounceId = setTimeout(() => {
            this.CHANGE_CLIENT_CART(payload);
          }, 500);
        }
      },
  
     async addtoCart() {
    const priceToUse = this.isLoyalty
      ? this.currentProvider.discountPrice // Цена со скидкой для лояльных клиентов
      : this.discount &&
        (this.currentProvider.loyaltyDiscount === false ||
          this.currentProvider.loyaltyDiscount === null) &&
        this.currentProvider.discountPrice
      ? this.currentProvider.discountPrice // Цена со скидкой для обычных клиентов с обычной скидкой
      : this.minPrice; // Обычная цена без скидки
  
    const payload = {
      amount: this.product.measureStep.toFixed(1),
      amountStep: this.product.measureStep.toFixed(1),
      clientId: this.$cookies.get("clientId"),
      departmentId: this.currentProvider.departmentId,
      departmentName: this.departmentName,
      img: this.product.images[0],
      measureType: this.product.measureType,
      price: priceToUse, // Используем правильную цену в зависимости от условий
      productId: this.product.providerProductId,
      providerId: this.providerId,
      productName: this.product.name,
      productNameKz: this.product.nameKz,
      balance: this.currentProvider.balance,
      limit: this.product.limit,
      categoryId: this.product.categoryId || this.product.categoryIds[0],
      discountPrice: this.isLoyalty
        ? this.currentProvider.discountPrice
        : null,
      discountPercent: this.isLoyalty
        ? this.currentProvider.discountPercent
        : null,
      departmentIsAyan: this.currentProvider.departmentIsAyan,
      isFavorite: this.isFavorite,
      packetStep: this.curDep?.packetStep,
    };
  
    await this.ADD_TO_CART(payload);
  
    if (this.$cookies.get("TOKEN")) {
      if (this.debounceId) {
        clearTimeout(this.debounceId);
      }
      this.debounceId = setTimeout(() => {
        this.CHANGE_CLIENT_CART(payload);
      }, 600);
    }
  
    const text = JSON.stringify({
      name: this.product.name,
      img: this.product.images[0],
      amount: this.count,
      measure: this.product.measureType,
    });
  
    if (this.$vuetify.breakpoint.smAndUp) {
      this.$notify({
        group: "cartnotification",
        duration: 1500,
        title: `${this.product.name}`,
        text,
      });
    }
  
    this.getAmount();
  },
      // находит поставщика с минимальной ценой продукта
      findProductProviders() {
        if (!this.product.pricesList) {
          return;
        }
        const currentProvider = [...this.product.pricesList].sort(
          (provider1, provider2) => provider1.price - provider2.price
        )[0];
        if (currentProvider) {
          this.currentProvider = currentProvider;
          this.minPrice = currentProvider.price;
          this.departmentName = currentProvider.departmentName;
          this.providerId = parseFloat(currentProvider.providerId);
          this.discount = currentProvider.discount;
          this.curDep = this.GEO.info.depEntities.find(
            (dep) => dep.id === this.currentProvider.departmentId
          );
        } else {
          this.notAvailable = true;
        }
      },
  
      getProviderAmount(id) {
        const product = this.products.find(
          (product) => product.providerId === id
        );
        return product ? parseFloat(product.amount).toFixed(1) : 0;
      },
  
      // продукт для gtm евента
      createGTMProduct () {
        const product = {
          item_id: this.product.providerProductId,
          item_name: this.product.name,
          price: this.minPrice,
          item_category: this.product.categoryId || this.product.categoryIds[0],
          item_list_id: this.product.categoryId || this.product.categoryIds[0],
          affiliation: this.departmentName,
          index: this.product.index || 1,
        };
        return product;
      },
  
      // переход на отдельную страницу товара
      goToProductPage() {
        const gtmProduct = this.createGTMProduct();
        this.$eventBus.$emit("saveScroll");
        this.$router.push(
          `/product/${this.$translit(this.product.name)}-${
            this.product.providerProductId
          }`
        );
        this.$Ecomerce.itemView(gtmProduct);
        this.$Ecomerce.itemClick(gtmProduct);
      },
  
      replaceImage() {
        if (this.$refs.image) {
          this.$refs.image.src = require("@/assets/img/noImg.png");
        }
      },
  
      // если товара меньше единицы, то нужно округлять до десятых, в ином случае только целая часть
      getBalance(balance) {
        if (!balance) {
          return;
        }
        const bal = balance.toFixed(1);
        return bal < 1 ? bal : Math.trunc(bal);
      },
    },
  };
  </script>
  
  <style lang="scss">
  @import "./style";

  </style>