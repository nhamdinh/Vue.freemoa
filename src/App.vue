<script setup lang="ts">
import { RouterView } from 'vue-router'
import router from '@/router'
import { useRoute } from 'vue-router'
import CustomDialog from './components/customDialog/CustomDialog.vue'
import CustomModal from './components/customModalTemplate/CustomModal.vue'
import { watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCompanyStore } from '@/stores/company'

const storeCompany = useCompanyStore()
const { stIsFilter } = storeToRefs(storeCompany)
const { setIsFilter } = storeCompany

const route = useRoute()
watch(route, async (newV, oldV) => {
  if (route.path === '/') router.push({ path: '/home' })
})

console.log('ENVIRONMENT ::: ', import.meta.env.VITE_ENVIRONMENT) // 123
</script>

<template>
  <!-- <header>
    day laf header
  </header> -->
  <div
    v-if="stIsFilter"
    class="blur"
    @click="
      () => {
        if (route.path === '/room-chat-create') router.push({ path: '/room-chat-list' })
        setIsFilter({ stIsFilter: false })
      }
    "
  ></div>

  <main className="main-content">
    <RouterView />
  </main>

  <CustomDialog />
  <CustomModal />
</template>

<style scoped lang="scss">
.main-content {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 2px);
  position: relative;
  padding-top: 54px;
  overflow: hidden;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
