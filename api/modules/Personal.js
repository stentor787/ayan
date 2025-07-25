import Vue from 'vue'
import request from '../core/request'

export default {
  getClientAddress: id =>
    request.get(
      `client/${id}/address`,
      {},
      { TOKEN: Vue.prototype.$cookies.get('TOKEN') }
    ),

  addClientAddress: input =>
    request.post(`client/address/${input.cleintId}/add`, input, {
      TOKEN: Vue.prototype.$cookies.get('TOKEN')
    }),

  deleteClientAddress: input =>
    request.delete(`admin/address/delete/${input}`, {
      TOKEN: Vue.prototype.$cookies.get('TOKEN')
    }),

  editClientInfo: input =>
    request.put('client/update', input, {
      TOKEN: Vue.prototype.$cookies.get('TOKEN')
    }),

  getClientInfo: input =>
    request.get(`client/${input}`, {
      TOKEN: Vue.prototype.$cookies.get('TOKEN')
    }),

  getClientOrders: token =>
    request.get('web/client/providerOrder/get/order/history', {}, {
      TOKEN: token
    }),

  getOrderProducts: id =>
    request.get(`site/product/order/${id.order}/department/${id.department}`, {
      TOKEN: Vue.prototype.$cookies.get('TOKEN')
    }),

  requestClientTokenInfo: () =>
    request.get('admin/auth/token', {
      TOKEN: Vue.prototype.$cookies.get('TOKEN')
    })
}
