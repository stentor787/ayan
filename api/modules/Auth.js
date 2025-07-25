import request from '../core/request'

export default {
  signIn: input => request.post('client/auth/signin', input),

  signUp: input => request.post('client/auth/add', input),

  resetPass: input => request.put('client/auth/reset/password', input),

  refreshToken: input => request.post('site/client/refresh/token', input)
}
