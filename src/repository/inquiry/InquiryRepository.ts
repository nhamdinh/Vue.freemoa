import Repository from '../Repository'
import { authHeader } from '../authHeader'

export default {

  updateEnableNotice(payload: any) {
    return Repository.put(`/member/update-enable-notice?enableNotice=${payload.tab}`, payload, { headers: authHeader() })
  },
  createInquiry(payload: any) {
    return Repository.post(`/question/create`, payload, { headers: authHeader() })
  },
  getAllInquiries(payload: any) {
    return Repository.post(`/question/get-list`, payload, { headers: authHeader() })
  },
}
