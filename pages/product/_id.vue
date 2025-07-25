
<template>
  <div class="d-flex flex-column align-end mt-1 mr-2">
    <!-- Скидка -->
    <div v-if="productDiscount && !loyalty" 
         :class="['dis-product_card--sale', { 'shift-up': hitProduct }]">
      <div style="margin-top: -3px;">
        {{ $i18n.t("discount.sale") }}
      </div>
    </div>

    <!-- Лояльность -->
    <div v-else-if="loyalty" class="dis-product_card--sale loyalty">
      Скидка клуба
    </div>

    <!-- Мегахит! -->
    <div v-if="hitProduct" class="dis-product_card--hit">
      <div v-if="showForCategoryId(170535)">
        <div style="margin-top: -3px;">
          Мегахит!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AyanFrontendProductdiscount',
  props: {
    productDiscount: {
      type: Boolean,
      default: false
    },
    loyalty: {
      type: Boolean,
      default: false
    },
    productPrice: {
      type: [Number, String],
      default: null
    },
    product: {
      type: Object,
      default: null
    }
  },
  computed: {
    hitProduct () {
      return this.product && this.product.categoryIds && this.showForCategoryId(170535)
    }
  },
  methods: {
    showForCategoryId (categoryId) {
      return this.product.categoryIds.includes(categoryId)
    }
  }
}
</script>
<style lang="scss" scoped>
.dis-product_card__price-percent {
  padding: 2px 12px;
  background: #32C8F0 ;
  width: max-content;
  color: white;
  border-radius: 5px;
  font-size: 11px;
  font-weight: bold;
  @media screen and (max-width: 650px) {
    padding: 2px 6px;
    font-size: 11px;
    white-space: nowrap;
  }
}
.dis-product_card--sale {
    margin-bottom: 9px;
    background-color: #FF9600;
    border-radius: 5px;
    width: 72px;
    height: 16px;
    padding: 2px 3px 2px 3px;
    color: white;
    font-size: 12px;
    z-index: 1;
  @media screen and (max-width: 650px) {
    font-size: 8px;
  }
}
.loyalty {
  margin-bottom: 2px;
    width: 90px;
    height: 20px;
    padding: 2px 3px 2px 3px;
    color: white;
    font-size: 12px;
    background-color: #89CE38;
  
}
.dis-product_card--hit {
  position: absolute;
  top: 55%;
  left: 0px;
  margin-bottom: 9px;
  background: linear-gradient(to bottom right, #FF9600 10%, #FF4A50 30%, #E61E78 90%);
  border-radius: 5px;
  width: 60px;
  height: 16px;
  padding: 2px 3px 2px 3px;
  color: white;
  font-size: 12px;
  z-index: 1;
  @media screen and (max-width: 650px) {
    font-size: 11px;
  }
}
.shift-up {
     margin-bottom: 19px;
}
</style>





product id 


<template>
  <main>
    <section v-if="loading" class="progress">
      <v-progress-circular indeterminate color="#503CC3" />
    </section>
    <section v-else-if="PRODUCT.name" class="product">
      <div class="product_header">
        <!-- хлебные крошки -->
        <div class="product_header__bread">
          <d-breadcrumbs
            :id="PRODUCT.categoryIds[0] || 0"
            :name="PRODUCT.name"
          />
        </div>
        <!-- блок с названием и кнопка избранное -->
        <div class="product_header__title-box">
          <h1 class="product_header__title">
            {{
              $capitalize($i18n.locale === "ru" ? PRODUCT.name : PRODUCT.nameKz)
            }}
          </h1>
          <div class="product_header__favorite" @click="checkFavorite()">
            <v-btn
              :elevation="0"
              :color="isFavorite ? '#EE4C48' : 'black'"
              icon
            >
              <v-icon>{{
                isFavorite ? "mdi-heart" : "mdi-heart-outline"
              }}</v-icon>
            </v-btn>
          </div>
        </div>
        <!-- блок рейтинга -->
        <div class="product_header__rate">
          <div class="product_header__star-block">
            <v-rating
              :value="PRODUCT.rating"
              readonly
              half-increments
              length="5"
              color="orange lighten-3"
              :size="16"
              background-color="#050505"
              class="product_header__star"
            />
            <p>
              {{
                PRODUCT.rating
                  ? PRODUCT.rating.toFixed(1)
                  : $i18n.t("product.noRate")
              }}
            </p>
          </div>
          <p v-if="reviews">
            {{ $i18n.t("product.reviews") }} {{ reviews.length }}
          </p>
        </div>
      </div>
      <!-- основной блок с товаром -->
      <div v-if="!noBalance" class="product_card">
        <div class="all-images">
          <div class="image-block">
            <div class="prodprice-block_sale" style="top: 1px;">
          
              <lazy-product-discount
                v-if="isLoyalty"
                :class="{ promo: true, 'not-available': notAvailable }"
                :product-discount="discount"
                :product-price="minPrice"
                :product="product"
                :loyalty="isLoyalty && currentProvider.loyaltyDiscount"
              />
              <lazy-product-discount
                style="top: 1px;"
                v-if="!currentProvider.loyaltyDiscount && discount"
                :class="{ promo: true, 'not-available': notAvailable }"
                :product-discount="discount"
                :product-price="minPrice"
                :product="product"
                :loyalty="isLoyalty && currentProvider.loyaltyDiscount"
              />
            </div>
            <div style="
            left: 40%;
    position: absolute;
    margin-bottom: 9px;
    background-color: rgb(255, 150, 0);
    border-radius: 5px;
    width: 72px;
    height: 16px;
    padding: 2px 3px;
    color: white;
    font-size: 12px;
    z-index: 1;" v-if="!currentProvider.loyaltyDiscount && discount">
             <div style="margin-top: -3px;">
        {{ $i18n.t("discount.sale") }}
      </div>
            </div>
            <div style="
                border-radius: 5px;
    left: 40%;
    z-index: 1;
    position: absolute;
    margin-bottom: 2px;
    width: 90px;
    height: 22px;
    padding: 2px 3px 2px 3px;
    color: white;
    font-size: 12px;
    background-color: #89CE38;" v-if="currentProvider.loyaltyDiscount !== false && 
      currentProvider.loyaltyDiscount !== null && 
      discount && isLoyalty">
              Скидка клуба
            </div>
            <!-- основные изображения -->
            <div class="fill-height">
              <img
                v-if="selectedImageIndex !== null"
                ref="image"
                :src="PRODUCT.images[selectedImageIndex]"
                :alt="PRODUCT.name"
                :title="PRODUCT.name"
                class="image-block_main"
                @error="replaceImage('image')"
              />
            </div>
            <!-- вертикальные изображения -->
            <div class="images_small">
              <button
                v-if="PRODUCT.images.length > 5"
                class="d-flex justify-center"
                @click="scrollImages('up', $refs.imagesVertical)"
              >
                <v-icon>mdi-chevron-up</v-icon>
              </button>
              <div ref="imagesVertical" class="images_vertical">
                <div
                  v-for="(image, index) in PRODUCT.images"
                  :key="index"
                  :class="{
                    images_small_img: true,
                    selected: selectedImageIndex === index
                  }"
                  class="text-center"
                >
                  <img
                    v-if="image"
                    :ref="'minImg' + index"
                    :src="image"
                    :alt="PRODUCT.name"
                    :title="PRODUCT.name"
                    class="thumbnail"
                    @error="replaceImage('minImg' + index)"
                    @click="changeMainImage(index)"
                  />
                </div>
              </div>
              <button
                v-if="PRODUCT.images.length > 5"
                class="d-flex justify-center"
                @click="scrollImages('down', $refs.imagesVertical)"
              >
                <v-icon>mdi-chevron-down</v-icon>
              </button>
            </div>
          </div>
          <!-- горизонтальные изображения -->
          <div class="d-flex pt-2">
            <div class="images_button">
              <AddReview
                :rating="reviews.map(item => item.valueRating)"
                :total="PRODUCT.rating.toFixed(1)"
                :use-icon="true"
                @openModal="modalReview = true"
              />
            </div>
            <button
              v-if="IMAGES_PROVIDER_PRODUCT.length > 5"
              class="d-flex align-center"
              @click="scrollImages('left', $refs.imagesHorizontal)"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </button>
            <div ref="imagesHorizontal" class="images_horizontal">
              <div
                v-for="(image, index) in IMAGES_PROVIDER_PRODUCT"
                :key="index"
                class="text-center images_small_img"
              >
                <img
                  :src="image"
                  :alt="PRODUCT.name"
                  :title="PRODUCT.name"
                  class="thumbnail"
                  @click="openFotoSlider(IMAGES_PROVIDER_PRODUCT, index)"
                />
              </div>
            </div>
            <button
              v-if="IMAGES_PROVIDER_PRODUCT.length > 5"
              class="d-flex align-center"
              @click="scrollImages('right', $refs.imagesHorizontal)"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </button>
          </div>
        </div>
        <!-- блок с характеристиками -->
      
        <!-- блок с ценами -->
        <div   :class="mainFeatures && 'prodprice-small'">
          <div>
            <div
              :class="discount && 'product-price'"
              class="prodprice-block_price d-flex"
            >
              <span
                v-if="
                  !discount && !isLoyalty && !currentProvider.loyaltyDiscount
                "
              >
                {{ formatNumber(minPrice) }} ₸
              </span>
              <!-- Цена со скидкой -->
              <span
                v-if="
                  (currentProvider.loyaltyDiscount === false ||
                    currentProvider.loyaltyDiscount === null) &&
                    discount &&
                    !isLoyalty &&
                    currentProvider.discountPrice
                "
                class="dis-product_card__price-sale price now-price"
              >
                {{ formatNumber(currentProvider.discountPrice) }} ₸
              </span>
              <span
                v-if="
                  (currentProvider.loyaltyDiscount === false ||
                    currentProvider.loyaltyDiscount === null) &&
                    discount &&
                    !isLoyalty &&
                    currentProvider.discountPrice
                "
                class="dis-product_card__old-price old-price"
              >
                {{ formatNumber(minPrice) }} ₸
              </span>

              <!-- Если нет скидки и нет лояльности, показываем обычную цену -->
              <span
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

              <span
  v-else-if="currentProvider.discountPercent"
  style="font-weight: 500; position: absolute; padding-bottom: 1px; margin-top: 10px; color: white; border-radius: 3px; width: 36px; font-size: 12px; height: 16px;"
  :class="{
    'dis-product_card_green-percent': (
      currentProvider.loyaltyDiscount !== false && 
      currentProvider.loyaltyDiscount !== null && 
      discount && isLoyalty
    ),
    'sdviggreen': true,
    'dis-product_card_red-percent': !(currentProvider.loyaltyDiscount !== false && currentProvider.loyaltyDiscount !== null && discount)
  }"
>
  {{ '-' + currentProvider.discountPercent + " %" }}
</span>


              <!-- Отображение цены со скидкой для лояльных клиентов -->
              <span
                v-if="discount && isLoyalty"
                :class="{
                  'dis-product_card__price-sale now-price':
                    discount && currentProvider.discountPrice
                }"
              >
                {{
                  currentProvider.discountPrice
                    ? currentProvider.discountPrice + " ₸"
                    : ""
                }}
              </span>

              <!-- Отображение обычной цены при наличии скидки и лояльности -->
              <span
                v-if="isLoyalty"
                :class="{
                  'dis-product_card__old-price old-price':
                    discount && currentProvider.discountPrice,
                  'dis-product_card__price-sale now-price': !(
                    discount && currentProvider.discountPrice
                  )
                }"
              >
                {{ formatNumber(minPrice) }} ₸
              </span>
              <span
                style="position: absolute; left: 54%; top: 300px;"
                v-if="isValidLoyaltyStatus()"
                class="dis-product_card_percent dis-product_card_green-percent sdvig"
              >
                С картой дешевле
              </span>

              <!-- Добавленная проверка -->
              <span
                v-if="discount && !currentProvider.discountPrice && !isLoyalty"
              >
                {{ formatNumber(minPrice) }} ₸
              </span>
            </div>

            <!-- блок количества товара -->
            <div class="prodprice-block_available">
              <div class="d-flex align-center mr-2">
                <v-icon
                  v-for="item in balance.content"
                  :key="'balance_' + item.id"
                  x-small
                  :color="item.color"
                >
                  mdi-moon-full
                </v-icon>
              </div>
              <span> {{ balance.status }}, {{ balance.val }} </span>
            </div>

            <!-- кнопки покупки -->
            <div class="prodprice-block_btns-cont">
              <v-btn
                v-if="!getProviderAmount(currentProvider)"
                class="d_product_card_button white--text"
                style="border-radius: 10px"
                color="#503CC3"
                @click="addtoCart(currentProvider)"
              >
                {{ $i18n.t("productDialog.buy") }}
              </v-btn>
              <div v-else class="prodprice-block_btns-cont_plus">
                <v-btn
                  class="prodprice-block_btns-cont_mini-btn white--text"
                  color="#503CC3"
                  @click="minusCart(currentProvider)"
                >
                  -
                </v-btn>
                <v-text-field
                  ref="inputref"
                  v-model="currentAmmount"
                  class="mt-0 pt-0 prodprice-block_btns-cont_center"
                  hide-details
                  color="white"
                  type="number"
                  @input="changeAmount($event, currentProvider)"
                />
                <v-btn
                  class="prodprice-block_btns-cont_mini-btn white--text"
                  color="#503CC3"
                  @click="plusCart(currentProvider)"
                >
                  +
                </v-btn>
              </div>
              <v-btn
                v-if="productProviders.length > 1"
                outlined
                class="prodprice-block_btn-violet"
                @click="
                  $refs.price.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  })
                "
              >
                {{ $i18n.t("productDialog.more") }}
                {{ productProviders.length - 1 }} {{ differentEnding }} от
                {{ minPriceOnBtn.toLocaleString("ru") }} ₸
              </v-btn>
            </div>
            <!-- продавец товара -->
            <div class="prodprice-block_provider">
              <v-img
                :src="
                  currentProvider.providerPicture ||
                    require('@/assets/img/shop.png')
                "
                class="prodprice-block_provider-img"
              />
              <div class="prodprice-block_provider-text">
                <p class="prodprice-block_price-text">
                  {{ $i18n.t("productDialog.salesman") }}
                </p>
                <p
                  class="prodprice-block_price-provider"
                  @click="activeShopMode(currentProvider)"
                >
                  {{ currentProvider.departmentName }}
                  <span v-if="fetchingCategory">
                    <v-progress-circular indeterminate color="#503CC3" />
                  </span>
                </p>
                <p class="tabs_title__list-item_payment">
                  {{ currentProvider.paymentType }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Блок табов -->
      <v-tabs v-model="tab" color="#5D4BD0" class="tabs">
        <v-tab class="tabs_btn">
          {{ $i18n.t("product.about") }}
        </v-tab>
        <div class="tabs_line">|</div>
        <v-tab class="tabs_btn">
          {{ $i18n.t("product.char") }}
        </v-tab>
        <div class="tabs_line">|</div>
        <v-tab class="tabs_btn">
          {{ $i18n.t("product.reviews") }}
          {{ `  ${reviewsCount ? reviewsCount : ""}` }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" class="tabs_item">
        <!-- таб с описанием товара -->
        <v-tab-item>
          <div class="tabs_review-block">
            <div class="tabs_review">
              <Review
                :reviews="reviews.length ? [reviews[0]] : []"
                @getRevievs="getRevievs()"
                @openFotoSlider="openFotoSlider($event)"
              />
            </div>
            <AddReview
              :rating="reviews.map(item => item.valueRating)"
              :total="PRODUCT.rating.toFixed(1)"
              @openModal="modalReview = true"
            />
          </div>
          <v-btn
            v-if="reviews && reviews.length"
            outlined
            class="prodprice-block_btn-violet gap"
            @click="tab = 2"
          >
            {{ $i18n.t("product.allReview") }}
          </v-btn>
          <div class="tabs_title">
            <span v-if="PRODUCT.description">
              {{ $i18n.t("productDialog.description") }}
            </span>
          </div>
          <div class="d_product_card_desc">
            <p class="tabs_description pl-2" :class="{ expanded: isExpanded }">
              {{ PRODUCT.description }}
            </p>
            <div class="d-flex justify-center">
              <v-icon
                v-if="PRODUCT.description.length > 200"
                @click="isExpanded = !isExpanded"
              >
                {{ isExpanded ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
            </div>
          </div>
        </v-tab-item>
        <!-- таб с характеристиками товара -->
        <v-tab-item>
          <div
            v-if="PRODUCT.featureProductDtoList.length"
            ref="feature"
            class="feature-tab"
          >
            <div
              v-for="group in PRODUCT.featureProductDtoList"
              :key="group.featureGroup.id"
            >
              <p class="feature-tab_title">
                {{ group.featureGroup.name }}
              </p>
              <div class="feature-tab_group">
                <div
                  v-for="feature in group.features"
                  :key="feature.featureName"
                  class="feature-tab_feature"
                >
                  <span class="feature_name">
                    {{ feature.featureName }} :
                  </span>
                  <div class="feature-tab_feature__under" />
                  <span class="feature_value">{{ feature.value }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else>Характеристики скоро появятся</div>
        </v-tab-item>
        <!-- таб с отзывами -->
        <v-tab-item>
          <div class="tabs_review-block">
            <div class="tabs_review">
              <Review
                :reviews="reviews"
                @getRevievs="getRevievs()"
                @openFotoSlider="openFotoSlider($event)"
              />
            </div>
            <AddReview
              :rating="reviews.map(item => item.valueRating)"
              :total="PRODUCT.rating.toFixed(1)"
              @openModal="modalReview = true"
            />
          </div>
        </v-tab-item>
      </v-tabs-items>

      <!-- доп кнопки для покупок если больше одного поставщика -->
      <div v-if="productProviders.length > 1" ref="price">
        <p class="tabs_title">
          {{ $i18n.t("productDialog.prices") }}
        </p>
        <ul class="tabs_title__list">
          <li
            v-for="provider in productProviders"
            :key="provider.id + provider.departmentId"
            class="tabs_title__list-item"
          >
            <v-img
              :src="
                provider.providerPicture || require('@/assets/img/shop.png')
              "
              class="tabs_title__list-item_img"
            />
            <p
              class="tabs_title__list-item_text"
              @click="activeShopMode(provider)"
            >
              {{ provider.departmentName }}
            </p>

            <p class="tabs_title__list-item_payment">
              {{ provider.paymentType }}
            </p>

            <p class="tabs_title__list-item_text">
              {{
                provider.discountPrice ? provider.discountPrice : provider.price
              }}
              ₸
            </p>
            <div
              v-if="!getProviderAmount(provider)"
              class="prodprice-block_btns-cont_plus-mini"
            >
              <v-btn
                class="tabs_title__list-item_btn"
                @click="addtoCart(provider)"
              >
                {{ $i18n.t("productDialog.buy") }}
              </v-btn>
            </div>
            <div v-else class="prodprice-block_btns-cont_plus-mini">
              <v-btn
                class="d_product_card_mini-btn white--text"
                color="#503CC3"
                @click="minusCart(provider)"
              >
                -
              </v-btn>
              <v-btn
                class="d_product_card_mini-btn white--text"
                color="#503CC3"
              >
                {{ getProviderAmount(provider) }}
              </v-btn>
              <v-btn
                class="d_product_card_mini-btn white--text"
                color="#503CC3"
                @click="plusCart(provider)"
              >
                +
              </v-btn>
            </div>
          </li>
        </ul>
      </div>
      <!-- форма с ошибками -->
      <error-form
        v-if="showError"
        :show="showError"
        :product="PRODUCT"
        @close_modal="showError = false"
      />
      <ReviewModal
        :modal.sync="modalReview"
        :product-id="PRODUCT.name ? PRODUCT.providerProductId : 0"
      />
      <FotoSlider :modal.sync="modalPhotoSlider" :foto="currentFotoArr" />
    </section>
    <!-- блок если продукта нет на филиале -->
    <div v-else class="product_no-find">
      {{ $i18n.t("product.notAvailable") }}
    </div>
    <!-- похожие товары-->
    <div v-if="sameProducts.length" class="product-category">
      <p class="product-category_name">
        {{ $i18n.t("product.same") }}
      </p>
      <div class="product-category_products">
        <d-product-card
          v-for="product in sameProducts"
          :key="product.providerProductId"
          :product="product"
        />
      </div>
    </div>
    <!-- недавно просмотренные -->
    <div v-if="VIEW_PRODUCTS.length" class="product-category">
      <p class="product-category_name">
        {{ $i18n.t("product.view") }}
      </p>
      <div class="product-category_products">
        <d-product-card
          v-for="product in VIEW_PRODUCTS"
          :key="product.providerProductId"
          :product="product"
        />
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DBreadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ErrorForm from "@/components/ErrorForm/ErrorForm";
import AddReview from "@/components/Product/AddReview";
import FotoSlider from "@/components/Product/FotoSlider";
import Review from "@/components/Product/Review";
import ReviewModal from "@/components/Product/ReviewModal";
import DProductCard from "@/components/ProductCard/ProductCard";
import getBalance from "@/utils/balance";

export default {
  components: {
    DBreadcrumbs,
    ErrorForm,
    DProductCard,
    AddReview,
    Review,
    ReviewModal,
    FotoSlider
  },
  data() {
    return {
      isExpanded: false,
      dialog: false,
      selectedImageIndex: 0,
      isModalOpen: false,
      images: [],
      loading: false,
      value: true,
      showError: false,
      minPrice: 0,
      minPriceOnBtn: 0,
      productProviders: [],
      currentProvider: {},
      curDep: null,
      currentAmmount: 0,
      noBalance: false,
      products: [],
      sameProducts: [],
      discount: false,
      departments: [],
      tab: 0,
      isFavorite: false,
      reviews: [],
      reviewsCount: 0,
      modalReview: false,
      page: 0,
      currentFotoArr: [],
      modalPhotoSlider: false,
      mainFeatures: null,
      debounceId: null,
      fetchingCategory: false,
      isLoyalty: false
    };
  },
  computed: {
    ...mapGetters({
      GEO: "GEO/STATE",
      CART: "Cart/STATE",
      PRODUCT: "Products/SHARE_PRODUCT",
      PROVIDERS: "Providers/STATE",
      PERSONAL: "Personal/STATE",
      VIEW_PRODUCTS: "Products/VIEW_PRODUCTS",
      PRODUCT_CATEGORY: "Products/PRODUCT_CATEGORY",
      IMAGES_PROVIDER_PRODUCT: "Products/IMAGES_PROVIDER_PRODUCT"
    }),
    differentEnding() {
      if (this.$i18n.locale === "kz") {
        return "ұсыныс";
      }
      let str = "";
      switch (this.productProviders.length - 1) {
        case 1:
          str = "предложение";
          break;
        case 2:
        case 3:
        case 4:
          str = "предложения";
          break;
        default:
          str = "предожений";
      }
      return str;
    },
    balance() {
      return getBalance(this.currentProvider, this.PRODUCT.measureType);
    }
  },
  watch: {
    "CART.details.totalPrice": function() {
      this.getAmount();
    }
  },
  mounted() {
    // Загружаем статус лояльности из локала
    const storedLoyaltyStatus = localStorage.getItem("isLoyalty");
    if (storedLoyaltyStatus !== null) {
      this.isLoyalty = JSON.parse(storedLoyaltyStatus); // Применяем сохранённое  значение лояльности
    }

    this.renderPage();
    this.$eventBus.$on("changeDepartment", force => {
      if (this.$route.name === "product-id") {
        // На всякий добавил проверку перед вызовом renderPage
        if (force !== undefined && typeof force === "boolean") {
          this.renderPage(force);
        } else {
          console.warn("Invalid force parameter");
        }
      }
    });
  },
  beforeDestroy() {
    // Сохраняем продукт в просмотренных когда уходим со страницы
    if (this.PRODUCT && this.PRODUCT.name) {
      // доп проверка перед вызовом SAVE_TO_VIEW_PRODUCTS
      if (typeof this.SAVE_TO_VIEW_PRODUCTS === "function") {
        this.SAVE_TO_VIEW_PRODUCTS(this.PRODUCT);
      } else {
        console.warn("SAVE_TO_VIEW_PRODUCTS is not a function");
      }
    }
  },
  methods: {
    ...mapActions({
      ADD_TO_CART: "Cart/ADD_TO_CART",
      REMOVE_IN_CART: "Cart/REMOVE_IN_CART",
      NEW_AMOUNT: "Cart/NEW_AMOUNT",
      CHANGE_CLIENT_CART: "Cart/CHANGE_CLIENT_CART",
      GET_SHARE_PRODUCT: "Products/GET_SHARE_PRODUCT",
      SAVE_TO_VIEW_PRODUCTS: "Products/SAVE_TO_VIEW_PRODUCTS",
      GET_PRODUCTS_BY_CATEGORY: "Products/GET_PRODUCTS_BY_CATEGORY",
      ADD_PRODUCT_TO_FAV: "Favorites/ADD_PRODUCT_TO_FAV",
      REMOVE_PRODUCT_FROM_FAV: "Favorites/REMOVE_PRODUCT_FROM_FAV",
      GET_REVIEWS: "Review/GET_REVIEWS",
      GET_IMAGES_PROVIDER_PRODUCT: "Products/GET_IMAGES_PROVIDER_PRODUCT",
      GET_DEPARTMENT_BY_ADDRESS: "GEO/GET_DEPARTMENT_BY_ADDRESS",
      SET_ACTIVE_SHOP: "GEO/SET_ACTIVE_SHOP",
      GET_HOVER_PANEL_CATEGORIES: "Category/GET_HOVER_PANEL_CATEGORIES"
    }),
    async renderPage(force) {
      this.loading = true;
      await this.setDepartment(force);
      await this.GET_SHARE_PRODUCT({
        departmentIds: this.departments,
        providerProductId: this.$route.params.id.split("-").pop()
      });
      if (!this.PRODUCT.name) {
        this.loading = false;
        return;
      }
      // получаем главные характеристики
      this.getMainFeatures();
      this.isFavorite = this.PRODUCT.isFavorite;
      this.getSameProducts();
      this.findProductProviders();
      this.getAmount();
      await this.getRevievs();
      this.payload = {
        providerProductId: this.PRODUCT.providerProductId,
        providerId: this.currentProvider.id
      };
      await this.GET_IMAGES_PROVIDER_PRODUCT({
        providerProductId: this.PRODUCT.providerProductId
      });
      this.loading = false;
    },
    formatNumber(num) {
      if (num === null || num === undefined) {
        return "";
      }
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    // достает из всех характеристик только главные
    getMainFeatures() {
      let arr = [];
      this.PRODUCT.featureProductDtoList.forEach(item => {
        const mainFeatures = item.features.filter(feature => feature.isMain);
        if (mainFeatures.length) {
          this.mainFeatures = arr.concat(mainFeatures);
          arr = [...this.mainFeatures];
        }
      });
    },
    goToFeatures() {
      this.tab = 1;
      const id = setTimeout(() => {
        this.$refs.feature.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        clearTimeout(id);
      }, 100);
    },
    changeMainImage(index) {
      this.selectedImageIndex = index;
    },
    // передвигает картинки
    scrollImages(direction, container) {
      const scrollDistance = 100;
      switch (direction) {
        case "up":
          container.scrollTop -= scrollDistance;
          break;
        case "down":
          container.scrollTop += scrollDistance;
          break;
        case "left":
          container.scrollLeft -= scrollDistance;
          break;
        case "right":
          container.scrollLeft += scrollDistance;
          break;
      }
    },
    // меняет массив с фото для показа
    createArr(arr, index) {
      const newArr = [...arr];
      if (index === 0) {
        return arr;
      } else {
        // меняем местами выбранное фото с первым, чтобы первым открывалось оно
        const deleted = newArr.splice(0, 1, arr[index]);
        newArr.splice(index, 1, deleted[0]);
        return newArr;
      }
    },
    openFotoSlider(images, index) {
      const fotoArr = this.createArr(images, index);
      this.modalPhotoSlider = true;
      this.currentFotoArr = fotoArr;
    },
    async getRevievs() {
      const payload = {
        providerProductId: this.PRODUCT.providerProductId,
        body: {
          page: this.page,
          size: 6
        }
      };
      const response = await this.GET_REVIEWS(payload);
      this.reviews = response.providerReviews.content;
      this.reviewsCount = response.providerReviewCounter;
    },
    // достаем похожие продукты из такой же категории
    async getSameProducts() {
      if (!this.PRODUCT.categoryIds.length) {
        return;
      }
      const payload = {
        departmentIds: this.departments,
        categoryId: this.PRODUCT.categoryIds[0],
        size: 7,
        page: 0
      };
      await this.GET_PRODUCTS_BY_CATEGORY(payload);
      // фильтруем чтобы в похожих товарах не было того же который смотрим
      this.sameProducts = this.PRODUCT_CATEGORY[this.PRODUCT.categoryIds[0]]
        .filter(product => {
          return (
            product.providerProductId.toString() !==
            this.$route.params.id.split("-").pop()
          );
        })
        .slice(0, 6);
    },
    // устанавливаем филиал в зависимости от стора и куки
    async setDepartment(force) {
      if (this.GEO.activeShop.id) {
        this.departments = [this.GEO.activeShop.id];
        return;
      }
      const departments = this.$cookies.get("availableDepartments");
      if (force || this.GEO.info.address.save) {
        if (departments) {
          this.departments = departments;
        } else {
          // если адрес сохранен, но в куки департаментов нет, то подтягиваем их а если нет то дефолтную геоточку
          await this.GET_DEPARTMENT_BY_ADDRESS(
            this.GEO.info.address.geo || this.$getGeo(this.GEO.info.activeCity)
          );
        }
      } else if (!departments) {
        // если нет сохраненного адреса то вытаскиваем филиалы из дефолтной точки города
        await this.GET_DEPARTMENT_BY_ADDRESS(
          this.$getGeo(this.GEO.info.activeCity)
        );
      }
      this.departments = this.$cookies.get("availableDepartments");
    },
    // Обновление статуса лояльности в localStorage
    updateLoyaltyStatus() {
      try {
        const loyaltyStatus = this.PERSONAL?.clientSingle?.isLoyalty;
        if (typeof loyaltyStatus !== "boolean") {
          console.error("Некорректное значение loyaltyStatus:", loyaltyStatus);
          return;
        }
        this.isLoyalty = loyaltyStatus;
        localStorage.setItem("isLoyalty", JSON.stringify(loyaltyStatus));
      } catch (error) {
        console.error("Ошибка при обновлении статуса лояльности:", error);
      }
    },

    // Переключение режима лояльности (например, при изменении профиля)
    checkLoyaltyStatus() {
      try {
        if (
          this.PERSONAL?.clientSingle?.isLoyalty !== undefined &&
          this.PERSONAL?.clientSingle?.isLoyalty !== this.isLoyalty
        ) {
          this.updateLoyaltyStatus();
        } else {
          console.warn("Статус лояльности не изменился или undefined");
        }
      } catch (error) {
        console.error("Ошибка при проверке статуса лояльности:", error);
      }
    },
    isValidLoyaltyStatus() {
      try {
        // Проверяем, что currentProvider существует и содержит loyaltyDiscount
        if (
          !this.currentProvider ||
          typeof this.currentProvider.loyaltyDiscount !== "boolean"
        ) {
          console.error(
            "Некорректные данные currentProvider или loyaltyDiscount"
          );
          return false;
        }

        // Проверяем статус лояльности
        if (typeof this.isLoyalty !== "boolean") {
          console.error("Некорректное значение isLoyalty:", this.isLoyalty);
          return false;
        }

        // Условие добавил для отображения элемента чтобы избежать лишних ошибок
        return !this.isLoyalty && this.currentProvider.loyaltyDiscount;
      } catch (error) {
        console.error("Ошибка при проверке статуса лояльности:", error);
        return false;
      }
    },

    // переключает сайт в режим одного поставщика
    async activeShopMode(provider) {
      // если уже в этом режиме то просто перводим на страницу категорий
      if (this.GEO.activeShop.id === provider.departmentId) {
        this.$router.push(
          `/${this.GEO.activeShop.route}/collection/vse-categoryy-0/`
        );
        return;
      }
      const shop = {
        id: provider.departmentId,
        route: `shop-${this.$translit(provider.departmentName)}`
      };
      this.SET_ACTIVE_SHOP(shop);
      this.fetchingCategory = true;
      await this.GET_HOVER_PANEL_CATEGORIES([provider.departmentId]);
      this.$router.push(
        `/${this.GEO.activeShop.route}/collection/vse-categoryy-0/`
      );
    },
    // функции по работе с покупкой товара
    // Получает количество товара в корзине
    getAmount() {
      if (this.CART.all.length > 0) {
        const products = this.CART.all.filter(
          item => item.productId === this.PRODUCT.providerProductId
        );
        if (products.length !== 0) {
          this.products = products;
          this.currentAmmount = this.getProviderAmount(this.currentProvider);
        } else {
          this.products = [];
        }
      } else {
        this.products = [];
      }
    },
    minusCart(provider, quantity) {
      let amountProduct;
      if (quantity) {
        amountProduct = quantity.toFixed(1);
      } else {
        amountProduct = (
          parseFloat(this.getProviderAmount(provider)) -
          parseFloat(this.PRODUCT.measureStep)
        ).toFixed(1);
      }
      const payload = {
        amount: amountProduct,
        departmentId: provider.departmentId,
        productId: this.PRODUCT.providerProductId,
        providerId: provider.providerId,
        price: provider.price,
        discountPrice: provider.discountPrice,
        packetStep: this.curDep?.packetStep
      };
      if (amountProduct > 0) {
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
        this.REMOVE_IN_CART([payload]);
      }
      this.getAmount();
    },

    plusCart(provider, quantity) {
      let amountProduct;
      if (quantity) {
        amountProduct = quantity.toFixed(1);
      } else {
        amountProduct = (
          parseFloat(this.getProviderAmount(provider)) +
          parseFloat(this.PRODUCT.measureStep)
        ).toFixed(1);
      }
      // добавляет в корзину только если товара достаточно для покупки
      if (provider.balance < parseFloat(amountProduct)) {
        this.$notify({
          group: "app",
          type: "error",
          duration: 2000,
          title: this.$i18n.t("errors.atention"),
          text: this.$i18n.t("errors.noProducts")
        });
        this.currentAmmount = this.getProviderAmount(provider);
        return;
      }
      if (
        this.PRODUCT?.limit !== null &&
        this.PRODUCT?.limit < parseFloat(amountProduct)
      ) {
        this.$notify({
          group: "app",
          type: "error",
          duration: 2000,
          title: this.$i18n.t("errors.atention"),
          text: this.$i18n.t("errors.noMoreProducts")
        });
        return;
      }
      const payload = {
        amount: amountProduct,
        departmentId: provider.departmentId,
        productId: this.PRODUCT.providerProductId,
        providerId: provider.id,
        packetStep: this.curDep?.packetStep
      };
      this.NEW_AMOUNT(payload);
      if (this.$cookies.get("TOKEN")) {
        if (this.debounceId) {
          clearTimeout(this.debounceId);
        }
        this.debounceId = setTimeout(() => {
          this.CHANGE_CLIENT_CART(payload);
        }, 600);
      }
      this.getAmount();
    },
    changeAmount(num, provider) {
      if (this.debounceId) {
        clearTimeout(this.debounceId);
      }
      this.debounceId = setTimeout(() => {
        if (num <= 0) {
          clearTimeout(this.debounceId);
          return;
        }
        // введенное количество
        let quantity = parseFloat(num);
        const dif = quantity % +this.PRODUCT.measureStep;
        if (quantity < +this.PRODUCT.measureStep) {
          quantity = +this.PRODUCT.measureStep;
        } else if (dif > +this.PRODUCT.measureStep / 2) {
          quantity += +this.PRODUCT.measureStep - dif;
        } else {
          quantity -= dif;
        }
        const amountProduct = parseFloat(
          this.getProviderAmount(provider)
        ).toFixed(1);
        if (quantity > +amountProduct) {
          this.plusCart(provider, quantity);
        } else {
          this.minusCart(provider, quantity);
        }
      }, 500);
    },
    addtoCart(provider) {
      if (this.GEO.info.address.save === false) {
        this.$eventBus.$emit("editAddress", true);
        return;
      }
      const priceToUse = this.isLoyalty
        ? this.currentProvider.discountPrice // Цена со скидкой для лояльных клиентов
        : this.discount &&
          (this.currentProvider.loyaltyDiscount === false ||
            this.currentProvider.loyaltyDiscount === null) &&
          this.currentProvider.discountPrice
        ? this.currentProvider.discountPrice // Цена со скидкой для обычных клиентов с скидкой
        : this.minPrice; // Обычная цена без скидки

      const payload = {
        amount: this.PRODUCT.measureStep,
        amountStep: this.PRODUCT.measureStep,
        clientId: this.$cookies.get("clientId"),
        departmentId: provider.departmentId,
        departmentName: provider.departmentName,
        img: this.PRODUCT.images[0],
        measureType: this.PRODUCT.measureType,
        price: priceToUse, // Применяем скидку, если есть карта лояльности или исключение
        productId: this.PRODUCT.providerProductId,
        providerId: provider.id,
        productName: this.PRODUCT.name,
        productNameKz: this.PRODUCT.nameKz,
        balance: provider.balance,
        limit: this.PRODUCT.limit,
        categoryId: this.PRODUCT.categoryIds[0],
        departmentIsAyan: provider.departmentIsAyan,
        packetStep: this.curDep?.packetStep
      };

      this.ADD_TO_CART(payload);

      if (this.$cookies.get("TOKEN")) {
        if (this.debounceId) {
          clearTimeout(this.debounceId);
        }
        this.debounceId = setTimeout(() => {
          this.CHANGE_CLIENT_CART(payload);
        }, 600);
      }

      this.getAmount();

      const text = JSON.stringify({
        name: this.PRODUCT.name,
        img: this.PRODUCT.images[0],
        amount: 1,
        measure: this.PRODUCT.measureType
      });

      if (this.$vuetify.breakpoint.smAndUp) {
        this.$notify({
          group: "cartnotification",
          duration: 1000,
          title: `${this.PRODUCT.name}`,
          text
        });
      }
    },
    // находит поставщиков продукта из всех поставщиков
    findProductProviders() {
      const arr = this.PRODUCT.pricesList.map(obj => {
        obj.paymentType = this.GEO.info.depEntities.find(
          dep => dep.id === obj.departmentId
        )?.paymentType;
        obj.id = obj.providerId;
        return obj;
      });
      arr.sort((a, b) => a.price - b.price);
      // находим поставщика с самой низкой ценой
      this.currentProvider = arr[0];
      this.productProviders = arr;
      this.discount =
        this.currentProvider.discount || this.currentProvider.loyaltyDiscount;
      if (
        this.PERSONAL.clientSingle.isLoyalty &&
        this.currentProvider.loyaltyDiscount
      ) {
        this.isLoyalty = true;
      }
      this.minPriceOnBtn = this.currentProvider.price;
      this.minPrice = this.currentProvider.price;
      this.curDep = this.GEO.info.depEntities.find(
        dep => dep.id === this.currentProvider.departmentId
      );
    },
    // проверяет если ли данные продукт данного поставщика в корзине, и возвращает его количество если да
    getProviderAmount(provider) {
      const product = this.products.find(
        product =>
          product.providerId === provider.id &&
          product.departmentId === provider.departmentId
      );
      return product ? parseFloat(product.amount).toFixed(1) : false;
    },

    // функции по работе с любимыми
    checkFavorite() {
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
    async addToFavorite() {
      await this.ADD_PRODUCT_TO_FAV(this.PRODUCT.providerProductId);
      this.isFavorite = true;
      this.$Ecomerce.addToFavorite(this.createGTMProduct());
    },
    async removeFromFavorite() {
      await this.REMOVE_PRODUCT_FROM_FAV(this.PRODUCT.providerProductId);
      this.$eventBus.$emit("delete-favorite");
      this.isFavorite = false;
    },
    replaceImage(refName) {
      if (this.$refs[refName]) {
        if (refName === "image") {
          this.$refs[refName].src = require("@/assets/img/noImg.png");
        } else if (this.$refs[refName][0]) {
          this.$refs[refName][0].src = require("@/assets/img/noImg.png");
        }
      }
    },
    // продукт для gtm евента
    createGTMProduct() {
      const product = {
        item_id: this.PRODUCT.providerProductId,
        item_name: this.PRODUCT.name,
        price: this.minPrice,
        item_category: this.PRODUCT.categoryIds[0],
        item_list_id: this.PRODUCT.categoryIds[0],
        affiliation: this.currentProvider.departmentName,
        index: this.PRODUCT.index || 1
      };
      return product;
    }
  },
  head() {
    return {
      title: `${this.PRODUCT.name || ""}  купить с доставкой на дом по ${this
        .minPrice || 1000} ₸ | Ayanmarket`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `${this.PRODUCT.name ||
            ""} с доставкой на дом. Онлайн заказ товаров для дома и продуктов питания из супермакетов Аян. 
          Бесплатная доставка при заказе от 5000 тенге за час! Звоните: 8 778 097-07-05 | Ayanmarket `
        }
      ],
      link: [
        {
          rel: "canonical",
          href: `https://ayanmarket.kz${this.$route.path}`
        }
      ]
    };
  }
};
</script>

<style lang="scss">
@import "./id";
</style>