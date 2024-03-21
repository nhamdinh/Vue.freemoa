import Repository from './../Repository'
import { authHeader } from './../authHeader'

export default {
  login(payload: any) {
    return Repository.post(`/auth/login`, payload)
  },
  verifyPhone(payload: any) {
    return Repository.post(`/verify/phone`, payload, { headers: authHeader() })
  },
  verifyOtp(payload: any) {
    return Repository.post(`/verify/otp`, payload, { headers: authHeader() })
  },
  verifyFindId(payload: any) {
    return Repository.post(`/verify/find-id`, payload, { headers: authHeader() })
  },
  changePassword(payload: any) {
    return Repository.post(`/member/change-password`, payload, { headers: authHeader() })
  },
  verifyNewPhone(payload: any) {
    return Repository.post(`/verify/new-phone`, payload)
  },
  verifyNewOtp(payload: any) {
    return Repository.post(`/verify/new-otp`, payload)
  },
  register(payload: any) {
    return Repository.post(`/auth/save`, payload)
  },

  uploadFile(payload: any) {
    return Repository.post(`/awss3/upload-file`, payload, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data',
      }
    })
  },
  getProfile() {
    return Repository.get(`/member/get-user-info`, { headers: authHeader() })
  },
  logOut() {
    return Repository.get(`/auth/logout`, { headers: authHeader() })
  },
  changeName(payload: any) {
    return Repository.put(`/member/change-name?newFullName=${payload.newFullName}`, payload, { headers: authHeader() })
  },
  changeAvatar(payload: any) {
    return Repository.put(`/member/change-avatar?avatar=${payload.avatar}`, payload, { headers: authHeader() })
  },
  changePasswordInfo(payload: any) {
    return Repository.put(`/member/change-password2`, payload, { headers: authHeader() })
  },
  updateProfile(payload: any) {
    return Repository.post(`/member/update-profile`, payload, { headers: authHeader() })
  },
  changePhone(payload: any) {
    return Repository.post(`/member/update-new-phone`, payload, { headers: authHeader() })
  },
}
