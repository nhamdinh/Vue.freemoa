<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import { ref, watch } from 'vue'
import { AVA, FAIL, SAVE_SUCCESS, SUCCESS, regexOnlyNumber } from '@/common/constance'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import avaback from '@/assets/img/avaback.png'
import Loading from '@/components/Loading.vue'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const sizeMax = 5 * 1000 * 1000
const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const { setProfile } = storeAuth

const profile = ref<any>(stProfile)
const username = ref<any>(profile.value?.username)
const fullName = ref<any>(profile.value?.companyName)
const phoneNumber = ref<any>(profile.value?.phoneNumber)
const avatar = ref<any>(stProfile.value?.avatar)
const email = ref<any>(stProfile.value?.email)

watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value

  username.value = stProfile.value?.username
  fullName.value = stProfile.value?.companyName
  avatar.value = stProfile.value?.avatar
  email.value = stProfile.value?.email
  phoneNumber.value = stProfile.value?.phoneNumber
})

const id3 = ref<any>('')
let pass = ref<any>('')

const tab = ref<any>(1)
const countLocal = ref<any>(0)
const timer = ref<any>(0)
const isStart = ref<any>(false)

const store = useCustomDialogStore()
const { openDialog } = store

const onOpenDialog = (type: any) => {
  openDialog({
    stType: type,
    stTitle: '인증번호를 발송하였습니다.',
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

const isNotValid = () => {
  return false
}

const changePass = (val: any) => {
  console.log(val)
  if (!val || !!val.match(regexOnlyNumber)) {
    console.log(!!val.match(regexOnlyNumber))
    console.log(pass.value)
    console.log(val)

    pass.value = val.target.value
  } else {
  }
}

const onlyNumber = ($event: any) => {
  let val = $event.target.value
  let keyCode = $event.keyCode ? $event.keyCode : $event.which
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
    // 46 is dot
    $event.preventDefault()
    console.log('xxxxx')
  }
}
const AuthRepo = RepositoryFactory.get('auth')
const someElement = ref<any>()

const onUploadFile = async (e: any) => {
  // const file = someElement.value.files[0]
  const image = e.target.files[0]
  const type = image ? image.type.split('/')[1] : ''
  let sizeImg = image ? Number(image?.size) : sizeMax + 1

  if ((type === 'jpg' || type === 'jpeg' || type === 'png') && sizeImg <= sizeMax) {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    formData.append('type', '1')
    // console.log(formData)
    let status = 'NO'
    let avatar = ''

    await AuthRepo.uploadFile(formData)
      .then((res: any) => {
        const data = res?.data

        if (data?.status === 'OK') {
          console.log(data?.data)
          avatar = data?.data
          status = 'OK'
        }
      })
      .catch((err: any) => {
        console.log(err)
      })

    if (status === 'OK') {
      await AuthRepo.changeAvatar({
        avatar
      })
        .then((res: any) => {
          const data = res?.data
          if (data?.status === 'OK') {
            console.log(data?.data)
            onGetProfile()
          }
        })
        .catch((err: any) => {
          console.log(err)
        })
    }
  }
}
const onGetProfile = async () => {
  isLoading.value = true
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

  isLoading.value = false
}

const isLoading = ref<any>(false)

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

const isLoadingChange = ref<any>(false)

const onUpdateProfile = async () => {

  isLoadingChange.value = true
  await AuthRepo.updateProfile({
    fullName: fullName.value,
    email: email.value
  })
    .then((res: any) => {
      const data = res?.data

      if (data?.status === 'OK') {
        openDialogProp(SAVE_SUCCESS)
        // console.log(data?.data)
        onGetProfile()
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
</script>

<template>
  <div class="MyInfoView__content wrapper__main mt0px" style="max-height: calc(100vh - 60px)">
    <div class="avatar__back__update">
      <img :src="avaback" alt="avaback" />
      <div class="user__info" style="width: 360px">
        <label htmlFor="icon-button-file">
          <img class="avatar__user cursor__pointer" :src="profile?.avatar ?? AVA" alt="avaback" />
        </label>
      </div>
    </div>

    <div className=" none">
      <form id="form" encType="multipart/form-data">
        <input
          ref="someElement"
          accept="image/jpg, image/png"
          id="icon-button-file"
          type="file"
          @change="onUploadFile"
        />
      </form>
    </div>
    <!--     <div @click="onUploadFile">upload</div> -->
    <div class="top__RegisterViewS2 mt20px">
      <div class="label">대화명</div>
      <el-input class="mt6px w328px" v-model="fullName" placeholder="회사명_이름_ID" />
      <!--         <div class="err mt6px">중복된 아이디 입니다.</div>
 -->
      <div class="label mt15px">이름</div>
      <div class="input__change">
        <el-input
          disabled="true"
          maxlength="20"
          class="mt6px w328px"
          v-model="username"
          placeholder="메인비즈"
        />
        <!-- <div class="change__btn" @click="onUpdateProfile">변경</div> -->
      </div>
      <div class="label mt15px">비밀번호</div>

      <div class="input__change">
        <el-input
          maxlength="20"
          class="mt6px w328px"
          v-model="id3"
          placeholder="10-20자 이내 비밀번호"
          disabled="true"
        />
        <div
          class="change__btn"
          @click="
            () => {
              onOpenDialog('ChangePassword')
            }
          "
        >
          변경
        </div>
      </div>

      <div class="label mt15px">이메일</div>
      <el-input class="mt6px w328px" v-model="email" placeholder="회사명_이름_ID" />

      <div class="label mt15px">휴대폰인증<span class="ata">*</span></div>

      <div class="cell__phone mt6px">
        <el-input
          disabled="true"
          class="w198px"
          v-model="phoneNumber"
          placeholder="회사명을 입력하세요."
        />
        <div
          @click="
            () => {
              onOpenDialog('ChangePhone')
            }
          "
          class="btn"
        >
          변경
        </div>
      </div>
      <!-- <div class="err mt6px">비밀번호를 확인해주세요.</div> -->
      <div v-if="isLoadingChange" class="btn__save mt40px mb40px">
        <Loading />
      </div>
      <div v-else @click="onUpdateProfile" class="btn__save mt40px mb40px">저장하기</div>
    </div>
    <!-- <Footer :active="6"></Footer> -->
  </div>
</template>

<style lang="scss"></style>
