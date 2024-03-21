<script setup lang="ts">
import Header from '@/components/Header.vue'
import a13 from '@/assets/svg/a13.svg'
import a122424 from '@/assets/svg/a122424.svg'
import a222431 from '@/assets/svg/a222431.svg'
import a1122436 from '@/assets/svg/a1122436.svg'
import kakao from '@/assets/svg/kakao-talk-logo.svg'
import a3 from '@/assets/img/a3.png'
import a4 from '@/assets/img/a4.png'
import a6 from '@/assets/img/a6.png'
import a7 from '@/assets/img/a7.png'
import a8 from '@/assets/img/a8.png'
import a9 from '@/assets/img/a9.png'
import a10 from '@/assets/img/a10.png'
import a12 from '@/assets/img/a12.png'
import avaback from '@/assets/img/avaback.png'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { ref, watch } from 'vue'

const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

const arr1 = [
  {
    id: 43,
    url: a122424,
    name: '복사',
    name2: ''
  },
  {
    id: 98,
    url: a222431,
    name: 'Quick Share',
    name2: ''
  },
  {
    id: 18,
    url: a3,
    name: '삼성 인터넷',
    name2: ''
  },
  {
    id: 50,
    url: a4,
    name: '카카오톡',
    name2: ''
  },
  {
    id: 11,
    url: kakao,
    name: '카카오톡',
    name2: '>나에게'
  },
  {
    id: 82,
    url: a1122436,
    name: '네이버 친구',
    name2: '공유하기'
  },
  {
    id: 38,
    url: a7,
    name: '네이버 Keep',
    name2: ''
  },
  {
    id: 90,
    url: a6,
    name: '네이버',
    name2: 'MYBOX'
  }
]
const arr2 = [
  {
    id: 75,
    url: a8,
    name: '공유 밴드',
    name2: ''
  },
  {
    id: 21,
    url: a12,
    name: '공유',
    name2: '카카오스토리'
  },
  {
    id: 94,
    url: a10,
    name: '네이버 메일',
    name2: ''
  },
  {
    id: 93,
    url: a4,
    name: '네이버 친구',
    name2: '공유하기'
  },
  {
    id: 44,
    url: a9,
    name: '네이버 카페',
    name2: ''
  },
  {
    id: 39,
    url: a7,
    name: '네이버 Keep',
    name2: ''
  },
  {
    id: 40,
    url: a6,
    name: '네이버',
    name2: 'MYBOX'
  },
  {
    id: 82,
    url: a13,
    name: '뉴스피드',
    name2: ''
  }
]
</script>

<template>
  <div class="ShareAppView">
    <Header :back="'/my-info'" :icon="2" :title="'앱 공유하기'"></Header>
    <div class="ShareAppView__content">
      <div class="avatar__back__Share">
        <img :src="avaback" alt="avaback" />
        <div class="user__info">
          <div class="name__user">
            <div class="name__user__a">{{ profile?.username }} 님,</div>
            <div class="name__user__b">안녕하세요.</div>
          </div>
          <img class="avatar__user" :src="profile?.avatar" alt="avaback" />
        </div>
      </div>
      <div class="ShareAppView__mani__menu">
        <div class="arr1__list">
          <div class="arr1__item" v-for="(item, index) in arr1" :key="index">
            <div class="arr1__list__wrapper">
              <img :src="item?.url" alt="url" />
            </div>
            <div class="app__name">
              <div>{{ item?.name }}</div>
              <div>{{ item?.name2 }}</div>
            </div>
          </div>
        </div>
        <div class="deli mt27px mb20px"></div>
        <div class="all ml20px">모든 앱</div>
        <div class="arr1__list mt20px">
          <div class="arr1__item" v-for="(item, index) in arr2" :key="index">
            <div class="arr1__list__wrapper">
              <img :src="item?.url" alt="url" />
            </div>
            <div class="app__name">
              <div>{{ item?.name }}</div>
              <div>{{ item?.name2 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.avatar__back__Share {
  width: 359px;
  height: 195px;
  position: relative;
  .user__info {
    position: absolute;
    z-index: 1;
    right: 16px;
    top: 20px;
    width: 328px;
    display: flex;
    gap: 16px;
    align-items: center;
    .name__user {
      width: 238px;
      .name__user__a {
        font-family: SpoqaHanSansNeo;
        font-size: 22px;
        font-weight: bold;
        font-style: normal;
        line-height: 30px;
        letter-spacing: -0.55px;
        color: #000;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .name__user__b {
        font-family: SpoqaHanSansNeo;
        font-size: 22px;
        font-weight: bold;
        font-style: normal;
        line-height: 30px;
        letter-spacing: -0.55px;
        color: #000;
      }
    }
    .avatar__user {
      width: 74px;
      height: 74px;
      min-width: 74px;
      min-height: 74px;
      border-radius: 50%;
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: center center;
      object-fit: cover;
    }
  }
}
.ShareAppView {
  width: 100%;
  .ShareAppView__content {
    min-height: calc(100vh - 80px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 30px;
    position: relative;
  }
}

.ShareAppView__mani__menu {
  position: absolute;
  top: 114px;

  width: 328px;
  height: 556px;
  border-radius: 10px;
  box-shadow: 0 0 6px 0 rgba(27, 55, 77, 0.2);
  background-color: #fff;
  padding-top: 20px;
  .all {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: -0.3px;
    color: #52606d;
  }
  .deli {
    width: 287px;
    height: 1px;
    background-color: #e4e7ec;
    margin: 0 auto;
  }
  .arr1__list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 14px;
    .arr1__item {
      display: flex;
      gap: 10px;
      flex-direction: column;
      align-items: center;
      cursor: pointer;

      .arr1__list__wrapper {
        width: 60px;
        height: 60px;
        box-shadow: 0 0 6px 0 rgba(129, 147, 162, 0.26);
        background-color: #f4f9ff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
      }
      .app__name {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #242a37;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style>
