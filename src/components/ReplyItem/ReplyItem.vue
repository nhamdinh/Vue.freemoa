<script setup lang="ts">
import { ref } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'

import ReplyCommentCrud from '@/components/ReplyCommentCrud/ReplyCommentCrud.vue'
import router from '@/router'
import { TO_LOGIN } from '@/common/constance'
import { useCustomDialogStore } from '@/stores/customDialog'

const props = defineProps(['itemx'])
const emits = defineEmits(['onGetCommentById'])

const reply = ref<any>(props.itemx?.content)

const isEditReply = ref<any>(false)
const isLoading = ref<any>(false)
const ArticleRepo = RepositoryFactory.get('article')

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

const onUpdateReplyComment = async () => {
  isLoading.value = true

  await ArticleRepo.createReplyComment({
    id: props.itemx?.id,
    articleCommentId: props.itemx?.articleCommentId,
    content: reply.value.trim()
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        // dataFetch.value = data?.data
        emits('onGetCommentById')
      }
    })
    .catch((err: any) => {
      if (err?.response?.status === 401) {
        openPopup('confirm')
      }
      console.log(err)
    })
  isLoading.value = false
}
</script>

<template>
  <div class="item__main">
    <img class="user__avatar" :src="itemx?.user?.avatar" alt="avatar" />
    <div class="info__content">
      <div class="df">
        <div class="user__fullName">
          {{ itemx?.user?.fullName }}
        </div>
        <ReplyCommentCrud
          @onGetCommentById="emits('onGetCommentById')"
          :item="itemx"
          @isEditReplyTrue="isEditReply = true"
        ></ReplyCommentCrud>
      </div>

      <div class="user__content mt4px" v-if="!isEditReply">
        {{ reply }}
      </div>

      <el-input
        v-else
        tabindex="11"
        maxlength="120"
        type="text"
        class="w240px mt4px"
        v-model="reply"
        placeholder="댓글을 작성해보세요"
        @keyup.enter="
          () => {
            onUpdateReplyComment()
            isEditReply = false
          }
        "
        @blur="isEditReply = false"
      />
    </div>
  </div>
</template>

<style lang="scss"></style>
