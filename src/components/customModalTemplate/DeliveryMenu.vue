<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useCustomDialogStore } from '@/stores/customDialog'
import { useClipboard } from '@vueuse/core'

const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

const props = defineProps(['prStData'])

const store = useCustomDialogStore()

const { actionConfirm } = storeToRefs(store)
const { closeDialog } = store
const { openDialog } = store

const openPopup = (mess: any) => {
  openDialog({
    stType: 'DeliveryFriends',
    stTitle: '인증번호를 발송하였습니다.',
    stCancelText: 'THOII',
    stOkText: '확인',
    stData: { ...mess, day: Date.now() },
    stClosable: false,
    actionConfirm: () => {},
    actionCancel: () => {},
    actionAfterClose: () => {}
  })
}

const openPopupConfirm = (stType: any) => {
  openDialog({
    stType: stType,
    stTitle: '복사되었습니다.',
    stCancelText: '취소',
    stOkText: '확인',
    stClosable: false,
    actionConfirm: () => {},
    actionCancel: () => {},
    actionAfterClose: () => {}
  })
}

const source = ref<any>(props.prStData?.content)
const { text, copy, copied, isSupported } = useClipboard({ source })

watch(copied, async (newV, oldV) => {
  if (copied) {
    closeDialog()
    let open = setTimeout(function () {
      openPopupConfirm('info')
    }, 300)
    return () => {
      clearTimeout(open)
    }
  }
})
</script>

<template>
  <div class="DeliveryMenu">
    <div class="DeliveryMenu__content">
      <div class="DeliveryMenu__item" @click="copy(source)">내용 복사</div>
      <div
        class="DeliveryMenu__item"
        @click="
          () => {
            actionConfirm()
            closeDialog()
          }
        "
      >
        공지로 등록
      </div>
      <div
        class="DeliveryMenu__item"
        @click="
          () => {
            openPopup(prStData)
          }
        "
      >
        내용 전달
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.DeliveryMenu {
  .DeliveryMenu__content {
    padding: 0 10px;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    .DeliveryMenu__item {
      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: normal;
      line-height: 20px;
      letter-spacing: -0.38px;
      color: #242a37;

      width: 308px;
      height: 39px;
      display: flex;
      align-items: center;
      padding-left: 14px;
    }
  }
}
</style>
