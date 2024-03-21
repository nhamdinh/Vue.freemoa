<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import pluswhite from '@/assets/svg/pluswhite.svg'
import rightblue from '@/assets/svg/rightblue.svg'
import { displayTimeLeft } from '@/common/commonFunction'
import { ref, watch, watchEffect, onMounted } from 'vue'
import router from '@/router'
import { formatPhone } from '@/common/commonFunction'
import { NumbersOnly } from '@/common/commonFunction'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import Loading from '@/components/Loading.vue'
import { SUCCESS } from '@/common/constance'

const sizeMax = 5 * 1000 * 1000

const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)

const fullName = ref<any>(profile.value?.fullName)
const phoneNumber = ref<any>(profile.value?.phoneNumber)
const email = ref<any>(profile.value?.email)
const title = ref<any>('')
const question = ref<any>('')

watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value

  fullName.value = stProfile.value?.fullName
  email.value = stProfile.value?.email
  phoneNumber.value = (stProfile.value?.phoneNumber).replace('+84', '0')
})

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

const inquiryRepo = RepositoryFactory.get('inquiry')
const isLoading = ref<any>(false)
const isLoadingUpload = ref<any>(false)

const onCreateInquiry = async () => {
  isLoading.value = true
  if (acceptTerm.value) {
    await inquiryRepo
      .createInquiry({
        fullName: fullName.value,
        email: email.value,
        question: question.value,
        phoneNumber: '+' + phoneNumber.value.toString(),
        title: title.value,
        companyName: 'uptempo VN',
        companyAddress: '181 Trần Quốc Vượng, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
        acceptTerm: true,
        file: [...imgArr.value]
      })
      .then((res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          console.log(data)
          openDialogProp(SUCCESS)
        }
      })
      .catch((err: any) => {
        console.log(err)

        openDialogProp('FAIL')
      })
  }

  isLoading.value = false
}

const acceptTerm = ref<any>(false)

const AuthRepo = RepositoryFactory.get('auth')
const someElement = ref<any>()
const imgArr = ref<any>([])

const onUploadFile = async (e: any) => {
  // const file = someElement.value.files[0]
  const image = e.target.files[0]
  const type = image ? image.type.split('/')[1] : ''
  let sizeImg = image ? Number(image?.size) : sizeMax + 1

  if ((type === 'jpg' || type === 'jpeg' || type === 'png') && sizeImg <= sizeMax) {
    isLoadingUpload.value = true

    const formData = new FormData()
    formData.append('file', e.target.files[0])
    formData.append('type', '5')
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
      let imgArr_temp = [...imgArr.value]
      imgArr_temp.push(avatar)
      imgArr.value = [...imgArr_temp]
    }
    isLoadingUpload.value = false
  }
}

const isValid = () => {
  return acceptTerm.value
}
</script>

<template>
  <div class="wrapper__main mt0px" style="max-height: calc(100vh - 60px)">
    <div class="InquiryCreate">
      <div class="InquiryCreate__content">
        <div class="label mt15px">성함</div>
        <el-input class="mt6px w328px" v-model="fullName" placeholder="성함을 입력하세요" />
        <div class="label mt15px">연락처</div>
        <el-input
          oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
          maxlength="11"
          v-on:keypress="
            (event: any) => {
              NumbersOnly(event)
            }
          "
          class="mt6px w328px"
          v-model="phoneNumber"
          placeholder="연락처를 입력하세요"
        />
        <div class="label mt15px">이메일</div>
        <el-input class="mt6px w328px" v-model="email" placeholder="이메일을 입력하세요" />
        <div class="label mt15px">제목</div>
        <el-input class="mt6px w328px" v-model="title" placeholder="제목을 입력하세요" />

        <div class="label mt15px">문의 내용</div>
        <el-input
          :autosize="{ minRows: 6, maxRows: 10 }"
          type="textarea"
          class="mt6px w328px"
          v-model="question"
          placeholder="문의 내용을 입력하세요."
        />
        <div class="label mt15px">첨부파일</div>

        <div class="upload mt10px">
          <label v-if="isLoadingUpload" class="add__btn cursor__pointer">
            <Loading />
          </label>
          <label
            v-else
            class="add__btn cursor__pointer"
            htmlFor="icon-button-file"
            v-if="imgArr.length < 10"
          >
            <img :src="pluswhite" alt="pluswhite" />
          </label>

          <img
            v-for="(item, index) in imgArr"
            :key="index"
            :src="item"
            alt="item"
            class="img__uploaded"
          />
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

        <div class="label mt15px">약관동의</div>
        <div class="line__InquiryView">
          <div class="line__InquiryView__left" @click="acceptTerm = !acceptTerm">
            <div :class="acceptTerm ? 'check1' : 'uncheck'">
              <div
                class="uncheck__inside"
                :class="acceptTerm ? 'check__inside' : 'uncheck__inside'"
              ></div>
            </div>

            <div class="line__label">개인정보 수집 및 이용 동의</div>
          </div>

          <div class="next__btn" @click="router.push({ path: '/introduce', query: { step: 4 } })">
            <img :src="rightblue" alt="" />
          </div>
        </div>

        <div class="InquiryView__btns mt44px mb30px">
          <div class="btn__cancel">취소</div>
          <div @click="onCreateInquiry" :class="isValid() ? 'btn__ok__end' : 'btn__ok__dis'">
            <Loading v-if="isLoading" />
            <p v-else>작성완료</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.InquiryCreate {
  display: flex;
  flex-direction: column;
  align-items: center;
  .el-input {
    height: 46px;
  }
  .InquiryView__btns {
    display: flex;
    gap: 10px;
    @mixin InquiryView__btn {
      width: 159px;
      height: 50px;
      border-radius: 16px;
      display: flex;
      justify-content: center;
      align-items: center;

      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: normal;
      line-height: 18px;
      letter-spacing: -0.75px;
      text-align: center;

      cursor: pointer;
    }
    .btn__cancel {
      @include InquiryView__btn;

      border: solid 1px #0067b9;
      background-color: #fff;
      color: #0067b9;
    }
    .btn__ok__end {
      @include InquiryView__btn;
      color: #fff;
      background-color: #0067b9;
    }
    .btn__ok__dis {
      @include InquiryView__btn;

      background-color: #cbd2da;
      color: #52606d;
      cursor: not-allowed;
    }
  }

  .label {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: 600;
    line-height: 14px;
    letter-spacing: -0.6px;
    text-align: left;
    color: #1f2933;
  }
  .upload {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .add__btn {
    width: 76px;
    height: 76px;

    background-color: #1867b3;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img__uploaded {
    min-width: 76px;
    min-height: 76px;
    width: 76px;
    height: 76px;
    background-position: center center;
    object-fit: cover;
    background-size: cover;
  }
  .line__InquiryView {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .line__InquiryView__left {
      display: flex;
      align-items: center;
      gap: 5px;
      .line__label {
        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-weight: normal;
        line-height: 18px;
        letter-spacing: -0.75px;
        text-align: left;
        color: #242a37;
        cursor: pointer;
      }
    }
    .next__btn {
      width: 30px;
      height: 30px;
      background-color: #e2f1ff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>
