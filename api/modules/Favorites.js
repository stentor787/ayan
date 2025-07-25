/* eslint-disable */
import request from "../core/request";

export default {
  getDepartments: (clientId, token) =>
    request.get(`site/favorite/departments/get/${clientId}`, {}, { token }),
  addDepartment: (departmentId, token) =>
    request.get(`site/favorite/department/add/${departmentId}`, {}, { token }),
  deleteDepartment: (departmentId, token) =>
    request.delete(
      `site/favorite/departments/delete/${departmentId}`,
      {},
      { token }
    ),

  getProductsWithFilter: (input, token) =>
    request.post("site/favorite/get/filter/site", input, { token }),
  getProducts: (input, token) =>
    request.post("site/favorite/product/get/site", input, { token }),
  addProduct: (productId, token) =>
    request.get(`site/favorite/product/add/${productId}`, {}, { token }),
  deleteProduct: (productId, token) =>
    request.delete(`site/favorite/product/delete/${productId}`, {}, { token })
};
