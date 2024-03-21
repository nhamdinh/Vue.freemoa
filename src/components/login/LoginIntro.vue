<script setup lang="ts">
import kakao from './../../assets/svg/icon-kakao.svg'
import keyfill from './../../assets/svg/key-fill.svg'
import Header from './../Header.vue'

import right from './../../assets/svg/right.svg'

import { ref, watch, watchEffect, onMounted } from 'vue'
defineEmits(['setStep'])
</script>

<template>
  <!-- XOAAAAAAAAAAA -->
  <div class="LoginView__content">
    <Header :icon="1" :title="''"></Header>

    <div class="big__title mt40px">메인비즈 로고</div>
    <div class="btn__kakao mt60px">
      <img class="kakao" :src="kakao" alt="kakao" />

      카카오톡으로 로그인
    </div>

    <div class="btn__keyfill mt10px">
      <img class="keyfill" :src="keyfill" alt="keyfill" />

      임시계정 활성화
    </div>
    <div class="login__other mt40px">
      다른 계정으로 로그인
      <img @click="$emit('setStep')" class="cursor__pointer" :src="right" alt="right" />
    </div>

    <div class="how mt218px">협회 회원사들과 정보를 교류하시려면? 회원가입</div>
  </div>
</template>

<style scoped lang="scss"></style>
