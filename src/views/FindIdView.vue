<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import { displayTimeLeft } from '@/common/commonFunction'
import router from '@/router'
import Header from '@/components/Header.vue'

import { ref, watch, watchEffect, onMounted } from 'vue'

import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { NumbersOnly } from '@/common/commonFunction'

import Loading from '@/components/Loading.vue'
import { CORRECT_OTP, FAIL, INCORRECT_OTP, SUCCESS, WRONG_PHONE } from '@/common/constance'
const AuthRepo = RepositoryFactory.get('auth')
const isLoading = ref<any>(false)
const isLoadingPhone = ref<any>(false)
const isLoadingOtp = ref<any>(false)

const isValid = () => {
  return phoneNumber.value && 1
}

const onVerifyFindId = async () => {
  if (isValid()) {
    console.log('Received values of form: ')
    isLoading.value = true
    await AuthRepo.verifyFindId({
      phoneNumber: '+' + phoneNumber.value
    })
      .then((res: any) => {
        const data = res?.data

        if (data?.status === 'OK') {
          openDialogProp(SUCCESS)
          dataFetch.value = data?.data
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
  if (otp.value.length === 6) {
    console.log('Received values of form: ')
    isLoadingOtp.value = true
    const res = await AuthRepo.verifyOtp({
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
        console.log(err)
        openDialogProp(INCORRECT_OTP)
      })

    isLoadingOtp.value = false
  }
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

const phoneNumber = ref<any>('')
const otp = ref<any>('')

const tab = ref<any>(1)
const countLocal = ref<any>(0)
const timer = ref<any>(0)
const isStart = ref<any>(false)

const dataFetch = ref<any>('')

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

watchEffect(() => {
  // console.log(itemRefs.value.map(i => i.textContent))
  // setInterval(() => { startTimer() }, 1000);
})
</script>

<template>
  <div class="FindAccView">
    <div class="FindIdView__content">
      <Header :back="'/login'" :icon="2" :title="'아이디/비밀번호 찾기'"></Header>

      <div class="top__FindIdView">
        <div class="navigate">
          <div class="navigate__btn__enabled">아이디 찾기</div>
          <div class="navigate__btn__disabled" @click="router.push({ path: '/find-password' })">
            비밀번호 찾기
          </div>
        </div>
        <div class="label mt15px">휴대폰인증*</div>

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

          <div v-if="isLoadingPhone" class="btn">
            <Loading />
          </div>
          <div v-else class="btn" @click="onVerifyPhone">
            <p>인증번호 요청</p>
          </div>
        </div>
        <div class="line mt10px mb30px">
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
      </div>
      <div class="bottom__FindIdView">
        <div class="bottom__wrapper">
          <div class="title">고객님의 가입계정 목록입니다.</div>
          <div class="desc mt4px">입력하신 휴대폰 번호로 가입된 아이디입니다.</div>
          <div class="table mt12px">
            <div class="row">{{ dataFetch }}</div>
          </div>
        </div>

        <div v-if="isLoading" class="check__enabled mt155px mb29px">
          <Loading />
        </div>
        <div
          v-else
          class="mt155px mb29px"
          :class="isValid() ? 'check__enabled' : 'check__disabled'"
          @click="onVerifyFindId"
        >
          <p>확인</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.FindAccView {
  width: 100%;
  .text-success {
    color: #1767b3;
  }
  .spinner-border {
    display: inline-block;
    width: 24px;
    height: 24px;
    vertical-align: -0.125em;
    border: 0.25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    -webkit-animation: 0.75s linear infinite spinner-border;
    animation: 0.75s linear infinite spinner-border;
  }
  @keyframes spinner-border {
    100% {
      transform: rotate(360deg);
    }
  }
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

.FindIdView__content {
  .top__FindIdView {
    padding: 0 16px;

    .label {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: normal;
      line-height: 14px;
      letter-spacing: -0.6px;
      text-align: left;
      color: #252a36;
    }
  }

  .bottom__FindIdView {
    padding: 0 16px;
    padding-top: 20px;
    background-color: #f1f2f6;
    .bottom__wrapper {
      padding: 15px;
      width: 328px;
      margin: 0 auto;
      border-radius: 10px;
      box-shadow: 0 0 8px 0 #d9e3ed;
      background-color: #fff;
      .title {
        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-weight: bold;
        line-height: 18px;
        letter-spacing: -0.38px;
        text-align: left;
        color: #252a36;
      }
      .desc {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: normal;
        line-height: 14px;
        letter-spacing: -0.3px;
        color: #52606d;
      }
      .table {
        display: flex;
        flex-direction: column;
        gap: 9px;
        .row {
          font-family: SpoqaHanSansNeo;
          font-size: 15px;
          font-weight: bold;
          line-height: 18px;
          letter-spacing: -0.38px;
          text-align: left;
          color: #3566ae;
        }
      }
    }
  }

  .el-input {
    width: 198px;
    height: 46px;
  }
}
</style>
