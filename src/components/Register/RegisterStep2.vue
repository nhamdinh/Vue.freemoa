<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import { displayTimeLeft, isPassMatch } from '@/common/commonFunction'
import { ref, watch, watchEffect } from 'vue'
import { CORRECT_OTP, INCORRECT_OTP, WRONG_PHONE, regexOnlyNumber } from '@/common/constance'
import Loading from '@/components/Loading.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { NumbersOnly } from '@/common/commonFunction'
const emit = defineEmits(['setStep'])

const AuthRepo = RepositoryFactory.get('auth')
const isLoadingPhone = ref<any>(false)
const isLoadingOtp = ref<any>(false)
const isLoadingRegister = ref<any>(false)
const duplicateUsername = ref<any>(false)
const duplicateEmail = ref<any>(false)
const matchPass = ref<any>(false)

const phoneNumber = ref<any>('')
const otp = ref<any>('')
const username = ref<any>('')
const password = ref<any>('')
const rePassword = ref<any>('')
const fullName = ref<any>('')
const companyName = ref<any>('')
const email = ref<any>('')

const store = useCustomDialogStore()
const { openDialog } = store
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

const onRegister = async () => {
  if (isValid()) {
    isLoadingRegister.value = true
    await AuthRepo.register({
      userName: username.value,
      email: email.value,
      password: password.value,
      confirmPassword: rePassword.value,
      phoneNumber: '+' + phoneNumber.value,
      fullName: fullName.value,
      companyName: companyName.value
    })
      .then((res: any) => {
        const data = res?.data
        console.log(data)

        if (data?.status === 'OK') {
          emit('setStep')
        } else {
          if (data?.errors[0]?.errorCode === '400_7') {
            duplicateUsername.value = true
          }
          if (data?.errors[0]?.errorCode === '400_8') {
            duplicateEmail.value = true
          }
          if (data?.errors[0]?.errorCode === '400_5') {
            matchPass.value = true
          }
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
    isLoadingRegister.value = false
  }
}

const onVerifyOtp = async () => {
  if (otp.value.length === 6) {
    isLoadingOtp.value = true
    await AuthRepo.verifyNewOtp({
      phoneNumber: '+' + phoneNumber.value,
      otp: otp.value
    })
      .then((res: any) => {
        const data = res?.data
        console.log(data)
        if (data?.status === 'OK') {
          openDialogProp(CORRECT_OTP)
        } else {
          openDialogProp(INCORRECT_OTP)
        }
      })
      .catch((err: any) => {
        console.log(err)
        openDialogProp(INCORRECT_OTP)
      })
    isLoadingOtp.value = false
  }
}

const onVerifyPhone = async () => {
  if (phoneNumber.value) {
    isLoadingPhone.value = true
    await AuthRepo.verifyNewPhone({
      phoneNumber: '+' + phoneNumber.value
    })
      .then((res: any) => {
        const data = res?.data
        console.log(data)
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

const timer = ref<any>(0)
const isStart = ref<any>(false)

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
    !duplicateEmail.value &&
    !duplicateUsername.value &&
    !matchPass.value &&
    phoneNumber.value &&
    username.value &&
    password.value &&
    rePassword.value &&
    fullName.value &&
    companyName.value &&
    email.value &&
    isPassMatch(password.value, rePassword.value)
  )
}
</script>

<template>
  <div class="wrapper__main mt0px" style="max-height: calc(100vh - 40px)">
    <div class="top__RegisterViewS2">
      <div class="label mt10px">휴대폰인증<span class="ata">*</span></div>
      <div class="line mt6px">
        <el-input
          class="w198px"
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
          <el-input
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            maxlength="6"
            v-on:keypress="
              (event: any) => {
                NumbersOnly(event)
              }
            "
            v-model="otp"
            type="text"
            placeholder="인증번호 6자리"
          />
          <div class="clock">{{ displayTimeLeft(Math.round(timer)) }}</div>
        </div>

        <div @click="onVerifyOtp" class="btn">
          <Loading v-if="isLoadingOtp" />

          <p v-else>인증 확인</p>
        </div>
      </div>

      <div class="label mt15px">아이디<span class="ata">*</span></div>
      <el-input
        @input="duplicateUsername = false"
        class="mt6px w328px"
        v-model="username"
        placeholder="아이디를 입력하세요"
      />
      <div class="err mt6px" v-if="duplicateUsername">중복된 아이디 입니다.</div>

      <div class="label mt15px">비밀번호<span class="ata">*</span></div>
      <el-input
        maxlength="20"
        type="password"
        show-password
        class="mt6px w328px"
        v-model="password"
        placeholder="비밀번호를 입력하세요"
        @input="matchPass = false"
      />
      <el-input
        maxlength="20"
        type="password"
        show-password
        class="mt10px w328px"
        v-model="rePassword"
        placeholder="비밀번호를 재입력하세요"
      />
      <div class="err mt6px" v-if="!isPassMatch(password, rePassword) || matchPass">
        비밀번호를 확인해주세요.
      </div>

      <div class="label mt15px">이름<span class="ata">*</span></div>
      <el-input class="mt6px w328px" v-model="fullName" placeholder="이름을 입력하세요" />
      <div class="err mt6px" v-if="fullName.length === 0">이름을 입력해주세요.</div>

      <div class="label mt15px">회사명<span class="ata">*</span></div>
      <el-input class="mt6px w328px" v-model="companyName" placeholder="회사명을 입력하세요." />
      <div class="err mt6px" v-if="companyName.length === 0">회사명을 입력해주세요</div>

      <div class="label mt15px">이메일<span class="ata">*</span></div>
      <el-input
        @input="duplicateEmail = false"
        class="mt6px w328px"
        v-model="email"
        placeholder="이메일을 입력하세요"
      />
      <div class="err mt6px" v-if="email.length === 0">이메일을 입력해주세요</div>

      <div class="err mt6px" v-if="duplicateEmail">이미 가입된 이메일 입니다.</div>
      <div
        :class="isValid() ? 'check__enabled' : 'check__disabled'"
        class="mt40px mb40px"
        @click="onRegister"
      >
        <Loading v-if="isLoadingRegister" />

        <p v-else>회원가입</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.top__RegisterViewS2 {
  padding: 0 16px;
  .el-input {
    height: 46px;
  }

  .err {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: normal;
    line-height: 14px;
    letter-spacing: -0.3px;
    color: #f3485b;
  }

  .label {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: normal;
    line-height: 14px;
    letter-spacing: -0.6px;
    text-align: left;
    color: #252a36;
  }
  .line {
    display: flex;
    justify-content: space-between;
    .relative {
      position: relative;
    }
    .clock {
      position: absolute;
      right: 15px;
      top: 13px;
      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: -0.75px;
      color: #f3485b;
    }
    .btn {
      width: 120px;
      height: 46px;
      border-radius: 10px;
      background-color: #1767b3;
      display: flex;
      align-items: center;
      justify-content: center;

      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
