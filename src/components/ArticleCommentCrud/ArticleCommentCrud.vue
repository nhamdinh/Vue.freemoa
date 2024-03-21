<script setup lang="ts">
import { ref, watch } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { useCustomDialogStore } from '@/stores/customDialog'
import bacham17 from '@/assets/svg/3cham17.svg'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const props = defineProps(['item'])
const emits = defineEmits(['onGetArticleById', 'isEditComment'])

const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

const store = useCustomDialogStore()
const { openDialog, falseReport } = store
const { stIsReport } = storeToRefs(store)

watch(stIsReport, async (newV, oldV) => {
  if (stIsReport.value) {
    emits('onGetArticleById', props?.item?.id)
    falseReport()
  }
})

const showAction = ref<any>(false)

const openPopup = (stType: any) => {
  openDialog({
    stType: stType,
    stTitle: '삭제 하시겠습니까?',
    stCancelText: '취소',
    stOkText: '확인',
    stClosable: false,
    stData: { articleId: props?.item?.id, type: 2 }, //for report comment
    actionConfirm: () => {
      //   console.log(props?.item?.id)
      onDeleteCommentArticleById()
      showAction.value = false
    },
    actionCancel: () => {
      showAction.value = false
    },
    actionAfterClose: () => {}
  })
}

const ArticleRepo = RepositoryFactory.get('article')

const onDeleteCommentArticleById = async () => {
  await ArticleRepo.deleteCommentArticleById({
    id: props?.item?.id
  })
    .then((res: any) => {
      const data = res?.data

      if (data?.status === 'OK') {
        emits('onGetArticleById', props?.item?.id)
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}
</script>

<template>
  <div
    tabindex="0"
    @blur="showAction = false"
    @click="showAction = !showAction"
    class="card__top__action cursor__pointer"
    v-if="item?.user?.id === profile?.id"
  >
    <img :src="bacham17" alt="bacham17" />
    <div class="card__action" v-if="showAction">
      <div
        @click="
          () => {
            emits('isEditComment')
          }
        "
      >
        수정
      </div>
      <div
        @click="
          () => {
            openPopup('confirm')
          }
        "
      >
        삭제
      </div>
    </div>
  </div>

  <div
    tabindex="0"
    @blur="showAction = false"
    @click="showAction = !showAction"
    class="card__top__action cursor__pointer"
    v-else
  >
    <img :src="bacham17" alt="bacham17" />
    <div class="card__action__report" v-if="showAction">
      <div
        @click="
          () => {
            openPopup('Report')
          }
        "
      >
        신고
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.info__content {
  flex: 1;
  .df {
    display: flex;
    justify-content: space-between;
  }
  .user__fullName {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: bold;
    line-height: 16px;
    letter-spacing: normal;
    color: #242a37;
  }
  .user__content {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.67;
    letter-spacing: -0.38px;
    text-align: left;
    color: #242a37;
  }
  .reply {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: -0.38px;
    color: #9ba5b1;
    cursor: pointer;
  }
  .reply__input {
    position: relative;
    .input__reply {
      width: 283px;
      height: 31px;
      border: solid 1px #242a37;
      background-color: #fff;
      border-radius: 6px;
      padding-left: 16px;
    }
    .send24 {
      position: absolute;
      top: 4px;
      right: 12px;
      cursor: pointer;
    }
  }
}
</style>
