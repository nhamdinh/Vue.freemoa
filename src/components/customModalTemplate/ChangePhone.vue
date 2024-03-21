<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import { ref, watch, watchEffect, onMounted } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import { NumbersOnly, displayTimeLeft } from '@/common/commonFunction'
import InfoOnPopup from '../PopupOnPopup/InfoOnPopup.vue'
import { INCORRECT_OTP, SAVE_SUCCESS, WRONG_PHONE } from '@/common/constance'
import { useAuthStore } from '@/stores/auth'

const store = useCustomDialogStore()

const { closeDialog } = store

const storeAuth = useAuthStore()
const { setProfile } = storeAuth

const AuthRepo = RepositoryFactory.get('auth')

const isLoadingChange = ref<any>(false)
const otp = ref<any>('')
const timer = ref<any>(0)
const isStart = ref<any>(false)
const isLoading = ref<any>(false)
const isLoadingOtp = ref<any>(false)
const phoneNumber = ref<any>('')
const info = ref<any>('')
const isShow = ref<any>(false)

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

const onVerifyNewPhone = async () => {
  if (phoneNumber.value) {
    isLoading.value = true
    await AuthRepo.verifyNewPhone({
      phoneNumber: '+' + phoneNumber.value
    })
      .then((res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          timer.value = 180
          isStart.value = true

          isShow.value = true
          info.value = '인증번호를 발송하였습니다.'
        } else {
          openDialogProp(WRONG_PHONE)
        }
      })
      .catch((err: any) => {
        openDialogProp(WRONG_PHONE)

        console.log(err)
      })
    isLoading.value = false
  }
}
const onVerifyNewOtp = async () => {
  if (otp.value.length === 6) {
    isLoadingOtp.value = true
    await AuthRepo.verifyNewOtp({
      phoneNumber: '+' + phoneNumber.value,
      otp: otp.value
    })
      .then((res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          isShow.value = true
          info.value = '휴대폰 인증에 성공하였습니다.'
        } else {
          isShow.value = true
          info.value = INCORRECT_OTP
        }
      })
      .catch((err: any) => {
        isShow.value = true
        info.value = INCORRECT_OTP
        console.log(err)
      })
    isLoadingOtp.value = false
  }
}
const onChangePhone = async () => {
  if (isValid()) {
    isLoadingChange.value = true
    await AuthRepo.changePhone({
      phoneNumber: '+' + phoneNumber.value
    })
      .then((res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          openDialogProp(SAVE_SUCCESS)
          onGetProfile()
        } else {
          isShow.value = true
          info.value = WRONG_PHONE
        }
      })
      .catch((err: any) => {
        isShow.value = true
        info.value = WRONG_PHONE
        console.log(err)
      })
    isLoadingChange.value = false
  }
}
const onGetProfile = async () => {
  await AuthRepo.getProfile()
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        // dataPost.value = data?.data
        setProfile({ stProfile: data?.data })
      }
    })
    .catch((err: any) => {
      console.log(err)
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
  return phoneNumber.value && otp.value.length === 6
}
</script>

<template>
  <div class="ChangePhone">
    <InfoOnPopup :info="info" v-if="isShow" @closeFilter="isShow = false"></InfoOnPopup>

    <div class="ChangePhone__content">
      <div class="content__title">휴대폰 재인증</div>
      <div class="input__pass mt30px">
        <div class="label mt15px">휴대폰인증*</div>

        <div class="line mt6px">
          <el-input
            class="w168px"
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

          <div v-if="isLoading" class="btn w110px">
            <Loading />
          </div>
          <div v-else class="btn w110px" @click="onVerifyNewPhone">
            <p>인증번호 요청</p>
          </div>
        </div>
        <div class="line mt10px mb30px">
          <div class="relative">
            <el-input
              class="w168px"
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

          <div v-if="isLoadingOtp" class="btn w110px">
            <Loading />
          </div>

          <div v-else @click="onVerifyNewOtp" class="btn w110px">인증 확인</div>
        </div>
      </div>
    </div>
    <div class="ChangePassword__btns mt30px">
      <div @click="closeDialog" class="btn__cancel">취소</div>
      <div v-if="isLoadingChange" class="btn__ok">
        <Loading />
      </div>
      <div v-else @click="onChangePhone" :class="isValid() ? 'btn__ok' : 'btn__ok__disabled'">
        변경
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ChangePhone {
  position: relative;
  .ChangePhone__content {
    padding: 0 20px;
    padding-top: 30px;
    .content__title {
      font-family: SpoqaHanSansNeo;
      font-size: 18px;
      font-weight: 600;
      line-height: 22px;
      letter-spacing: -0.45px;
      color: #000;
      text-align: center;
    }
    .input__pass {
      .label {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.6px;
        color: #252a36;
      }
    }
  }

  .ChangePassword__btns {
    display: flex;
    border-top: 1px solid #0067b9;
    @mixin ChangePassword__btn {
      flex: 1;
      cursor: pointer;
      height: 46px;

      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: normal;
      line-height: 20px;
      letter-spacing: -0.75px;

      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn__cancel {
      @include ChangePassword__btn;
      background-color: #fff;
      color: #0067b9;
      border-bottom-left-radius: 10px;
    }
    .btn__ok {
      @include ChangePassword__btn;
      background-color: #0067b9;
      color: #fff;
      border-bottom-right-radius: 10px;
    }
    .btn__ok__disabled {
      @include ChangePassword__btn;
      background-color: #cbd2da;
      color: #52606d;
      cursor: not-allowed;
      border-bottom-right-radius: 10px;
    }
  }
}
</style>
