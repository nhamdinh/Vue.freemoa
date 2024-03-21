import { ACCESSTOKEN_STORAGE } from '@/common/constance'

export const authHeader = () => {
  let authorization = 'Bearer'
  const accessToken = localStorage.getItem(ACCESSTOKEN_STORAGE)
  if (accessToken) {
    authorization = `Bearer ${accessToken}`
  }
  return { Authorization: authorization }
}
