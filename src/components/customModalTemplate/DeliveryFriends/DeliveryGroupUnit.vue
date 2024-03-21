<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import router from '@/router'
import { ref, watch, watchEffect } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import find from '@/assets/svg/find.svg'
import Loading from '@/components/Loading.vue'
//@ts-ignore
import { over } from 'stompjs'
//@ts-ignore
import SockJS from 'sockjs-client/dist/sockjs'
import { DATE_DOT, SOCKET_DOMAIN } from '@/common/constance'

const props = defineProps(['item', 'content', 'isDelivery'])
const emits = defineEmits(['selectMember'])
watch(props, async (newV, oldV) => {
  if (props.isDelivery === true && props.item?.choose) {
    connect()
  }
})
const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})
let stompClient: any = null
const userData = ref<any>({
  username: profile.value.username,
  receivername: '',
  connected: false,
  message: ''
})

const connect = () => {
  let Sock = new SockJS(SOCKET_DOMAIN)
  stompClient = over(Sock)
  stompClient.connect({}, onConnected, onError)
}

const onConnected = () => {
  userData.value = { ...userData, connected: true }
  stompClient.subscribe('/topic/public/' + props.item?.id, sendMessage())
  // stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage)
}

const sendMessage = () => {
  //   let messageContent = question.value.trim()
  //   console.log(props.content)
  //   console.log(stompClient)
  if (props.content && stompClient) {
    // console.log(props.content)
    let chatMessage = {
      sender: profile.value.username,
      content: props.content,
      groupChatId: props.item?.id,
      userChatId: profile.value.id,
      type: 'CHAT'
      // type: 'ATTACH'
    }
    stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage))
    // question.value = ''
  }
}

const onError = (err: any) => {
  console.log(err)
}
</script>

<template>
  <div class="group__item" @click="emits('selectMember', item?.id)">
    <img
      v-if="item?.images?.length === 1"
      class="group__img__40"
      :src="item?.images[0]"
      alt="images"
    />
    <div class="group__imgs" v-if="item?.images?.length > 1">
      <img
        class="group__img__19"
        v-for="(img, index) in item?.images.filter((item: any, index: number) => index < 4)"
        :key="index"
        :src="img"
        alt="images"
      />
    </div>
    <div class="group__item____text">
      <div class="text__a">
        <div class="name" :class="item?.choose ? 'partner__name__act' : 'partner__name'">
          {{ item?.name }}
        </div>
      </div>
    </div>
  </div>
</template>
