<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import { ref, watch, watchEffect } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import DeliveryGroupUnit from './DeliveryGroupUnit.vue'
import Loading from '@/components/Loading.vue'
import { PAGESIZE_10 } from '@/common/constance'

const props = defineProps(['content', 'groupChatId'])
const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

const store = useCustomDialogStore()

const { closeDialog } = store
const isLoading = ref<any>(false)
const currentPa = ref<any>(1)
const totalPa = ref<any>(1)
const params = ref<any>({
  pageSize: PAGESIZE_10,
  pageNum: currentPa.value
})
const dataGroups = ref<any>([])
const ChatRoomRepo = RepositoryFactory.get('chatRoom')

const onGetListGroup = async () => {
  isLoading.value = true
  await ChatRoomRepo.getListGroup(params.value)
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        let dataGr: any = []
        if (data?.data?.length > 0) {
          if (data?.totalCount % PAGESIZE_10 === 0) {
            totalPa.value = Math.floor(data?.totalCount / PAGESIZE_10)
          } else {
            totalPa.value = Math.floor(data?.totalCount / PAGESIZE_10 + 1)
          }
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
        }
        dataGroups.value = [...dataGroups.value.concat(dataGr)]
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoading.value = false
}

watchEffect(() => {
  onGetListGroup()
})

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
const isDelivery = ref<any>(false)

const selectMember = (id: any, dataFriend: any) => {
  let dataMemberFriend_emp: any = []
  dataFriend.map((mem: any) => {
    if (mem?.id === id) {
      dataMemberFriend_emp.push({ ...mem, choose: !mem.choose })
    } else {
      dataMemberFriend_emp.push(mem)
    }
  })
  // console.log(dataMemberFriend_emp)
  dataGroups.value = [...dataMemberFriend_emp]
}

const reset = () => {
  dataGroups.value = []
}

watch(props, async (newV, oldV) => {
  reset()
})
</script>

<template>
  <div class="group__list mt20px" @scroll="scrolling">
    <DeliveryGroupUnit
      v-for="(item, index) in dataGroups.filter((word: any) => word.id !== groupChatId)"
      :key="index"
      :item="item"
      :content="content"
      :isDelivery="isDelivery"
      @selectMember="
        (id: any) => {
          selectMember(id, dataGroups)
        }
      "
    >
    </DeliveryGroupUnit>
    <Loading v-if="isLoading" />
  </div>
  <div class="DeliveryFriends__btns mt36px">
    <div @click="closeDialog" class="btn__cancel">취소</div>
    <div @click="isDelivery = true" class="btn__ok">보내기</div>
    <!--<div @click="userJoin(dataGroups)" class="Invite mt10px">보내기</div>
-->
  </div>
</template>
<style lang="scss">
.partner__name__act {
  color: #f58220 !important;
}
.group__list {
  display: flex;
  flex-direction: column;
  gap: 10px;

  height: 240px;
  max-height: 240px;
  overflow-y: scroll;
  width: 288px;
  margin: 0 auto;
  .group__item {
    cursor: pointer;
    width: 100%;
    height: 40px;
    max-height: 40px;
    background-color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
    .group__img__40 {
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      border-radius: 50%;
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: center center;
      object-fit: cover;
      margin-right: 3px;
    }
    .group__imgs {
      width: 40px;
      height: 40px;
      display: flex;
      gap: 2px;
      flex-wrap: wrap;
      .group__img__19 {
        width: 19px;
        height: 19px;
        min-width: 19px;
        min-height: 19px;
        border-radius: 50%;
        background-size: cover;
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-position: center center;
        object-fit: cover;
      }
    }
    .group__item____text {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 4px;

      .text__a {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .name__date {
          display: flex;
          align-items: center;
          gap: 17px;
        }
        .name {
          font-family: SpoqaHanSansNeo;
          font-size: 15px;
          font-weight: 600;
          line-height: 20px;
          letter-spacing: -0.38px;
          color: #242a37;

          width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .date {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #52606d;
        }
        .time {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #52606d;
        }
      }

      .text__b {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #242a37;
        width: 173px;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
}
</style>
