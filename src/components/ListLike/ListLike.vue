<script setup lang="ts">
import { ref, watch } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import likexanh from '@/assets/img/likexanh.png'
import likexanhlike from '@/assets/img/likexanhlike.png'

import Loading from '@/components/Loading.vue'
import router from '@/router'
import { TO_LOGIN } from '@/common/constance'
import { useCustomDialogStore } from '@/stores/customDialog'
const props = defineProps(['item'])
const emits = defineEmits(['getArticleList'])

const ArticleRepo = RepositoryFactory.get('article')

const isLoadingLike = ref<any>(false)

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
const onLikeDislikeArticle = async (id: any) => {
  isLoadingLike.value = true

  await ArticleRepo.likeDislikeArticle({
    articleId: id
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        emits('getArticleList', id)
      }
    })
    .catch((err: any) => {
      console.log(err)
      if (err?.response?.status === 401) {
        openPopup('confirm')
      }
    })
  isLoadingLike.value = false
}

const dataFetchLike = ref<any>([])
const isLoadingListLike = ref<any>(false)
const onGetUsersLike = async (id: any) => {
  isLoadingListLike.value = true
  await ArticleRepo.getUsersLike({
    articleId: id
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        dataFetchLike.value = data.data
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  isLoadingListLike.value = false
}
const activeId = ref<any>('')

watch(activeId, async (newQuestion, oldQuestion) => {
  if (activeId.value && props.item?.totalLikes > 0) {
    onGetUsersLike(activeId.value)
  }
})
</script>

<template>
  <div class="totalLikes" v-on:mouseover="activeId = item?.id">
    <Loading v-if="isLoadingLike" />
    <img
      v-else
      @click="
        (e) => {
          e.stopPropagation()
          onLikeDislikeArticle(item?.id)
        }
      "
      class="icon_img cursor__pointer"
      :src="item?.isLike ? likexanhlike : likexanh"
      alt="likexanh"
    />
    <div>{{ item?.totalLikes ?? 0 }}</div>
    <div class="list__like">
      <Loading v-if="isLoadingListLike" />

      <div v-else class="item__like" v-for="(item, index) in dataFetchLike">
        <div class="fullName">
          {{ item?.fullName }}
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
