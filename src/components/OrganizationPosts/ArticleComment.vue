<script setup lang="ts">
import send24 from '@/assets/svg/send24.svg'
import { ref, watch } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import ArticleCommentCrud from '@/components/ArticleCommentCrud/ArticleCommentCrud.vue'
import ReplyItem from '@/components/ReplyItem/ReplyItem.vue'
import router from '@/router'
import { TO_LOGIN } from '@/common/constance'
import { useCustomDialogStore } from '@/stores/customDialog'

const props = defineProps(['cmItem'])
const emits = defineEmits(['onGetArticleById'])

const chatMess = ref<any>({ ...props.cmItem })
const reply = ref<any>('')
const comment = ref<any>(props.cmItem?.content)
const commentOrigin = ref<any>(props.cmItem?.content)
const showReply = ref<any>(false)

watch(props, async (newV, oldV) => {
  chatMess.value = props.cmItem
  comment.value = props.cmItem?.content
  commentOrigin.value = props.cmItem?.content
})

const articleCommentId = ref<any>('')
watch(articleCommentId, async (newV, oldV) => {
  onGetCommentById()
})
const isEditComment = ref<any>(false)
const isEditReply = ref<any>(false)
const isLoading = ref<any>(false)
const isLoadingUpdate = ref<any>(false)
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

const onUpdateArticleComment = async (articleId: any) => {
  isLoadingUpdate.value = true
  await ArticleRepo.createArticleComment({
    articleId: articleId,
    id: chatMess.value?.id,
    content: comment.value.trim()
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        commentOrigin.value = comment.value.trim()
        // emits('onGetArticleById')
      }
    })
    .catch((err: any) => {
      if (err?.response?.status === 401) {
        openPopup('confirm')
      }
      console.log(err)
    })
  isLoadingUpdate.value = false
}

const dataFetch = ref<any>([])

const onGetCommentById = async () => {
  isLoading.value = true
  if (showReply.value) {
    await ArticleRepo.getCommentById({
      articleCommentId: chatMess.value?.id
    })
      .then((res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          // console.log(data?.data)
          totalReplies.value = data?.totalCount
          dataFetch.value = data?.data
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  isLoading.value = false
}
const totalReplies = ref<any>(chatMess.value?.totalReplies)

const onCreateReplyComment = async () => {
  isLoading.value = true

  await ArticleRepo.createReplyComment({
    articleCommentId: chatMess.value?.id,
    content: reply.value.trim()
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        console.log(data?.data)
        // dataFetch.value = data?.data
        reply.value = ''
        onGetCommentById()
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
  <div class="post__chat__item">
    <div class="item__main">
      <img class="user__avatar" :src="chatMess?.user?.avatar" alt="avatar" />
      <div class="info__content">
        <div class="df">
          <div class="user__fullName">
            {{ chatMess?.user?.fullName }}
          </div>
          <ArticleCommentCrud
            @onGetArticleById="
              (id: any) => {
                emits('onGetArticleById', id)
              }
            "
            :item="chatMess"
            @isEditComment="isEditComment = true"
          ></ArticleCommentCrud>
        </div>

        <div class="user__content mt4px" v-if="!isEditComment">
          {{ commentOrigin }}
        </div>

        <el-input
          v-else
          tabindex="10"
          maxlength="120"
          type="text"
          class="w280px mt4px"
          v-model="comment"
          placeholder="댓글을 작성해보세요"
          @keyup.enter="
            () => {
              onUpdateArticleComment(chatMess?.articleId)
              isEditComment = false
            }
          "
          @blur="isEditComment = false"
        />
        <Loading v-if="isLoadingUpdate" />
        <div @click="showReply = !showReply" class="reply mt10px" v-if="totalReplies === 0">
          답글 달기
        </div>
        <div
          @click="
            () => {
              showReply = !showReply
              articleCommentId = chatMess?.id
              // onGetCommentById()
            }
          "
          class="reply mt10px"
          v-if="totalReplies !== 0"
        >
          답글 {{ totalReplies }}개
        </div>

        <div id="showReply" v-if="showReply">
          <div class="reply__input mt30px">
            <input
              @keyup.enter="onCreateReplyComment"
              v-model="reply"
              class="input__reply"
              type="text"
              placeholder="메시지 보내기"
            />
            <img @click="onCreateReplyComment" :src="send24" alt="send24" class="send24" />
          </div>
          <Loading v-if="isLoading" />

          <ReplyItem
            v-for="(itemx, index) in dataFetch"
            :key="index"
            :itemx="itemx"
            @onGetCommentById="onGetCommentById"
          ></ReplyItem>
        </div>
      </div>
    </div>

    <div class="end__box326"></div>
  </div>
</template>

<style lang="scss"></style>
