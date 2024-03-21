<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import plusblue from '@/assets/svg/plusblue.svg'
import send from '@/assets/svg/send.svg'
import { storeToRefs } from 'pinia'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { useAuthStore } from '@/stores/auth'
//@ts-ignore
import { over } from 'stompjs'
//@ts-ignore
import SockJS from 'sockjs-client/dist/sockjs'
import moment from 'moment'
import { AVA, DATE_DOT, IS_FILE, SOCKET_DOMAIN } from '@/common/constance'
import router from '@/router'
import { getDurationBetweenseconds, getFileName } from '@/common/commonFunction'

const props = defineProps(['item'])
const emit = defineEmits(['callList'])

const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

const groupChatId = props.item?.id

let stompClient: any = null
const isLoading = ref<any>(false)
const userData = ref<any>({
  username: profile.value.username,
  receivername: '',
  connected: false,
  message: ''
})

// const registerUser = () => {
//   connect()
// }
const connect = () => {
  let Sock = new SockJS(SOCKET_DOMAIN)
  stompClient = over(Sock)
  stompClient.connect({}, onConnected, onError)
}

const onConnected = () => {
  userData.value = { ...userData, connected: true }
  stompClient.subscribe('/topic/public/' + groupChatId, onMessageReceived)
  // stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage)
}
const onMessageReceived = (payload: any) => {
  let payloadData = JSON.parse(payload?.body)
  console.log('payloadData ::: ', payloadData)
  emit('callList')
  switch (payloadData.status) {
    case 'JOIN':
      console.log('JOIN')
      // if(!privateChats.get(payloadData.senderName)){
      //     privateChats.set(payloadData.senderName,[]);
      //     setPrivateChats(new Map(privateChats));
      // }
      break
    case 'MESSAGE':
      console.log('MESSAGE')
      // publicChats.push(payloadData);
      // setPublicChats([...publicChats]);
      break
  }
}

const onError = (err: any) => {
  console.log(err)
}

watchEffect(() => {
  connect()
})
</script>

<template>
  <div
    class="RoomChat__mid__item mb20px cursor__pointer"
    @click="router.push({ path: '/room-chat-detail', query: { id: item?.id, name: item?.name } })"
  >
    <img
      v-if="item?.images?.length === 1"
      class="RoomChat__img"
      :src="item?.images[0] ?? AVA"
      alt="images"
    />
    <div class="RoomChat__group" v-if="item?.images?.length > 1">
      <img
        class="RoomChat__item"
        v-for="(img, index) in item?.images.filter((item: any, index: number) => index < 4)"
        :key="index"
        :src="img ?? AVA"
        alt="images"
      />
    </div>
    <div class="RoomChat__text">
      <div class="text__a">
        <div class="name__date">
          <div class="name">{{ item?.name }}</div>
          <div class="date">{{ moment(item?.date).format(DATE_DOT) }}</div>
        </div>
        <div class="time">{{ moment(item?.date).format('HH:mm') }}</div>
      </div>
      <div
        :class="
          getDurationBetweenseconds(item?.date, item?.lastTimeRead ?? 0) > 0
            ? 'text__b__read'
            : 'text__b__unread'
        "
      >
        {{ getFileName(item?.desc, IS_FILE) }}
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
