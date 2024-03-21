<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import { ref, watch } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import find from '@/assets/svg/find.svg'
import Loading from '@/components/Loading.vue'
import DeliveryFriendUnit from './DeliveryFriendUnit.vue'

const props = defineProps(['content', 'day'])
const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

const store = useCustomDialogStore()

const { closeDialog } = store
const isLoading = ref<any>(false)

const dataMemberFriend = ref<any>([])
const username = ref<any>('')
const ChatRoomRepo = RepositoryFactory.get('chatRoom')

const onSearchMemberToGroup = async () => {
  isLoading.value = true
  await ChatRoomRepo.searchMemberToGroup({
    fullName: username.value,
    type: 1
    // fullName: 'minh'
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        let dataMemberFriend_temp: any = []
        data?.data?.map((da: any) => {
          if (da?.id !== profile.value.id) dataMemberFriend_temp.push({ choose: false, ...da })
        })
        dataMemberFriend.value = [...dataMemberFriend_temp]

        // scrollToTop()
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoading.value = false
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
  dataMemberFriend.value = [...dataMemberFriend_emp]
}

const reset = () => {
  dataMemberFriend.value = []
  username.value = ''
}

watch(props, async (newV, oldV) => {
  reset()
})
</script>

<template>
  <div class="invite__someone__bot">
    <div class="invite__someone ">
      <div class="find__relative mb20px">
        <el-input class="mt10px w288px" v-model="username" @keyup.enter="onSearchMemberToGroup" />
        <Loading v-if="isLoading" />

        <img v-else @click="onSearchMemberToGroup" class="find__icon" :src="find" alt="find" />
      </div>

      <div class="partner__list">
        <DeliveryFriendUnit
          v-for="(item, index) in dataMemberFriend"
          :key="index"
          :item="item"
          :content="content"
          :isDelivery="isDelivery"
          @selectMember="
            (id: any) => {
              selectMember(id, dataMemberFriend)
            }
          "
        ></DeliveryFriendUnit>
      </div>
    </div>
  </div>
  <div class="DeliveryFriends__btns mt30px">
    <div @click="closeDialog" class="btn__cancel">취소</div>
    <div @click="isDelivery = true" class="btn__ok">보내기</div>
    <!--<div @click="userJoin(dataMemberFriend)" class="Invite mt10px">보내기</div>
-->
  </div>
</template>
