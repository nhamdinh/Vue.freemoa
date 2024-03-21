<script setup lang="ts">
import Header from '@/components/Header.vue'
</script>
<template>
  <Header :back="'/home'" :icon="2" :title="'메인비즈협회 소개'"></Header>
  <div class="Intro4 pt20px pb20px">
    <div class="IntroBizzView__content">컨텐츠 이미지 영역</div>
  </div>
</template>

<style lang="scss">
.Intro4 {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .IntroBizzView__content {
    width: 328px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #cbd2da;
    margin: 0 auto;

    font-family: SpoqaHanSansNeo;
    font-size: 15px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: -0.38px;
    color: #52606d;
  }
}
</style>
