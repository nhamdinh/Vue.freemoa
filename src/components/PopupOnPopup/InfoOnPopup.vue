<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import right18 from '@/assets/svg/right18.svg'
import find from '@/assets/svg/find.svg'
import { RepositoryFactory } from '@/repository/RepositoryFactory'

const emits = defineEmits(['closeFilter'])
const props = defineProps(['info'])
</script>

<template>
  <div class="InfoOnPopup">
    <div class="InfoOnPopup__title">{{ info }}</div>
    <div class="InfoOnPopup__close mt30px" @click="emits('closeFilter')">확인</div>
  </div>
</template>

<style lang="scss">
.InfoOnPopup {
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 99;
  top: 20%;
  width: 328px;
  height: 161px;
  border-radius: 20px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.16);
  background-color: #fff;
  padding: 0 16px;
  padding-top: 40px;

  animation: hidden__filter__popup 0.2s linear forwards;
  @keyframes hidden__filter__popup {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  .InfoOnPopup__title {
    font-family: SpoqaHanSansNeo;
    font-size: 18px;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: -0.9px;
    text-align: center;
    color: #1f2933;
  }
  .InfoOnPopup__close {
    width: 290px;
    height: 49px;
    border-radius: 6px;
    background-color: #1767b3;
    display: flex;
    justify-content: center;
    align-items: center;

    font-family: SpoqaHanSansNeo;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.4px;
    text-align: center;
    color: #fff;
    cursor: pointer;
  }
}
</style>
