import Repository from './../Repository'
import { authHeader } from './../authHeader'

export default {
  getListCompany(payload: any) {
    return Repository.post(`/company/get-list`, payload, { headers: authHeader() })
  },
  getListCompanyProduct(payload: any) {
    return Repository.get(`/company/get-product?companyId=${payload?.companyId}&pageSize=3&pageNum=1`, { headers: authHeader() })
  },
  updateFavorite(payload: any) {
    return Repository.post(`/company/update-favorite`, payload, { headers: authHeader() })
  },
  getListGroupsCompany(payload: any) {
    return Repository.get(`/company/get-groups?pageSize=${payload?.pageSize ?? 8}&groupParent=${payload?.groupParent}`, { headers: authHeader() })

  },
  getNotiByGroup(payload: any) {
    return Repository.get(`company/get-group-notification?companyGroupId=${payload.companyGroupId}`, { headers: authHeader() })
  },
  getListTags(payload: any) {
    return Repository.post(`/master-data/get`, payload, { headers: authHeader() })
  },
  createArticleReport(payload: any) {
    return Repository.post(`/article/report`, payload, { headers: authHeader() })
  },
  getHomeBanner(payload: any) {
    return Repository.get(`/home-banner/get`, { headers: authHeader() })

  },
}
