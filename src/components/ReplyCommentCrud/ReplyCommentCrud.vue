<script setup lang="ts">
import { ref, watch } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import router from '@/router'
import { useCustomDialogStore } from '@/stores/customDialog'
import bacham17 from '@/assets/svg/3cham17.svg'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const props = defineProps(['item', 'profile'])
const emits = defineEmits(['onGetCommentById', 'isEditReplyTrue'])

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
    emits('onGetCommentById')
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
    stData: { articleId: props?.item?.id, type: 0 }, //for report reply

    actionConfirm: () => {
      //   console.log(props?.item?.id)
      onDeleteReplyCommentById()
      showAction.value = false
    },
    actionCancel: () => {
      showAction.value = false
    },
    actionAfterClose: () => {}
  })
}

const ArticleRepo = RepositoryFactory.get('article')

const onDeleteReplyCommentById = async () => {
  await ArticleRepo.deleteReplyCommentById({
    id: props?.item?.id
  })
    .then((res: any) => {
      const data = res?.data

      if (data?.status === 'OK') {
        emits('onGetCommentById')
        // router.push({ path: props.backTo })
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
            emits('isEditReplyTrue')
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
<style lang="scss"></style>
