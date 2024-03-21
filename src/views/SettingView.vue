<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import left from '@/assets/svg/left.svg'
import { displayTimeLeft } from '@/common/commonFunction'
import { ref, watch, watchEffect, onMounted } from 'vue'
import router from '@/router'
import { formatPhone } from '@/common/commonFunction'
import { regexOnlyNumber } from '@/common/constance'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import avaback from '@/assets/img/avaback.png'
import { RepositoryFactory } from '@/repository/RepositoryFactory'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import arrxanh from '@/assets/svg/arrxanh.svg'
const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const tab = ref<any>(stProfile.value.enableNotice)
watch(stProfile, async (newV, oldV) => {
  tab.value = stProfile.value.enableNotice
})

const dataFetch = [
  {
    label: '이용약관',
    goTo: '/introduce'
  },
  {
    label: '개인정보 보호정책',
    goTo: '/introduce'
  },
  {
    label: '오픈소스 라이선스',
    goTo: '/introduce'
  }
]

const inquiryRepo = RepositoryFactory.get('inquiry')

const onUpdateEnableNotice = async () => {
  await inquiryRepo
    .updateEnableNotice({
      tab: tab.value
    })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        console.log(data)
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}

watch(tab, async (newV, oldV) => {
  onUpdateEnableNotice()
})
</script>

<template>
  <div class="SettingView">
    <Header :back="'/my-info'" :icon="2" :title="'설정'"></Header>

    <div class="SettingView__content">
      <div class="SettingView__content__top mt20px">
        <div class="get__noti">
          <div class="get__noti__text">알림 받기</div>
          <div @click="tab = !tab" :class="tab ? 'btn__on' : 'btn__off'">
            <div class="circle"></div>
          </div>
        </div>
        <div class="mt8px get__noti__desc">공지사항 및 이벤트 알람을 전달 받으실 수 있습니다.</div>
      </div>
      <div class="SettingView__list mb318px">
        <div class="SettingView__item" v-for="(item, index) in dataFetch" :key="index">
          <div class="SettingView__item__label">
            {{ item.label }}
          </div>
          <img @click="router.push({ path: item?.goTo })" :src="arrxanh" alt="arrxanh" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.SettingView {
  width: 100%;
  .SettingView__content {
    padding: 0 16px;
    .SettingView__content__top {
      height: 68px;
      border-bottom: 1px solid #e4e7ec;
    }
    .get__noti {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .get__noti__text {
        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: -0.75px;
        color: #1f2933;
      }
      @mixin btn {
        width: 45px;
        height: 24px;
        border-radius: 12px;
        padding: 0 2px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .btn__off {
        @include btn;
        background-color: #bfbfbf;
        justify-content: flex-start;
      }
      .btn__on {
        @include btn;
        background-color: #1767b3;
        justify-content: flex-end;
      }
      .circle {
        width: 19px;
        height: 19px;
        border-radius: 50%;
        background-color: #fff;
      }
    }

    .get__noti__desc {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.6px;
      color: #9ba5b1;
    }
    .SettingView__list {
      .SettingView__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 59px;
        border-bottom: 1px solid #e4e7ec;
        .SettingView__item__label {
          font-family: SpoqaHanSansNeo;
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          letter-spacing: -0.75px;
          color: #1f2933;
        }
        img {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
