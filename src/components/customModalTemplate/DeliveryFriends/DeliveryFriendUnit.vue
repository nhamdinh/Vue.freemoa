<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { RepositoryFactory } from '@/repository/RepositoryFactory'

//@ts-ignore
import { over } from 'stompjs'
//@ts-ignore
import SockJS from 'sockjs-client/dist/sockjs'
import { SOCKET_DOMAIN } from '@/common/constance'

const props = defineProps(['item', 'content', 'isDelivery'])
const emits = defineEmits(['selectMember'])
watch(props, async (newV, oldV) => {
  if (props.isDelivery === true && props.item?.choose) {
    // console.log(props.item)
    // console.log(props.isDelivery)
    onDeliveryContent(props.item)
    // connect()
  }
})
const groupChatId = ref<any>('')

watch(groupChatId, async (newV, oldV) => {
  if (props.isDelivery === true && props.item?.choose && groupChatId.value) {
    console.log(':xcxzx')
    console.log(props.item)
    connect()
  }
})

const ChatRoomRepo = RepositoryFactory.get('chatRoom')

const onDeliveryContent = async (item: any) => {
  if (item?.choose) {
    await ChatRoomRepo.deliveryContent({
      userChatId: item?.id
      // fullName: 'minh'
    })
      .then(async (res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          console.log(data?.data)

          if (data?.data) {
            groupChatId.value = data?.data
            //   isDelivery.value = true
            // await sendMessage(data?.data, props.prStData?.content)
          } else {
            onAddNewGroupChat()
          }
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}

const onAddNewGroupChat = async () => {
  await ChatRoomRepo.createNewGroupChat({
    groupChatName: `${profile.value.username}, ${props.item?.username}`
    // fullName: 'minh'
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        groupChatId.value = data?.data
        connect()
        // let dataMemberFriend_temp: any = []
        // data?.data?.map((da: any) => {
        //   if (da?.id !== profile.value.id) dataMemberFriend_temp.push({ choose: false, ...da })
        // })
        // dataMemberFriend.value = [...dataMemberFriend_temp]

        // scrollToTop()
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}

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
  stompClient.subscribe('/topic/public/' + groupChatId.value, sendMessage())
  // stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage)
  userJoin([
    {
      username: profile.value.username,
      id: profile.value.id,
      choose: true
    },
    {
      username: props.item?.username,
      id: props.item?.id,
      choose: true
    }
  ])
}

const userJoin = async (arr: any) => {
  arr.map((item: any) => {
    if (item.choose) {
      let userJoin = {
        sender: item.username,
        type: 'JOIN',
        groupChatId: groupChatId.value,
        userChatId: item.id
      }
      console.log(userJoin)
      // stompClient.send('/app/message', {}, JSON.stringify(chatMessage))

      stompClient.send('/app/chat.addUser', {}, JSON.stringify(userJoin))
    }
  })
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
      groupChatId: groupChatId.value,
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
  <div @click="emits('selectMember', item?.id)" class="partner__item mt10px cursor__pointer">
    <img
      :class="item?.choose ? 'partner__avatar partner__avatar__act' : 'partner__avatar'"
      :src="item?.avatar"
      alt="avatar"
    />
    <div :class="item?.choose ? 'partner__name partner__name__act' : 'partner__name'">
      {{ item?.fullName }}
    </div>
  </div>
</template>
