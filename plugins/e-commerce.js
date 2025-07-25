import Vue from 'vue'
/*eslint-disable*/
Vue.prototype.$Ecomerce = {
  valid () {
    if (process.browser && (window.location.host === 'www.ayanmarket.kz' || window.location.host === 'ayanmarket.kz')) {
      window.dataLayer = window.dataLayer || []
      return true
    }
    return false
  },

  add_to_cart (data) {
    if (!this.valid()) { return }
    window.dataLayer.push({ ecommerce: null })
    // Добавили в корзину товар
    // для гугла
    const productsList = this.serializeProducts([data])
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        items: productsList
      }
    })
  },

  remove_to_cart (data) {
    if (!this.valid()) { return }
    // Удалили товар из корзины
    window.dataLayer.push({ ecommerce: null })
    // для гугла
    const productsList = this.serializeProducts([data])
    window.dataLayer.push({
      event: 'remove_from_cart',
      ecommerce: {
        items: productsList
      }
    })
  },

  order_buy (eventObj) {
    if (!this.valid()) { return }
    // Офомляем заказ
    // для гугла
    const productsList = this.serializeProducts(eventObj.products)
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: eventObj.orderId,
        affiliation: 'Website',
        currency: 'KZT',
        value: eventObj.products.reduce((acc, item) => acc +
        (item.totalDiscountPrice
          ? parseFloat(item.totalDiscountPrice)
          : parseFloat(item.totalPrice)
            ? parseFloat(item.totalPrice)
            : parseFloat(item.price) * parseFloat(item.amount)), 0),
        shipping: 0.00,
        payment_type: eventObj.payment_type,
        items: productsList
      }
    })
  },
  //  функции для Google Tag Manager
  // переход на страницу
  sendPage (city, pageType, categoryName = null) {
    if (!this.valid()) { return }
    const eventObject = {
      userСity: city,
      pageType,
      categoryName
    }
    window?.dataLayer.push(eventObject)
  },
  // авторизация
  authorization (userId) {
    if (!this.valid()) { return }
    const eventObject = {
      event: 'authorization',
      userId
    }
    window.dataLayer.push(eventObject)
  },
  // открытие окна авторизации
  authorizationOpen () {
    if (!this.valid()) { return }
    const eventObject = {
      event: 'GAEvent',
      eCategory: 'user',
      eAction: 'auth',
      eLabel: 'open'
    }
    window.dataLayer.push(eventObject)
  },
  // успешная авторизация
  authorizationComplete () {
    if (!this.valid()) { return }
    const eventObject = {
      event: 'GAEvent',
      eCategory: 'user',
      eAction: 'auth',
      eLabel: 'complete'
    }
    window.dataLayer.push(eventObject)
  },
  // клик по телефону
  phoneClick () {
    if (!this.valid()) { return }
    const eventObject = {
      event: 'GAEvent',
      eCategory: 'phoneButton',
      eAction: 'click',
      eLabel: ''
    }
    window.dataLayer.push(eventObject)
  },
  // клик по почте
  emailClick (email) {
    if (!this.valid()) { return }
    const eventObject = {
      event: 'GAEvent',
      eCategory: 'externalLink',
      eAction: 'click',
      eLabel: `mailto: ${email}`
    }
    window.dataLayer.push(eventObject)
  },
  // просмотр списка товаров
  itemsList (products) {
    if (!this.valid()) { return }
    window.dataLayer.push({ ecommerce: null })
    // формируем массив под данные GTM
    const items = (function () {
      const list = []
      for (let i = 0; i < products.length; i++) {
        list.push({
          item_id: products[i].providerProductId,
          item_name: products[i].name,
          price: products[i].priceMap ? Object.values(products[i].priceMap)[0]?.price : null,
          // в поиске приходит чуть другой объект с продуктами, спасибо беку((
          item_category: products[i].categoryId || products[i].categoryIds[0],
          item_list_id: products[i].categoryId || products[i].categoryIds[0]
        })
      }
      return list
    }())
    const eventObject = {
      event: 'view_item_list',
      ecommerce: {
        items
      }
    }
    window.dataLayer.push(eventObject)
  },
  // клик по товару
  itemClick (product) {
    if (!this.valid()) { return }
    window.dataLayer.push({ ecommerce: null })
    const eventObject = {
      event: 'select_item',
      ecommerce: {
        items: [product]
      }
    }
    window.dataLayer.push(eventObject)
  },
  // открытия окна с отдельным товаром
  itemView (product) {
    if (!this.valid()) { return }
    window.dataLayer.push({ ecommerce: null })
    const eventObject = {
      event: 'view_item',
      ecommerce: {
        items: [product]
      }
    }
    window.dataLayer.push(eventObject)
  },
  // добавление в любимые
  addToFavorite (item) {
    if (!this.valid()) { return }
    window.dataLayer.push({ ecommerce: null })
    const eventObject = {
      event: 'add_to_wishlist',
      ecommerce: {
        items: [item]
      }
    }
    window.dataLayer.push(eventObject)
  },
  // Просмотр корзины
  viewCart (products) {
    if (!this.valid()) { return }
    window.dataLayer.push({ ecommerce: null })
    const productsList = this.serializeProducts(products)
    const eventObject = {
      event: 'view_cart',
      ecommerce: {
        items: productsList
      }
    }
    window.dataLayer.push(eventObject)
  },
  // Просмотр страницы оформления
  viewNewOrder (products) {
    if (!this.valid()) { return }
    window.dataLayer.push({ ecommerce: null })
    const productsList = this.serializeProducts(products)
    const eventObject = {
      event: 'begin_checkout',
      ecommerce: {
        items: productsList
      }
    }
    window.dataLayer.push(eventObject)
  },
  //  Выбор способа оплаты
  addPaymentInfo (eventObj) {
    if (!this.valid()) { return }
    window.dataLayer.push({ ecommerce: null })
    const productsList = this.serializeProducts(eventObj.products)
    const eventObject = {
      event: 'add_payment_info',
      ecommerce: {
        payment_type: eventObj.payment_type,
        items: productsList
      }
    }
    window.dataLayer.push(eventObject)
  },
  serializeProducts (products) {
    const list = []
    for (let i = 0; i < products.length; i++) {
      list.push({
        item_id: products[i].productId,
        item_name: products[i].productName,
        price: products[i].totalPrice || products[i].price,
        item_category: products[i].categoryId,
        item_list_id: products[i].categoryId,
        quantity: parseFloat(products[i].amount),
        affiliation: products[i].departmentName
      })
    }
    return list
  }
}
