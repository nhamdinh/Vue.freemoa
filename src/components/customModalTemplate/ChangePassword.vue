<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import { ref, watch, watchEffect, onMounted } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import { FAIL, SUCCESS } from '@/common/constance'
import { isPassMatch } from '@/common/commonFunction'

const store = useCustomDialogStore()

const { closeDialog } = store
const cuPass = ref<any>('')
const pass = ref<any>('')
const rePass = ref<any>('')

const AuthRepo = RepositoryFactory.get('auth')

const isLoadingChange = ref<any>(false)

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

const isValid = () => {
  return cuPass.value && rePass.value && pass.value && isPassMatch(pass.value, rePass.value)
}

const onChangePasswordInfo = async () => {
  if (isValid()) {
    isLoadingChange.value = true

    await AuthRepo.changePasswordInfo({
      oldPassword: cuPass.value,
      newPassword: pass.value,
      confirmPassword: rePass.value
    })
      .then((res: any) => {
        const data = res?.data

        if (data?.status === 'OK') {
          openDialogProp(SUCCESS)

          // console.log(data?.data)
          // onGetProfile()
          closeDialog()
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
</script>

<template>
  <div class="ChangePassword">
    <div class="ChangePassword__content">
      <div class="content__title">비밀번호 변경</div>
      <div class="input__pass mt30px">
        <div class="label">현재 비밀번호</div>
        <el-input
          type="password"
          show-password
          v-model="cuPass"
          class="mt6px w288px"
          placeholder="현재 비밀번호를 입력하세요"
        />
      </div>
      <div class="input__pass mt30px">
        <div class="label">새로운 비밀번호 입력</div>
        <el-input
          type="password"
          show-password
          v-model="pass"
          class="mt6px w288px"
          placeholder="새로운 비밀번호를 입력하세요"
        />
      </div>
      <div class="input__pass mt15px">
        <div class="label">새로운 비밀번호 재입력</div>
        <el-input
          type="password"
          show-password
          v-model="rePass"
          class="mt6px w288px"
          placeholder="비밀번호를 재입력하세요"
        />
      </div>
    </div>
    <div class="ChangePassword__btns mt30px">
      <div @click="closeDialog" class="btn__cancel">취소</div>
      <div v-if="isLoadingChange" class="btn__ok">
        <Loading />
      </div>
      <div
        v-else
        @click="onChangePasswordInfo"
        :class="isValid() ? 'btn__ok' : 'btn__ok__disabled'"
      >
        변경
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ChangePassword {
  .ChangePassword__content {
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
