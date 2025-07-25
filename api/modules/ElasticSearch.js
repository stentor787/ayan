// import Vue from 'vue'
import request from '../core/request'

export default {
  searchAllInElastic: input => request.post('elastic/product/search', input)
}
