<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import { ref, watch } from 'vue'
import { AVA, regexOnlyNumber } from '@/common/constance'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import avaback from '@/assets/img/avaback.png'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import q119321 from '@/assets/svg/q119321.svg'
import q2 from '@/assets/svg/q2.svg'
import q3 from '@/assets/svg/q3.svg'
import q4 from '@/assets/svg/q4.svg'
import q5 from '@/assets/svg/q5.svg'
import q6 from '@/assets/svg/q6.svg'
import homegif from '@/assets/img/homegifxanh.png'
import rightwhite from '@/assets/svg/rightwhite.svg'
import router from '@/router'
import right from '@/assets/svg/right.svg'

const props = defineProps(['profile'])
const emits = defineEmits(['setStep'])

const arr3 = [
  {
    id: 82,
    url: q119321,
    name: '공지사항',
    path: '/notices-events-list'
  },
  {
    id: 21,
    url: q3,
    name: '내 작성글',
    path: '/my-writing-list'
  },
  {
    id: 37,
    url: q2,
    name: '내 관심사',
    path: '/my-interests-list'
  }
]
const arr4 = [
  {
    id: 57,
    url: q4,
    name: '설정',
    path: '/setting'
  },
  {
    id: 67,
    url: q5,
    name: '1:1 문의',
    path: '/inquiry-list'
  },
  {
    id: 64,
    url: q6,
    name: '앱 공유하기',
    path: '/share-app'
  }
]
</script>

<template>
  <div class="MyInfoView__content" style="min-height: calc(100vh - 120px)">
    <div class="avatar__back__intro">
      <div class="h55px"></div>
      <img :src="avaback" alt="avaback" />
      <div class="user__info">
        <div class="name__user">
          <div class="name__user__a">{{ profile?.companyName }}_{{ profile?.username }}_ID 님,</div>
          <div class="name__user__b">안녕하세요.</div>
        </div>

        <img v-if="profile?.avatar" class="avatar__user" :src="profile?.avatar" alt="avaback" />
        <div v-else class="avatar__user__bgc">
          <img class="avatar__user" :src="AVA" alt="avaback" />
        </div>
      </div>
      <div class="to__myinfo" @click="emits('setStep')">
        <div>마이페이지</div>
        <img :src="right" alt="right" />
      </div>
    </div>

    <div class="MyInfoView__mani__menu">
      <div class="see__more ml20px mr20px cursor__pointer">
        <div class="all">메인비즈협회 소개</div>

        <img
          @click="router.push({ path: '/introduce', query: { step: 4 } })"
          :src="right"
          alt="right"
        />
      </div>

      <div class="deli mt15px mb30px"></div>
      <div class="arr3__list">
        <div
          @click="router.push({ path: item?.path })"
          class="arr3__item"
          v-for="(item, index) in arr3"
          :key="index"
        >
          <div class="arr3__list__wrapper">
            <img :src="item?.url" alt="url" />
          </div>
          <div class="app__name">
            <div>{{ item?.name }}</div>
          </div>
        </div>
      </div>
      <div class="arr3__list mt30px">
        <div
          @click="router.push({ path: item?.path })"
          class="arr3__item"
          v-for="(item, index) in arr4"
          :key="index"
        >
          <div class="arr3__list__wrapper">
            <img :src="item?.url" alt="url" />
          </div>
          <div class="app__name">
            <div>{{ item?.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="gif" style="top: 310px">
      <img :src="homegif" alt="das" class="gif__img" />
      <div class="gif__text">
        <div class="maketing">한정기간</div>
        <div class="maketing">첫 구매시 추가 컨설팅</div>
        <div class="maketing">무료 이벤트</div>
        <div class="zzz mt5px">
          <div class="kkk">메인비즈에서 혜택 받기</div>
          <img :src="rightwhite" alt="rightwhite" />
        </div>
        <div class="line__707 mt23px">
          <div class="line__fff"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
