<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import left from '@/assets/svg/left.svg'
import { displayTimeLeft, isPassMatch } from '@/common/commonFunction'
import { ref, watch, watchEffect, onMounted } from 'vue'
import router from '@/router'
import Header from '@/components/Header.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { NumbersOnly } from '@/common/commonFunction'
import { CORRECT_OTP, FAIL, INCORRECT_OTP, SUCCESS, WRONG_PHONE } from '@/common/constance'
import Loading from '@/components/Loading.vue'

const AuthRepo = RepositoryFactory.get('auth')
const isLoading = ref<any>(false)
const isLoadingPhone = ref<any>(false)
const isLoadingOtp = ref<any>(false)

const phoneNumber = ref<any>('')
const otp = ref<any>('')
const user = ref<any>('')
const pass = ref<any>('')
const repass = ref<any>('')

const onChangePassword = async () => {
  if (isValid()) {
    console.log('Received values of form: ')
    isLoading.value = true
    await AuthRepo.changePassword({
      userName: user.value,
      newPassword: pass.value,
      confirmPassword: repass.value,
      phoneNumber: '+' + phoneNumber.value,
      type: 1
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

    isLoading.value = false
  }
}

const onVerifyOtp = async () => {
  console.log('Received values of form: ')
  isLoadingOtp.value = true
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

  isLoadingOtp.value = false
}

const onVerifyPhone = async () => {
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

const id = ref<any>('')
const id1 = ref<any>('')

const tab = ref<any>(1)
const countLocal = ref<any>(0)
const timer = ref<any>(0)
const isStart = ref<any>(false)

const dataFetch = ['abcd', 'abcdd', 'abcdzs']

const store = useCustomDialogStore()
const { openDialog } = store

const openDialogProp = (text: any) => {
  openDialog({
    stType: 'info',
    stTitle: text,
    stCancelText: 'THOII',
    stOkText: '확인',
    stClosable: false,
    actionConfirm: () => {
      countLocal.value = countLocal.value + 100
    },
    actionCancel: () => {},
    actionAfterClose: () => {
      countLocal.value = countLocal.value + 120
    }
  })
}
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
    <div class="FindPassView__content">
      <Header :back="'/login'" :icon="2" :title="'아이디/비밀번호 찾기'"></Header>
      <div class="top__FindIdView">
        <div class="navigate">
          <div @click="router.push({ path: '/find-id' })" class="navigate__btn__disabled">
            아이디 찾기
          </div>
          <div class="navigate__btn__enabled">비밀번호 찾기</div>
        </div>
        <div class="label mt15px">아이디</div>
        <el-input class="mt6px w328px" v-model="user" placeholder="아이디를 입력하세요" />

        <div class="label mt15px">휴대폰인증</div>
        <div class="line mt6px">
          <el-input
            v-model="phoneNumber"
            placeholder="'-'를 제외한 숫자"
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            maxlength="12"
            v-on:keypress="
              (event: any) => {
                NumbersOnly(event)
              }
            "
          />

          <div v-if="isLoadingPhone" class="btn">
            <Loading />
          </div>
          <div v-else class="btn" @click="onVerifyPhone">인증번호 요청</div>
        </div>
        <div class="line mt10px">
          <div class="relative">
            <el-input
              oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
              maxlength="6"
              v-on:keypress="
                (event: any) => {
                  NumbersOnly(event)
                }
              "
              v-model="otp"
              placeholder="인증번호 6자리"
            />
            <div class="clock">{{ displayTimeLeft(Math.round(timer)) }}</div>
          </div>
          <div v-if="isLoadingOtp" class="btn">
            <Loading />
          </div>
          <div v-else @click="onVerifyOtp" class="btn">인증 확인</div>
        </div>

        <div class="label mt15px">비밀번호</div>
        <el-input
          class="mt6px w328px"
          v-model="pass"
          type="password"
          show-password
          placeholder="비밀번호를 입력하세요"
        />
        <el-input
          class="mt6px w328px"
          v-model="repass"
          type="password"
          show-password
          placeholder="비밀번호를 재입력하세요"
        />
        <!--         <div class="err mt6px">비밀번호를 확인해주세요.</div>
 -->
        <div v-if="isLoading" class="check__enabled mt86px mb29px">
          <Loading />
        </div>
        <div
          v-else
          :class="isValid() ? 'check__enabled' : 'check__disabled'"
          class="mt86px mb29px"
          @click="onChangePassword"
        >
          확인
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
