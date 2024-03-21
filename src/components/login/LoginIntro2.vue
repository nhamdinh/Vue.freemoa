<script setup lang="ts">
import kakao from './../../assets/svg/icon-kakao.svg'
import router from '@/router'
import Header from './../Header.vue'

import { ref, watch, watchEffect, onMounted } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { ACCESSTOKEN_STORAGE, regexOnlyNumber } from '@/common/constance'

const AuthRepo = RepositoryFactory.get('auth')

const isLoading = ref<any>(false)

const user = ref<any>('')
const pass = ref<any>('')
const showErr = ref<any>(false)
defineEmits(['setStep'])

const onFinish = async () => {
  if (isActive()) {
    console.log('Received values of form: ')
    isLoading.value = true
    await AuthRepo.login({
      userName: user.value,
      password: pass.value
    })
      .then((res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          localStorage.setItem(ACCESSTOKEN_STORAGE, data?.accessToken)
          router.push({ path: `/home` })
        }
      })
      .catch((err: any) => {
        showErr.value = true
        console.log(err)
      })
    isLoading.value = false
  }
}

const onToFindIdPage = () => {
  router.push({ path: `/find-id` })
}

const isActive = () => {
  return user.value && pass.value
}
</script>

<template>
  <div class="LoginView__content">
    <Header :back="'/home'" :icon="1" :title="'로그인'"></Header>
    <el-input
      oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
      maxlength="31"
      v-on:keypress="
        (evt: any) => {
          showErr = false
          console.log(evt.target.value)
          console.log(regexOnlyNumber.test(evt.target.value))
          // if (!regexOnlyNumber.test(evt.target.value)) {
          //   evt.preventDefault()
          // } else {
          //   return true
          // }
        }
      "
      v-model="user"
      placeholder="아이디를 입력하세요"
    />
    <el-input
      oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
      maxlength="31"
      class="mt10px"
      v-model="pass"
      type="password"
      show-password
      placeholder="비밀번호를 입력하세요"
      v-on:keypress="
        (evt: any) => {
          showErr = false
        }
      "
      @keyup.enter="onFinish"
    />
    <div v-if="showErr" class="err mt6px">아이디 또는 비밀번호를 확인해주십시오.</div>

    <div
      @click="onFinish"
      class="mt20px"
      :class="isActive() ? 'btn__login__enabled' : 'btn__login__disabled'"
    >
      로그인
    </div>
    <div @click="onToFindIdPage" class="find__id cursor__pointer mt20px ml16px">
      아이디/비밀번호 찾기
    </div>

    <div class="btn__kakao mt80px">
      <img class="kakao" :src="kakao" alt="kakao" />

      카카오톡으로 로그인
    </div>

    <div class="btn__bae mt10px" @click="router.push({ path: '/temp-account' })">
      <div class="acc__temp">임시계정 활성화</div>
      <div class="did__acc__temp">임시계정을 발급받으셨다면 여기를 누르세요</div>
    </div>

    <div class="did__member mt30px">협회 회원사들과 정보를 교류하시려면?</div>
    <div @click="router.push({ path: '/register' })" class="member mt10px mb100px cursor__pointer">
      회원가입
    </div>
  </div>
</template>

<style lang="scss"></style>
