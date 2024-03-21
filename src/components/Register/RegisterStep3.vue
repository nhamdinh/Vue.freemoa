<script setup lang="ts">
import handbox from '@/assets/img/handbox.png'
import { ref } from 'vue'
import router from '@/router'

</script>
<template>
  <div class="top__HomeView5 cursor__pointer">
    <div class="title__home">메인비즈의 회원이</div>
    <div class="title__home">되신 것을 축하드립니다!</div>

    <div class="semi__title mt20px">회원가입이 완료되었습니다. 메인화면에서</div>
    <div class="semi__title">서비스를 둘러보고 더 많은 혜택을 받아보세요.</div>
  </div>
  <div class="handbox mt55px">
    <img :src="handbox" alt="" />
    <div class="to__login__btn mt80px" @click="router.push({ path: `/login` })">로그인 하기</div>
  </div>
</template>

<style lang="scss">
.top__HomeView5 {
  padding: 40px 16px;
  padding-bottom: 0;
  .title__home {
    font-family: SpoqaHanSansNeo;
    font-size: 26px;
    font-weight: 500;
    line-height: 30px;
    letter-spacing: -0.65px;
    text-align: left;
    color: #000;
  }
  .semi__title {
    font-family: SpoqaHanSansNeo;
    font-size: 15px;
    font-weight: normal;
    line-height: 20px;
    letter-spacing: -0.38px;
    text-align: left;
    color: #52606d;
  }
}
.handbox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .to__login__btn {
    cursor: pointer;
    font-family: SpoqaHanSansNeo;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.4px;
    text-align: center;
    color: #fff;

    width: 328px;
    height: 49px;
    border-radius: 6px;
    background-color: #1767b3;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
