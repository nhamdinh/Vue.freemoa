<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import { displayTimeLeft, isPassMatch } from '@/common/commonFunction'
import { ref, watch, watchEffect } from 'vue'
import router from '@/router'
import Header from '@/components/Header.vue'
import { NumbersOnly } from '@/common/commonFunction'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import { CORRECT_OTP, FAIL, INCORRECT_OTP, SUCCESS, WRONG_PHONE } from '@/common/constance'

const user = ref<any>('')
const otp = ref<any>('')
const phoneNumber = ref<any>('')
const pass = ref<any>('')
const repass = ref<any>('')
const curPassword = ref<any>('')
const isLoading = ref<any>(false)
const isLoadingChange = ref<any>(false)
const isLoadingPhone = ref<any>(false)

const timer = ref<any>(0)
const isStart = ref<any>(false)

const store = useCustomDialogStore()
const { openDialog } = store

let countdown: any = null
watch(isStart, async (newQuestion, oldQuestion) => {
  if (isStart.value) {
    countdown = setInterval(() => {
      timer.value -= 1
    }, 1000)
  }

  return () => {
    clearInterval(countdown)
  }
})

watch(timer, async (newQuestion, oldQuestion) => {
  if (timer.value === 0) {
    clearInterval(countdown)
    isStart.value = false
  }
})

const AuthRepo = RepositoryFactory.get('auth')

const openDialogProp = (text: any) => {
  openDialog({
    stType: 'info',
    stTitle: text,
    stCancelText: 'THOII',
    stOkText: '확인',
    stClosable: false,
    actionConfirm: () => {},
    actionCancel: () => {},
    actionAfterClose: () => {}
  })
}

const onVerifyPhone = async () => {
  if (phoneNumber.value) {
    console.log('Received values of form: ')
    isLoadingPhone.value = true
    await AuthRepo.verifyPhone({
      phoneNumber: '+' + phoneNumber.value
    })
      .then((res: any) => {
        const data = res?.data

        if (data?.status === 'OK') {
          timer.value = 180
          isStart.value = true
          openDialogProp('인증번호를 발송하였습니다.')
        } else {
          openDialogProp(WRONG_PHONE)
        }
      })
      .catch((err: any) => {
        openDialogProp(WRONG_PHONE)

        console.log(err)
      })
    isLoadingPhone.value = false
  }
}

const onVerifyOtp = async () => {
  console.log('Received values of form: ')
  isLoading.value = true
  await AuthRepo.verifyOtp({
    phoneNumber: '+' + phoneNumber.value,
    otp: otp.value
  })
    .then((res: any) => {
      const data = res?.data

      if (data?.status === 'OK') {
        openDialogProp(CORRECT_OTP)
      } else {
        openDialogProp(INCORRECT_OTP)
      }
    })
    .catch((err: any) => {
      openDialogProp(INCORRECT_OTP)
      console.log(err)
    })

  isLoading.value = false
}

const onChangePassword = async () => {
  if (isValid()) {
    console.log('Received values of form: ')
    isLoadingChange.value = true
    await AuthRepo.changePassword({
      userName: user.value,
      newPassword: pass.value,
      confirmPassword: repass.value,
      phoneNumber: '+' + phoneNumber.value,
      password: curPassword.value,
      type: 2
    })
      .then((res: any) => {
        const data = res?.data

        if (data?.status === 'OK') {
          openDialogProp(SUCCESS)
          router.push({ path: '/login' }) // dataFetch.value = data?.data
        } else {
          openDialogProp(FAIL)
        }
      })
      .catch((err: any) => {
        openDialogProp(FAIL)
        console.log(err)
      })
    isLoadingChange.value = false
  }
}

const isValid = () => {
  return (
    phoneNumber.value &&
    user.value &&
    pass.value &&
    repass.value &&
    isPassMatch(pass.value, repass.value)
  )
}
</script>

<template>
  <div class="FindAccView">
    <div class="TempAccountView__content">
      <Header :icon="2" :title="'임시계정 활성화'"></Header>
      <div class="top__FindIdView">
        <div class="label">임시계정 정보 입력</div>
        <el-input class="mt6px w328px" v-model="user" placeholder="아이디를 입력하세요" />

        <el-input
          type="password"
          show-password
          class="mt6px w328px"
          v-model="curPassword"
          placeholder="비밀번호를 입력하세요"
        />

        <div class="label mt15px">휴대폰인증</div>
        <div class="line mt6px">
          <el-input
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            maxlength="12"
            v-on:keypress="
              (event: any) => {
                NumbersOnly(event)
              }
            "
            v-model="phoneNumber"
            placeholder="'-'를 제외한 숫자"
          />

          <div class="btn" @click="onVerifyPhone">
            <Loading v-if="isLoadingPhone" />

            <p v-else>인증번호 요청</p>
          </div>
        </div>
        <div class="line mt10px">
          <div class="relative">
            <el-input v-model="otp" placeholder="인증번호 6자리" />
            <div class="clock">{{ displayTimeLeft(Math.round(timer)) }}</div>
          </div>

          <div @click="onVerifyOtp" class="btn">인증 확인</div>
        </div>

        <div class="label mt15px">신규 비밀번호</div>
        <el-input
          type="password"
          show-password
          class="mt6px w328px"
          v-model="pass"
          placeholder="새 비밀번호를 입력하세요"
        />
        <el-input
          type="password"
          show-password
          class="mt6px w328px"
          v-model="repass"
          placeholder="비밀번호를 재입력하세요"
        />
        <!--         <div class="err mt6px">비밀번호를 확인해주세요.</div>
 -->
        <div
          :class="isValid() ? 'check__enabled' : 'check__disabled'"
          class="mt86px mb29px"
          @click="onChangePassword"
        >
          <Loading v-if="isLoadingChange" />

          <p v-else>확인</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
