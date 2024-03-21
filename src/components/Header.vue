<script setup lang="ts">
import left from '@/assets/svg/left.svg'
import iconx from '@/assets/svg/icon-x.svg'
import tune_black_24dp from '@/assets/svg/tune_black_24dp.svg'
import router from '@/router'
import { ref, watch, watchEffect, onMounted } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

const props = defineProps(['title', 'icon', 'iconRight', 'back'])

const store = useAuthStore()
const { setProfile } = store

const AuthRepo = RepositoryFactory.get('auth')

const isLoading = ref<any>(false)
const onGetProfile = async () => {
  isLoading.value = true
  await AuthRepo.getProfile()
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        // dataPost.value = data?.data
        setProfile({ stProfile: data?.data })
      }
    })
    .catch((err: any) => {
      // console.log(err)
    })

  isLoading.value = false
}

const route = useRoute()

watchEffect(() => {
  if (route.path !== '/login') onGetProfile()
})
</script>

<template>
  <div class="Header__main">
    <img
      class="cursor__pointer iconx__iconx"
      :src="icon === 1 ? iconx : left"
      width="24"
      alt="iconx"
      @click="
        () => {
          if (back) {
            router.push({ path: `${back}` })
          } else {
            router.go(-1)
          }
        }
      "
    />
    <div class="login">
      {{ title }}
    </div>
    <img
      v-if="iconRight === 1"
      class="cursor__pointer iconx__right"
      :src="iconRight === 1 ? tune_black_24dp : tune_black_24dp"
      width="24"
      alt="iconx"
    />
  </div>
</template>

<style lang="scss">
.Header__main {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
  position: fixed;
  width: 360px;
  background-color: #fff;
  z-index: 999;
  border-top: 1px solid #bebdbd;
  // border-right: 1px solid #bebdbd;
  top: 0;
  .iconx__iconx {
    position: absolute;
    left: 12px;
    top: 14px;
  }
  .iconx__right {
    position: absolute;
    right: 12px;
    top: 14px;
  }
  .iconx__right__search {
    position: absolute;
    right: 12px;
    top: 14px;
    display: flex;
    align-items: center;
    height: 24px;
    gap: 8px;
    .kinhlup {
      width: 19px;
      height: 19px;
    }
    .setting {
      width: 20px;
      height: 14px;
    }
  }
  .login {
    // height: 54px;
    // padding-top: 24px;
    font-family: SpoqaHanSansNeo;
    font-size: 15px;
    font-weight: 600;
    line-height: 18px;
    letter-spacing: -0.38px;
    color: #000;
    max-width: 220px;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}
</style>
