import request from '../core/request'

export default {
  getLinkToRedirect: redirectId =>
    request.get(`site/redirect/single/${redirectId}`)
}
