import './assets/main.scss'
import './assets/global.scss'
// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/reset.css'

import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

import App from './App.vue'
import Vue3TouchEvents from "vue3-touch-events";

import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import i18n from './locales/config'

const app = createApp(App)
app.use(router)
app.use(i18n)
const pinia = createPinia()
setActivePinia(pinia)

app.use(pinia)
app.use(Vue3TouchEvents);

// app.use(Antd).mount('#app')
app.use(ElementPlus)
app.mount('#app')
