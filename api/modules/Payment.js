// import Vue from 'vue'
import request from '../core/request'

export default {
  getAllPaymentTypes: () => request.get('site/paymentType/all')
}
