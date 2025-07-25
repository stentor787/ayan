import request from '../core/request'
import createParams from '~/utils/createParams'

export default {
  getStaticPage: (localization, payload) => request.get(`static/page/get/${localization}/${payload}`),

  getBanners: payload =>
    request.get(`/admin/banner/get/all/byCityId/new/${payload.cityId}/${payload.device}`),
  getGategoryBanner: payload =>
    request.get(`admin/banner/category/image/${payload.categoryId}${createParams(payload.departments)}`)
}
