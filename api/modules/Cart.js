import request from '../core/request'

export default {
  getBasket: (input, token) =>
    request.post('client/providerBasket/get', input, { token }),
  removeProduct: (input, token) =>
    request.delete('client/providerBasket/deletePart', input, { token }),

  clearClientCart: (input, token) =>
    request.delete(
      'client/providerBasket/delete/all', input, { token }
    )
}
