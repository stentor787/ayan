// import Vue from 'vue'
import request from '../core/request'

export default {
  getAllErrors: () => request.get('site/wrong/product/all/errors'),

  sendErrord: payload =>
    request.post('site/worng/product/add', payload, {
      headers: {
        TOKEN: 'a'
      }
    })
}
