<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from 'vue'
import menu6 from '@/assets/img/menu6.png'
import menu1 from '@/assets/svg/menu1.svg'
import menu2 from '@/assets/svg/menu2.svg'
import menu3 from '@/assets/svg/menu3.svg'
import menu4 from '@/assets/svg/menu4.svg'
import menu5 from '@/assets/svg/menu5.svg'
import menu1act from '@/assets/svg/menu1act.svg'
import menu2act from '@/assets/svg/menu2act.svg'
import menu3act from '@/assets/svg/menu3act.svg'
import menu4act from '@/assets/svg/menu4act.svg'
import menu5act from '@/assets/svg/menu5act.svg'
import menu6act from '@/assets/img/menu6act.png'
import router from '@/router'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { useAuthStore } from '@/stores/auth'
const props = defineProps(['active'])

const step = ref<any>(1)
const active = ref<any>(props.active ?? 3)

const dataMenu = ref<any>([
  {
    key: 3,
    img: menu3,
    imgact: menu3act,
    path: '/home',
    name: '홈'
  },
  {
    key: 1,
    img: menu1,
    imgact: menu1act,
    path: '/company-list',
    name: '회원사'
  },
  {
    key: 2,
    img: menu2,
    imgact: menu2act,
    path: '/market-list',
    name: '상생마켓'
  },

  {
    key: 4,
    img: menu4,
    imgact: menu4act,
    path: '/finance-list',
    name: '지원기관'
  },
  // {
  //   key: 5,
  //   img: menu5,
  //   imgact: menu5act,
  //   path: '/board-list',
  //   name: '커뮤니티'
  // },
  {
    key: 6,
    img: menu6,
    imgact: menu6act,
    path: '/my-info',
    name: '더보기'
  }
])

const storeAuth = useAuthStore()

const { setProfile } = storeAuth

const AuthRepo = RepositoryFactory.get('auth')

const onGetProfile = async () => {
  await AuthRepo.getProfile()
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        setProfile({ stProfile: data?.data })
      } else {
        setProfile({ stProfile: {} })
      }
    })
    .catch((err: any) => {
      setProfile({ stProfile: {} })
      // console.log(err)
    })
}

watchEffect(() => {
  onGetProfile()
})
</script>

<template>
  <div class="Footer">
    <div class="Footer__content">
      <div class="menu">
        <div
          :class="active === item?.key ? 'menu__item act' : 'menu__item dis'"
          v-for="(item, index) in dataMenu"
          :key="index"
          @click="router.push({ path: item?.path })"
        >
          <img :src="active === item?.key ? item?.imgact : item?.img" alt="" class="menu__icon" />
          <div class="menu__text">{{ item?.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.Footer {
  width: 360px;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  .Footer__content {
    .menu {
      // border: 1px solid #e4e7ec;
      border-top: 1px solid #e4e7ec;
      border-bottom: 1px solid #bebdbd;
      // border-right: 1px solid #bebdbd;
      height: 61px;
      display: flex;
      // gap: 24px;
      align-items: center;
      justify-content: space-between;
      padding: 0 26px;
      .menu__item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        .menu__icon {
          width: 24px;
          height: 24px;
        }
        .menu__text {
          font-family: SpoqaHanSansNeo;
          font-size: 9px;
          font-weight: normal;
          line-height: 14px;
          letter-spacing: -0.25px;
        }
      }
      .act {
        color: #1867b3 !important;
      }
      .dis {
        color: #9ba5b1 !important;
      }
    }
  }
}
</style>
