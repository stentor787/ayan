import request from '../core/request'

export default {
  createClientCode: input => request.post('site/client/code', input),

  verifyClientCode: input => request.post('site/client/verify', input),

  verifyClientToken: input => request.post('site/client/verify/token', input)
}
