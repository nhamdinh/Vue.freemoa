w
<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import { PAGESIZE_10 } from '@/common/constance'
import RoomChatUnit from './RoomChatUnit.vue'
import router from '@/router'
import { TO_LOGIN } from '@/common/constance'
import { useCustomDialogStore } from '@/stores/customDialog'

const emits = defineEmits(['setStep2'])
const dataGroups = ref<any>([])
// console.log(dataGroups)
const isLoading = ref<any>(false)

const currentPa = ref<any>(1)
const totalPa = ref<any>(1)
const params = ref<any>({
  pageSize: PAGESIZE_10,
  pageNum: currentPa.value
})

const ChatRoomRepo = RepositoryFactory.get('chatRoom')

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
      router.push('/home')

      // showAction.value = false
      console.log('cancel')
    },
    actionAfterClose: () => {}
  })
}

const onGetListGroup = async () => {
  isLoading.value = true

  await ChatRoomRepo.getListGroup(params.value)
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        if (data?.data?.length > 0) {
          if (data?.totalCount % PAGESIZE_10 === 0) {
            totalPa.value = Math.floor(data?.totalCount / PAGESIZE_10)
          } else {
            totalPa.value = Math.floor(data?.totalCount / PAGESIZE_10 + 1)
          }
          let dataGr: any = []
          data?.data.map((gr: any) => {
            let images: any = []
            gr?.members?.map((member: any) => {
              images.push(member?.avatar)
            })
            dataGr.push({
              ...gr,
              date: gr?.lastTimeChat,
              desc: gr?.content,
              images
            })
          })
          dataGroups.value = [...dataGroups.value.concat(dataGr)]

          // if (dataGr.length < PAGESIZE_10) {
          // } else {
          //   dataGroups.value = dataGr
          // }
        }
      }
    })
    .catch((err: any) => {
      if (err?.response?.status === 401) {
        openPopup('confirm')
        emits('setStep2')
      }
      console.log(err)
    })

  isLoading.value = false
}

const scrolling = (e: any) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  // console.log(scrollHeight)
  // console.log(clientHeight)
  // console.log(scrollTop)
  if (scrollTop + clientHeight >= scrollHeight - 2) {
    if (currentPa.value < totalPa.value) {
      params.value = {
        ...params.value,
        pageNum: currentPa.value + 1
      }
      currentPa.value = currentPa.value + 1
    }
  }
}

watchEffect(() => {
  onGetListGroup()
})

const someElement = ref<any>()
const scrollToTop = () => {
  // if (someElement.value) someElement.value.scrollIntoView({ behavior: 'smooth' })
  if (someElement.value) someElement.value.scrollIntoView()
}
</script>

<template>
  <div class="RoomChat__mid" @scroll="scrolling">
    <div class="mb20px mt20px" ref="someElement"></div>
    <RoomChatUnit
      @callList="onGetListGroup"
      v-for="(item, index) in dataGroups"
      :key="index"
      :item="item"
    >
    </RoomChatUnit>
    <Loading v-if="isLoading" />
  </div>
</template>

<style lang="scss"></style>
