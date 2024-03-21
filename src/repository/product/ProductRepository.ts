import Repository from './../Repository'
import { authHeader } from './../authHeader'

export default {
  getListProductTop(payload: any) {
    return Repository.get(`/product/get-top-ten`, { headers: authHeader() })
  },
  getListProduct(payload: any) {
    return Repository.post(`/product/get-list`, payload, { headers: authHeader() })
  },
  getProductById(payload: any) {
    return Repository.get(`/product/get-detail?id=${payload.productId}`, { headers: authHeader() })
  },

}


