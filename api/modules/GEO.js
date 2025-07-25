// import Vue from 'vue'
import request from '../core/request'

export default {
  getAllCititesInfo: () => request.get('site/city/cities'),

  getDepartmentInfo: department => request.get(`site/department/${department}`),

  getDepartmentInfoByAddress: (address, token) =>
    token ? request.post('site/geo/find/address', address, { token }) : request.post('site/geo/find/address', address)
}
