<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue'
import Header from '@/components/Header.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
// import eyenau from '@/assets/img/eyenau.png'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useCustomDialogStore } from '@/stores/customDialog'
import { CONNECT_FAIL } from '@/common/constance'

const store = useCustomDialogStore()
const { openDialog } = store
const openDialogProp = (text: any) => {
  openDialog({
    stType: 'info',
    stTitle: text,
    stOkText: '확인'
  })
}

const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

const tab = ref<any>(true)
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const articleId = urlParams.get('id')

const dataFetch = ref<any>({})
const ArticleRepo = RepositoryFactory.get('article')

const isLoading = ref<any>(true)
const isLoadingLike = ref<any>(false)
const showAction = ref<any>(false)
const value = ref<any>('')

const onGetArticleById = async () => {
  await ArticleRepo.getArticleById({
    articleId,
    pageSize: 5,
    pageNum: 1,
    orderSort: 'DESC'
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        dataFetch.value = data?.data
      } else {
        openDialogProp(CONNECT_FAIL)
      }
    })
    .catch((err: any) => {
      openDialogProp(CONNECT_FAIL)
      console.log(err)
    })
  isLoadingLike.value = false
  isLoading.value = false
}

watchEffect(() => {
  onGetArticleById()
})

const morePrevious = ref<any>(false)
const moreNext = ref<any>(false)
</script>

<template>
  <!-- XOAAAAAAAAAAA -->
  <div class="MyWritingDetailView">
    <Header :icon="2" :title="'1:1 문의'"></Header>
  </div>
</template>

<style lang="scss">
.MyWritingDetailView {
  width: 100%;
  min-height: calc(100vh - 10px);
}
</style>
