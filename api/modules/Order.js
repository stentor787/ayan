// import Vue from 'vue'
import request from '../core/request'

export default {

  /*
  1)/api/site/provider/order/create
  POST запрос отвечает за создание заказа.
  Тело запроса :
  {
    1)String phoneUser (NOT NULL) - телефон
    2)String nameUser (NOT NULL) - имя
    3)String surnameUser (NOT NULL) - фамилия
    4)Long departmentId (NOT NULL) - департамент
      5)List<ProviderOrderProductValidator> products (NOT NULL) - список продуктов {
      5.1)Long productId (NOT NULL) id продукта
      5.2)Float amount (NOT NULL) количество товара
      5.3)Long providerId (NOT NULL) id поставщика
    }
    6)Long paymentTypeId (NOT NULL) id типа оплаты
    7)AddressValidator address (NOT NULL) - адрес доставки
    8)LocalDateTime deliveryTime - Начальное значение времени доставки
    9)String comment - Комментарий
    10)String device - тип устройства
    11)String promoCode - промокод
  }
  */
  
  // Новый эндпоинт для создания заказа V2
  createOrderV2: input => request.post('web/provider/order/createV2', input),
  // Новый эндпоинт для проверки заказа
  checkOrder: input => request.post('web/provider/order/check', input),
  createOrder: input => request.post('site/provider/order/create', input),
  cancelOrder: payload => request.put(`client/providerOrder/order/${payload.orderId}/${payload.tagId}/cancel`),
  getCancelTags: () => request.get('client/cancelOrderTag/all'),
  downloadCheck: (id, token) => request.get(`site/ukassa/check/${id}`),
  getDelivery: payload => request.post('site/delivery/calculate', payload)
}
