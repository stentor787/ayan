import request from '../core/request'

export default {
  createReview: (payload, token) => request.post('/site/provider/review/create', payload, { token }),

  downloadReviewFoto: (payload, token) => request.post(`/site/provider/review/image/upload/${payload.id}`, payload.files, { token }),

  getProductReview: (payload, token) => token
    ? request.post(`/site/provider/review/getAll/${payload.providerProductId}`, payload.body, { token })
    : request.post(`/site/provider/review/getAll/${payload.providerProductId}`, payload.body),
  // likes
  plusLike: (payload, token) => request.put(`/site/provider/review/like/increase/${payload}`, {}, { token }),
  minusLike: (payload, token) => request.put(`/site/provider/review/like/decrease/${payload}`, {}, { token }),
  plusDislike: (payload, token) => request.put(`/site/provider/review/dislike/increase/${payload}`, {}, { token }),
  minusDislike: (payload, token) => request.put(`/site/provider/review/dislike/decrease/${payload}`, {}, { token }),
  checkReview: (clientId, productId, token) => 
    request.get(`/site/provider/review/check/${clientId}/${productId}`, { token })
}
