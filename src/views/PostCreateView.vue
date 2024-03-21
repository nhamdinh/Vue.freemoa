<script setup lang="ts">
import Header from './../components/Header.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { ref, watchEffect, reactive, watch } from 'vue'
import archiveP from '@/assets/svg/archiveP.svg'
import imageP from '@/assets/svg/imageP.svg'
import circleP from '@/assets/svg/play-circleP.svg'
import left from '@/assets/svg/left.svg'
import router from '@/router'
import { TO_LOGIN, sizeMax } from '@/common/constance'
import { useCustomDialogStore } from '@/stores/customDialog'

import Editor from '@tinymce/tinymce-vue'
import { useCategoryStore } from '@/stores/category'
import { storeToRefs } from 'pinia'


const storeCategory = useCategoryStore()
const { stCategoryValue, stCategoryLabel } = storeToRefs(storeCategory)

const value2 = ref<any>(stCategoryValue)
const value1 = ref<any>(stCategoryLabel)
const title = ref<any>('')
const content = ref<any>('')
const image1 = ref<any>('')

const dataTags = ref<any>([])

const CompanyRepo = RepositoryFactory.get('company')
const ArticleRepo = RepositoryFactory.get('article')

const onCreatePost = async () => {
  if (title.value) {
    await ArticleRepo.createPost({
      title: title.value,
      content: summary.value,
      category: value2.value,
      image: image1.value
    })
      .then((res: any) => {
        const data = res?.data
        console.log(data)
        if (data?.status === 'OK') {
          router.push({ path: '/my-writing-list' })
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}
const AuthRepo = RepositoryFactory.get('auth')

const onUploadFile = async (e: any) => {
  const image = e.target.files[0]
  const type = image ? image.type.split('/')[1] : ''
  let sizeImg = image ? Number(image?.size) : sizeMax + 1
  // console.log(image)
  if (sizeImg <= sizeMax) {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    formData.append('type', '7')
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
      image1.value = avatar
      summary.value =
        summary.value + `<p><img src="${avatar}" alt="avatar" width="328" height="200" /></p>`
    }
  }
}
const onUploadVideo = async (e: any) => {
  const image = e.target.files[0]
  const type = image ? image.type.split('/')[1] : ''
  let sizeImg = image ? Number(image?.size) : sizeMax * 10 + 1
  // console.log(image)
  if (sizeImg <= sizeMax * 10) {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    formData.append('type', '7')
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
      summary.value =
        summary.value +
        `<p><video controls="" name="media"><source src="${avatar}" type="video/mp4"></video></p>`
    }
  }
}

const onUploadPdf = async (e: any) => {
  const image = e.target.files[0]
  const type = image ? image.type.split('/')[1] : ''
  let sizeImg = image ? Number(image?.size) : sizeMax + 1
  if (sizeImg <= sizeMax) {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    formData.append('type', '7')
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
      summary.value =
        summary.value + `<p><a target="_blank" href="${avatar}" >${image.name}</a></p>`
    }
  }
}

const store = useCustomDialogStore()
const { openDialog } = store

const openPopup = (stType: any) => {
  openDialog({
    stType: stType,
    stTitle: TO_LOGIN,
    stCancelText: '취소',
    stOkText: '확인',
    stClosable: false,
    actionConfirm: () => {
      router.push('/login')
      console.log('ok')
      //   console.log(props?.item?.id)
      // showAction.value = false
    },
    actionCancel: () => {
      // showAction.value = false
      console.log('cancel')
    },
    actionAfterClose: () => {}
  })
}

const openPopupCategory = (dataTags: any) => {
  // console.log(mess)
  openDialog({
    stType: 'CategoryList',
    stTitle: '인증번호를 발송하였습니다.',
    stCancelText: 'THOII',
    stOkText: '확인',
    stData: { CategoryList: dataTags, day: Date.now() },
    stClosable: false,
    actionConfirm: () => {
      console.log('xxx')
    },
    actionCancel: () => {
      // console.log("aaaaaaaaaaaaa")
    },
    actionAfterClose: () => {
      // console.log("xxxxxxxxx")
    }
  })
}

const onGetListTags = async () => {
  await CompanyRepo.getListTags({
    type: 'COMMUNITY_CATEGORY',
    code: '',
    name: ''
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        let dataFetch: any = data?.data ?? []
        let arrEmpty: any = []
        dataFetch.map((item: any) => {
          arrEmpty.push({
            value: item?.code,
            label: item?.name
          })
        })

        dataTags.value = arrEmpty
        // value2.value = data?.data ? data?.data[0]?.code : ''
      }
    })
    .catch((err: any) => {
      if (err?.response?.status === 401) {
        openPopup('confirm')
      }
      console.log(err)
    })
}
watchEffect(() => {
  onGetListTags()
})

const summary = ref<any>('')
</script>

<template>
  <div class="PostCreateView">
    <div className="none">
      <form id="form" encType="multipart/form-data">
        <input
          accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
          id="icon-button-pdf"
          type="file"
          @change="onUploadPdf"
        />
      </form>
    </div>
    <div className="none">
      <form id="form" encType="multipart/form-data">
        <input
          accept="video/mp4,video/x-m4v,video/*"
          id="icon-button-video"
          type="file"
          @change="onUploadVideo"
        />
      </form>
    </div>
    <div className="none">
      <form id="form" encType="multipart/form-data">
        <input
          accept="image/png, image/gif, image/jpeg"
          id="icon-button-file"
          type="file"
          @change="onUploadFile"
        />
      </form>
    </div>
    <div class="Header__main" style="justify-content: space-between">
      <img class="cursor__pointer" :src="left" width="24" alt="iconx" @click="router.go(-1)" />
      <div class="login">게시글 작성</div>
      <div @click="onCreatePost" class="cursor__pointer create__post">등록</div>
    </div>

    <div class="create__main">
      <div class="create__input">
        <div class="box__input">
          <el-input
            @click="
              () => {
                openPopupCategory(dataTags)
              }
            "
            v-model="value1"
            readonly
            class="w360px"
            placeholder="카테고리 선택"
            size="large"
          >
            <!-- <el-option
            v-for="item in dataTags"
            :key="item?.value"
            :label="item?.label"
            :value="item?.value"
          /> -->
          </el-input>
        </div>
        <div class="box__input mt10px">
          <el-input maxlength="50" class="w360px" v-model="title" placeholder="제목을 입력하세요" />
        </div>
        <!-- <el-input
          readonly="true"
          class="mt10px w360px"
          v-model="content"
          placeholder="내용을 입력하세요"
        /> -->

        <!-- <Editor v-model="editorValue" :init="init"></Editor> -->
        <div class="mt10px">
          <Editor
            v-model="summary"
            api-key="ytlxyafeoqebwontx5k6jihqppqg5atb3ke3uch14g6p7r13"
            :init="{
              menubar: false,
              plugins:
                'advlist autolink lists link image charmap preview\
                          searchreplace visualblocks code fullscreen\
                             paste code help wordcount media',
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | image media',
              height: 600,
              content_css: false,
              quickbars_insert_toolbar: false,
              branding: false
              // images_upload_handler: uploadImageHandler
            }"
          />
        </div>
      </div>

      <div class="btn__list ml1px pl15px btn__list__fixed">
        <label class="cursor__pointer" htmlFor="icon-button-pdf">
          <img :src="archiveP" alt="pluswhite" />
        </label>
        <label class="cursor__pointer" htmlFor="icon-button-file">
          <img :src="imageP" alt="pluswhite" />
        </label>
        <label class="cursor__pointer" htmlFor="icon-button-video">
          <img :src="circleP" alt="pluswhite" />
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.box__input {
  border-bottom: 1px solid #f1f2f6;
}
.create__main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 60px);
}
.create__input {
  max-height: calc(100vh - 80px);
  overflow: hidden;
}
.PostCreateView {
  // .tox.tox-tinymce {
  //   opacity: 0;
  // }
  // .mce-content-body {
  //   opacity: 1;
  // }
  width: 100%;
  position: relative;
  min-height: calc(100vh - 10px);
  overflow: hidden;
  .btn__list {
    display: flex;
    align-items: center;
    gap: 16px;
    height: 72px;
  }
  .btn__list__fixed {
    width: 352px;
    position: fixed;
    bottom: 0;
    background-color: #fff;
  }
  .create__post {
    font-family: SpoqaHanSansNeo;
    font-size: 15px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: normal;
    color: #1767b3;
  }
  .el-input {
    .el-input__wrapper {
      box-shadow: none;
      border-radius: 10px;
      border: none !important;
      .el-input__inner {
        outline: none !important;
        border: none !important;
        height: 42px;
      }
    }
    .el-input__wrapper.is-focus {
      border: none !important;
    }
  }
}
</style>
