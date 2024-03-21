import { BASE_DOMAIN } from '@/common/constance'
import axios from 'axios'

// const baseDomain = 'http://universities.hipolabs.com/'
const baseDomain = BASE_DOMAIN
const baseUrl = `${baseDomain}`

export default axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    // 'Content-Type': 'multipart/form-data',
    // Authorization: 'Bearer'
  }
})
