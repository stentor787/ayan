import request from '../core/request'
import createParams from '~/utils/createParams'

export default {
  getAllMainCategories: (departments) => {
    return request.get(`site/providerCategory/getAllMainSite${createParams(departments)}`)
  },

  getShowcaseCategories: input =>
    request.post('site/showcase/get/category/all', input),

  getCategoryById: payload =>
    request.get(`site/providerCategory/get/${payload.categoryId}${createParams(payload.departments)}`),

  // вызов списка категорий для роботов
  getDepartmentCategory: () =>
    request.get('site/providerCategory/getCategoryNames?departmentIds=5')
}
