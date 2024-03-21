import { createRouter, createWebHistory } from 'vue-router'
import routes from './routers'

const router = createRouter({
  history: createWebHistory(),
  routes: [...routes]
})
export default router
