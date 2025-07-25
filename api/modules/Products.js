import request from '../core/request'

export default {
  findProductsByFilterWithPagination: input =>
    request.post('elastic/product/site/byName', input),
  // получение продуктов отдельной категории с пагинацией
  getProductsByCategory: (body, token) =>
    token ? request.put('site/provider/product/get/catalog/list/site', body, { token }) : request.put('site/provider/product/get/catalog/list/site', body),
  getSharedProducts: (body, token) =>
    token ? request.post('site/provider/product/get/shared', body, { token }) : request.post('site/provider/product/get/shared', body),
  getShowcaseProducts: (input, token) =>
    token ? request.post('site/showcase/getShowcase/site', input, { token }) : request.post('site/showcase/getShowcase/site', input),

  getDefaultShowcaseProducts: () => request.get('site/showcase/default'),
  // body: {
  //   "providerProductId": "800761",
  //   "departmentIds": [5, 1092]
  // }

  getFilteredProducts: (body, token) => request.put('client/product/get/filter/site', body, { token }),

  getProductRating: payload => request.get(`/site/provider/review/getAverageRating/${payload}`),

  getProductReview: payload => request.post(`/site/provider/review/getAll/${payload.providerProductId}`, payload.body),
  // likes
  plusLike: (payload, token) => request.put(`/site/provider/review/like/increase/${payload}`, {}, { token }),
  minusLike: (payload, token) => request.put(`/site/provider/review/like/decrease/${payload}`, {}, { token }),
  plusDislike: (payload, token) => request.put(`/site/provider/review/dislike/increase/${payload}`, {}, { token }),
  minusDislike: (payload, token) => request.put(`/site/provider/review/dislike/decrease/${payload}`, {}, { token })
}
