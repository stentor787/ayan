import request from '../core/request'

export default {
  getAll: cityId => request.get(`site/promotions/${cityId}`)
}
