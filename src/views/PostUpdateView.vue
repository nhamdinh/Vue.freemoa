<script setup lang="ts">
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { ref, watchEffect, watch } from 'vue'
import archiveP from '@/assets/svg/archiveP.svg'
import imageP from '@/assets/svg/imageP.svg'
import circleP from '@/assets/svg/play-circleP.svg'
import left from '@/assets/svg/left.svg'
import router from '@/router'
import Loading from '@/components/Loading.vue'
import Editor from '@tinymce/tinymce-vue'
import { sizeMax } from '@/common/constance'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const articleId = urlParams.get('id')

const value2 = ref<any>('')
const title = ref<any>('')
const content = ref<any>('')
const image1 = ref<any>('')

const dataTags = ref<any>([])
const dataFetch = ref<any>({})
const summary = ref<any>('')

const CompanyRepo = RepositoryFactory.get('company')
const ArticleRepo = RepositoryFactory.get('article')
const isLoading = ref<any>(true)

const onGetArticleById = async () => {
  await ArticleRepo.getArticleById({
    articleId
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        dataFetch.value = data?.data
        summary.value = data?.data?.detail?.content
        title.value = data?.data?.detail?.title
        image1.value = data?.data?.detail?.image
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  isLoading.value = false
}
watch([dataTags, dataFetch], async (newV, oldV) => {
  if (dataTags.value.length > 0) {
    dataTags.value.map((tag: any) => {
      if (tag?.value === dataFetch.value?.detail?.category) {
        value2.value = tag?.value
      }
    })
  }
})
const onUpdatePost = async () => {
  await ArticleRepo.updatePost({
    id: dataFetch.value?.detail?.id,
    title: title.value,
    content: summary.value,
    category: value2.value,
    image: image1.value
  })
    .then((res: any) => {
      const data = res?.data
      // console.log(data)
      if (data?.status === 'OK') {
        router.push({
          path: '/best-community-post-detail',
          query: { id: dataFetch.value?.detail?.id }
        })
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
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
  let sizeImg = image ? Number(image?.size) : sizeMax * 5 + 1
  // console.log(image)
  if (sizeImg <= sizeMax * 5) {
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
        value2.value = data?.data ? data?.data[0]?.code : ''
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}
watchEffect(() => {
  onGetListTags()
  onGetArticleById()
})
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
    <div class="Header__main">
      <img
        class="cursor__pointer iconx__iconx"
        :src="left"
        width="24"
        alt="iconx"
        @click="router.push({ path: '/best-community-post-detail', query: { id: articleId } })"
      />
      <div class="login">게시글 수정</div>
      <div @click="onUpdatePost" class="cursor__pointer iconx__right create__post">수정</div>
    </div>
    <Loading v-if="isLoading" />

    <div v-else>
      <div class="create__main">
        <div class="create__input">
          <el-select
            disabled="true"
            v-model="value2"
            class="w360px"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in dataTags"
              :key="item?.value"
              :label="item?.label"
              :value="item?.value"
            />
          </el-select>

          <div class="box__input mt10px">
            <el-input class="mt10px w360px" v-model="title" placeholder="제목을 입력하세요" />
          </div>

          <div class="mt10px">
            <!-- <Editor v-model="editorValue" :init="init"></Editor> -->
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

        <div class="btn__list pl16px mb20px mt20px btn__list__fixed">
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
  </div>
</template>

<style lang="scss"></style>
