import request from '../core/request'

export default {
  getCategorySEO: ({ cityId, keyName }) =>
    request.get(`site/seo/category/${cityId}/${keyName}`),

  getProductSEO: ({ cityId, keyName, departmentId }) =>
    request.get(`site/seo/product/${cityId}/${keyName}/${departmentId}`)
}
