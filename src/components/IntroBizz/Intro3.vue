<script setup lang="ts">
import phone from '@/assets/svg/phone.svg'
import camera from '@/assets/svg/camera.svg'
import identification from '@/assets/svg/identification.svg'
import imageSquare from '@/assets/svg/image-square.svg'
import { ref, watch, watchEffect, onMounted } from 'vue'

const emits = defineEmits(['setStep'])

const isNotValid = () => {
  return false
}

const dataSlides = ref<any>([
  {
    icon: phone,
    title: '전화 걸기',
    semiTitle: '알바생/사장님 간 전화연결'
  },
  {
    icon: camera,
    title: '카메라',
    semiTitle: '프로필 사진 촬영'
  },
  {
    icon: identification,
    title: '연락처',
    semiTitle: '휴대폰 인증 시 자동번호 입력'
  },
  {
    icon: imageSquare,
    title: '저장공간',
    semiTitle: '기기내 사진을 앱에 전송'
  }
])
</script>
<template>
  <div class="Intro3">
    <div class="title__home__Intro3">앱 사용을 위해</div>
    <div class="title__home__Intro3">접근 권한을 허용해주세요</div>
    <div class="semi__title mt20px">알바콜 앱을 이용하기 위해서는</div>
    <div class="semi__title">다음의 접근 권한을 요청할 수 있습니다.</div>
    <div class="choice mt40px">선택권한</div>
    <div class="list mt20px">
      <div class="Intro3__line" v-for="(item, index) in dataSlides" :key="index">
        <img :src="item?.icon" alt="icon" />

        <div class="wrapper__title">
          <div class="line__title">{{ item?.title }}</div>
          <div class="semi__line__title">{{ item?.semiTitle }}</div>
        </div>
      </div>
    </div>
    <div
      @click="emits('setStep')"
      :class="isNotValid() ? 'check__disabled' : 'check__enabled'"
      class="mt181px"
    >
      확인
    </div>
  </div>
</template>

<style lang="scss">
.Intro3 {
  padding: 0 16px;
  .title__home__Intro3 {
    font-family: SpoqaHanSansNeo;
    font-size: 26px;
    font-weight: normal;
    line-height: 30px;
    letter-spacing: -0.65px;
    color: #000;
  }
  .choice {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: normal;
    line-height: 14px;
    letter-spacing: -0.38px;
    text-align: left;
    color: #52606d;
  }
  .list {
    display: flex;
    gap: 21px;
    flex-direction: column;
  }
  .Intro3__line {
    display: flex;
    align-items: center;
    gap: 10px;
    .wrapper__title {
      display: flex;
      gap: 20px;
    }
    .line__title {
      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: normal;
      line-height: 18px;
      letter-spacing: -0.38px;
      text-align: left;
      color: #000;
    }
    .semi__line__title {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: normal;
      line-height: 14px;
      letter-spacing: -0.3px;
      color: #9ba5b1;
    }
  }
}
@mixin check__btn {
  margin: 0 auto;

  width: 328px;
  height: 49px;
  border-radius: 6px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-family: SpoqaHanSansNeo;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.4px;
  text-align: center;
}
.check__enabled {
  @include check__btn;
  background-color: #1767b3;
  color: #fff;
  cursor: pointer;
}
.check__disabled {
  @include check__btn;
  background-color: #cbd2da;
  color: #52606d;
  cursor: not-allowed;
}
</style>
