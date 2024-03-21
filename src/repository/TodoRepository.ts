import Repository from './Repository'
import { authHeader } from './authHeader'

const resource = '/todos'
export default {
  get() {
    return Repository.get(`http://universities.hipolabs.com/search?country=United+States`)
  },
  getProfile1() {
    return Repository.get(`/users/profile`, { headers: authHeader() })
  },

  getTask(taskid: number) {
    return Repository.get(`${resource}/${taskid}`)
  },

  createTask(payload: any) {
    return Repository.post(`${resource}`, payload)
  },
  updateTask(taskid: number, payload: any) {
    return Repository.put(`${resource}/${taskid}`, payload)
  },
  deleteTask(taskid: number) {
    return Repository.delete(`${resource}/${taskid}`)
  },

}
