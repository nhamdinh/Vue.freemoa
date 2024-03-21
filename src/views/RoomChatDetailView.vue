<script setup lang="ts">
import left from './../assets/svg/left.svg'
import iconx from './../assets/svg/icon-x.svg'
import tune_black_24dp from './../assets/svg/tune_black_24dp.svg'
import { useCustomDialogStore } from '@/stores/customDialog'
import { ref, watch, watchEffect } from 'vue'
import plusblue from '@/assets/svg/plusblue.svg'
import uparr from '@/assets/svg/uparr.svg'
import send from '@/assets/svg/send.svg'
import { storeToRefs } from 'pinia'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { useAuthStore } from '@/stores/auth'
//@ts-ignore
import { over } from 'stompjs'
//@ts-ignore
import SockJS from 'sockjs-client/dist/sockjs'
import moment from 'moment'
import {
  AM_PM,
  AVA,
  IS_FILE,
  IS_IMG,
  PAGESIZE_10,
  SOCKET_DOMAIN,
  SUCCESS,
  sizeMax
} from '@/common/constance'
import router from '@/router'
import kinhlup from '@/assets/img/kinhlup.png'
import setting from '@/assets/img/setting.png'
import clickvang from '@/assets/img/clickvang.png'
import getout from '@/assets/img/getout.png'
import right18 from './../assets/svg/right18.svg'
import find from './../assets/svg/find.svg'
import plus14 from './../assets/svg/plus14.svg'
import Loading from '@/components/Loading.vue'
import archiveP from '@/assets/svg/archiveP.svg'
import imageP from '@/assets/svg/imageP.svg'
import circleP from '@/assets/svg/play-circleP.svg'
import Advertising from '@/components/Advertising/Advertising.vue'
import uparrow from '@/assets/svg/uparrow.svg'
import { useCompanyStore } from '@/stores/company'

const storeCompany = useCompanyStore()
const { stIsFilter } = storeToRefs(storeCompany)
const { setIsFilter } = storeCompany

const FILE = '</p>'

const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

const { setProfile } = storeAuth

const AuthRepo = RepositoryFactory.get('auth')

const onGetProfile = async () => {
  await AuthRepo.getProfile()
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        setProfile({ stProfile: data?.data })
        connect()
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const groupChatId = urlParams.get('id')
const name = urlParams.get('name')
const supporterUsername = urlParams.get('supporterUsername')
const supporterId = urlParams.get('supporterId')

const someElementBot = ref<any>()
const someElementTop = ref<any>()
const messageChat = ref<any>('')
const memberSearch = ref<any>([])
const memberInGroup = ref<any>([])
const dataPost = ref<any>([])
const dataPostOrigin = ref<any>([])

const scrollToTop = () => {
  if (someElementTop.value) someElementTop.value.scrollIntoView({ behavior: 'smooth' })
}
const scrollToBot = () => {
  if (someElementBot.value) someElementBot.value.scrollIntoView({ behavior: 'smooth' })
}
const reloadStory = () => {
  onGetStoryByGroup()
  // scrollToBot()
}
let stompClient: any = null
const isLoadingSearch = ref<any>(false)
const isLoading = ref<any>(false)
const isLoadingInGroup = ref<any>(false)
const showUploadList = ref<any>(false)
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
  stompClient.subscribe('/topic/public/' + groupChatId, onMessageReceived)
  // stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage)
  if (supporterUsername) {
    userJoin(
      [
        {
          username: profile.value.username,
          id: profile.value.id,
          choose: true
        },
        {
          username: supporterUsername,
          id: supporterId,
          choose: true
        }
      ],
      0
    )
  } else {
    userJoin(
      [
        {
          username: profile.value.username,
          id: profile.value.id,
          choose: true
        }
      ],
      0
    )
  }
}

const userJoin = (arr: any, type = 0) => {
  arr.map((item: any) => {
    if (item?.choose) {
      let userJoin = {
        sender: item?.username,
        type: 'JOIN',
        groupChatId: groupChatId,
        userChatId: item?.id
      }
      // console.log(userJoin)
      // stompClient.send('/app/message', {}, JSON.stringify(chatMessage))

      stompClient.send('/app/chat.addUser', {}, JSON.stringify(userJoin))
    }
  })
  if (type) {
    openDialogProp(SUCCESS)
    onGetMemberOnGroup()
    reset()
    setIsFilter({ stIsFilter: false })
    reloadStory()
  }
}

const sendMessage = (event: any) => {
  let messageContent = messageChat.value.trim()
  if (messageContent && stompClient) {
    let chatMessage = {
      sender: profile.value.username,
      content: messageContent,
      groupChatId: groupChatId,
      userChatId: profile.value.id,
      type: 'CHAT'
      // type: 'ATTACH'
    }
    stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage))
    messageChat.value = ''
  }
  event.preventDefault()
}

const sendMessageImg = (event: any) => {
  let messageContent = avatar1.value.trim()
  if (messageContent && stompClient) {
    let chatMessage = {
      sender: profile.value.username,
      content: messageContent,
      groupChatId: groupChatId,
      userChatId: profile.value.id,
      // type: 'CHAT'
      type: 'ATTACH'
    }
    stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage))
    avatar1.value = ''
  }
  event.preventDefault()
}
const showToBot = ref<any>(false)
const onMessageReceived = (payload: any) => {
  let payloadData = JSON.parse(payload?.body)

  let lengthPayload = payloadData?.length
  if (lengthPayload === 1) {
    dataPost.value = [...payloadData.concat(dataPost.value)]
    if (payloadData[0]?.userId !== profile.value.id) {
      showToBot.value = true
    } else {
      scrollToBot()
    }
  }

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

function onDisConnect() {
  // Tell your username to the server
  stompClient.send(
    '/app/chat.removeUser',
    {},
    JSON.stringify({
      sender: profile.value.username,
      type: 'LEAVE',
      groupChatId: groupChatId,
      userChatId: profile.value.id
    })
  )

  stompClient.disconnect()
  setIsFilter({ stIsFilter: false })
  // openDialogProp(SUCCESS)
  router.push({ path: `/room-chat-list` })
}

const onPrivateMessage = (payload: any) => {
  // console.log(payload)
  let payloadData = JSON.parse(payload?.body)
  // console.log(payloadData)
  // if (privateChats.get(payloadData.senderName)) {
  //   privateChats.get(payloadData.senderName).push(payloadData)
  //   setPrivateChats(new Map(privateChats))
  // } else {
  //   let list = []
  //   list.push(payloadData)
  //   privateChats.set(payloadData.senderName, list)
  //   setPrivateChats(new Map(privateChats))
  // }
}

const onError = (err: any) => {
  console.log(err)
}

const ChatRoomRepo = RepositoryFactory.get('chatRoom')

const onSearchFromPaging = async (number: any) => {
  isLoading.value = true

  {
    await ChatRoomRepo.searchFrom({
      number: Number(number)
    })
      .then((res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          console.log(data?.data)
          dataPost.value = [...data?.data]
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
  isLoading.value = false
}

const onSearchFrom = async (number: any, step: any) => {
  isLoading.value = true
  let num = number
  num = num + Number(step)

  let numberSearch = Number(dataSearch.value[num]?.id)
  if (num >= 0 && num < dataSearch.value.length) {
    numIndex.value = num

    await ChatRoomRepo.searchFrom({
      number: numberSearch
    })
      .then((res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          console.log(data?.data)
          dataPost.value = [...data?.data]
          // let length = data?.data?.length
          // indexTop.value = data?.data[length - 1]?.id
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
  isLoading.value = false
}
const isLoadingFrom = ref<any>(false)
const isLoadingUpload = ref<any>(false)
const onSearchFromPa = async (number: any, reload: boolean) => {
  isLoadingFrom.value = true

  await ChatRoomRepo.searchFrom({
    number: number
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        // let length = data?.data?.length
        // indexTop.value = data?.data[length - 1]?.id
        // indexBot.value = data?.data[0]?.id

        let arr: any = [...data?.data]
        let length = dataPost.value?.length
        if (!reload) {
          if (length > 0) {
            dataPost.value = [
              ...dataPost.value.concat(
                arr.filter((item: any) => item.id !== dataPost.value[length - 1]?.id)
              )
            ]
          } else {
            dataPost.value = [...dataPost.value.concat(arr)]
          }
        } else {
          dataPost.value = [...arr]
        }
        scrollToBot()

        // window.scrollTo(200, 200)

        /*         countdown = setTimeout(function () {
          scrollToBot()
        }, 400)

        return () => {
          clearTimeout(countdown)
        } */
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  isLoadingFrom.value = false
}
const isLoadingTo = ref<any>(false)
const onSearchToPa = async (number: any) => {
  isLoadingTo.value = true

  await ChatRoomRepo.searchTo({
    number: number
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        // let length = data?.data?.length
        // indexTop.value = data?.data[length - 1]?.id
        // indexBot.value = data?.data[0]?.id
        let arr: any = [...data?.data].reverse()
        let length = dataPost.value?.length
        if (length > 0) {
          arr.filter((item: any) => item.id !== dataPost.value[0]?.id)
          dataPost.value = [
            ...arr.filter((item: any) => item.id !== dataPost.value[0]?.id).concat(dataPost.value)
          ]
        } else {
          dataPost.value = [...arr.concat(dataPost.value)]
        }
        // window.scrollTo(200, 200)

        // countdown = setTimeout(function () {
        //   scrollToBot()
        // }, 400)

        // return () => {
        //   clearTimeout(countdown)
        // }

        // scrollToTop()
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  isLoadingTo.value = false
}

const dataSearch = ref<any>([])
const onSearch = async () => {
  if (searchVal.value) {
    isLoading.value = true
    await ChatRoomRepo.search({
      value: searchVal.value,
      groupChatId: groupChatId
    })
      .then((res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          dataSearch.value = data?.data
          // console.log(dataSearch)
          if (data?.data?.length > 0) {
            onSearchFrom(0, 0)
          } else {
            dataPost.value = dataPostOrigin.value
            dataSearch.value = []
          }
        }
      })
      .catch((err: any) => {
        console.log(err)
      })

    isLoading.value = false
  } else {
    reloadStory()
  }
}

const onGetStoryByGroup = async () => {
  await ChatRoomRepo.getStoryByGroup({
    groupChatId,
    pageSize: PAGESIZE_10,
    pageNum: 1
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        let length = data?.data?.length
        // indexTop.value = data?.data[length - 1]?.id
        // indexBot.value = data?.data[0]?.id
        onSearchFromPa(data?.data[0]?.id, true)
        // onSearchToPa(data?.data[0]?.id, true)
        if (showToBot.value) {
          // dataPost.value = [...data?.data]
          showToBot.value = false

          // scrollToBot()
        } else {
          // dataPost.value = [...dataPost.value.concat(data?.data)]
        }

        // scrollToTop()
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}
const indexTop = ref<any>(1)
const indexBot = ref<any>(1)

const scrolling = async (e: any) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  // console.log(scrollHeight)
  // console.log(clientHeight)
  if (scrollTop + clientHeight >= scrollHeight - 2) {
    console.log('bot')

    if (dataPost.value[0]?.id !== indexBot.value) {
      onSearchToPa(dataPost.value[0]?.id)
      indexBot.value = dataPost.value[0]?.id
      // window.scrollTo(200, 200)
    }
  } else if (scrollTop === 0) {
    // params.value = {
    //   ...params.value,
    //   pageNum: currentPa.value + 1
    // }
    // currentPa.value = currentPa.value + 1
    console.log('top')
    if (dataPost.value[dataPost.value?.length - 1]?.id !== indexTop.value) {
      onSearchFromPa(dataPost.value[dataPost.value?.length - 1]?.id, false)
      indexTop.value = dataPost.value[dataPost.value?.length - 1]?.id
    }
  }
}

const onGetMemberOnGroup = async () => {
  isLoadingInGroup.value = true
  await ChatRoomRepo.getMemberByGroup({
    groupChatId
  })
    .then((res: any) => {
      const data = res?.data
      if (data) {
        let dataMemberGroup_temp: any = []
        data?.map((da: any) => {
          if (da?.id !== profile.value.id) dataMemberGroup_temp.push(da)
        })
        memberInGroup.value = [...dataMemberGroup_temp]
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoadingInGroup.value = false
}

const onSearchMemberToGroup = async () => {
  isLoadingSearch.value = true
  await ChatRoomRepo.searchMemberToGroup({
    fullName: usernameSearch.value,
    type: 1 // 1 = all, 2= chi trong cty
    // fullName: 'minh'
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        let dataMemberFriend_temp: any = []
        data?.data?.map((da: any) => {
          if (da?.id !== profile.value.id) dataMemberFriend_temp.push({ choose: false, ...da })
        })
        // let uniqueChars: any = []
        // dataMemberFriend_temp.forEach((c: any) => {
        //   memberInGroup.value.map((item: any) => {
        //     if (c?.id !== item?.id) uniqueChars.push(c)
        //   })
        // })
        const filteredArray = dataMemberFriend_temp.filter((item1: any) => {
          return !memberInGroup.value.some((item2: any) => item2.id === item1.id)
        })
        // console.log(memberInGroup.value)
        // console.log(filteredArray)
        memberSearch.value = [...filteredArray]
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoadingSearch.value = false
}

const openDialogProp = (text: any) => {
  openDialog({
    stType: 'info',
    stTitle: text,
    stCancelText: 'THOII',
    stOkText: '확인',
    stClosable: false,
    actionConfirm: () => {},
    actionCancel: () => {},
    actionAfterClose: () => {}
  })
}

const onPinMessage = async (item: any) => {
  await ChatRoomRepo.pinMessage({
    groupChatId: Number(groupChatId),
    roomChatId: item?.id
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        onGetMessagePinned()

        let open = setTimeout(function () {
          openDialogProp('공지사항으로 등록되었습니다.')
        }, 300)
        return () => {
          clearTimeout(open)
        }

        // console.log(data)
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}
const messPinned = ref<any>({})
const onGetMessagePinned = async () => {
  isLoading.value = true
  await ChatRoomRepo.getMessagePinned({
    groupChatId
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK' && data?.data) {
        messPinned.value = data?.data
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoading.value = false
}

const formatDate = (value: any) => {
  let va = value.slice(0, 5)
  if (value.slice(6, 8).includes('AM')) {
    va = '오전 ' + va
  } else {
    va = '오후 ' + va
  }
  return va
}
const searchVal = ref<any>('')

const tab = ref<any>(false)
const numIndex = ref<any>(0)

const hightlight = (text: any) => {
  let start = text.toUpperCase().indexOf(searchVal.value.toUpperCase())
  if (searchVal.value && start >= 0) {
    let result =
      text.substring(0, start) +
      `<span class="hightlight">${text.substring(start, start + searchVal.value.length)}</span>` +
      text.substring(start + searchVal.value.length, text.length)
    return result
  } else {
    return text
  }
}

let countdown: any = null
watch(searchVal, async (newQuestion, oldQuestion) => {
  clearTimeout(countdown)
  if (searchVal.value) {
    countdown = setTimeout(() => {
      onSearch()
    }, 500)
  }
  return () => {
    clearTimeout(countdown)
  }
})
const email = ref<any>(null)
watch(tab, async (newQuestion, oldQuestion) => {
  if (!tab.value) {
    searchVal.value = ''
    dataSearch.value = []
  } else {
  }
})

const isInvite = ref<any>(false)

const usernameSearch = ref<any>('')

const reset = () => {
  isInvite.value = !isInvite.value
  memberSearch.value = []
  usernameSearch.value = ''
}

const selectMember = (id: any, dataFriend: any) => {
  let dataMemberFriend_emp: any = []
  dataFriend.map((mem: any) => {
    if (mem?.id === id) {
      dataMemberFriend_emp.push({ ...mem, choose: !mem.choose })
    } else {
      dataMemberFriend_emp.push(mem)
    }
  })
  memberSearch.value = [...dataMemberFriend_emp]
}

const avatar1 = ref<any>('')

const store = useCustomDialogStore()
const { openDialog } = store
const openPopup = (mess: any) => {
  // console.log(mess)
  openDialog({
    stType: 'DeliveryMenu',
    stTitle: '인증번호를 발송하였습니다.',
    stCancelText: 'THOII',
    stOkText: '확인',
    stData: { ...mess, day: Date.now() },
    stClosable: false,
    actionConfirm: () => {
      if (messPinned.value?.content) {
        let open = setTimeout(function () {
          openPopupConfirm('confirm', mess)
        }, 300)
        return () => {
          clearTimeout(open)
        }
      } else {
        if (!mess?.content.includes(FILE)) onPinMessage(mess)
      }
    },
    actionCancel: () => {
      // console.log("aaaaaaaaaaaaa")
    },
    actionAfterClose: () => {
      // console.log('xxxxxxxxx')
    }
  })
}
const openPopupViewImage = (mess: any) => {
  if (mess?.content.includes(IS_IMG))
    openDialog({
      stType: 'ViewImage',
      stTitle: '인증번호를 발송하였습니다.',
      stCancelText: 'THOII',
      stOkText: '확인',
      stData: { ...mess, day: Date.now() },
      stClosable: false,
      actionConfirm: () => {},
      actionCancel: () => {
        // console.log("aaaaaaaaaaaaa")
      },
      actionAfterClose: () => {
        // console.log('xxxxxxxxx')
      }
    })
}

const openPopupConfirm = (stType: any, mess: any) => {
  openDialog({
    stType: stType,
    stTitle: '기존 공지를 제거하고 \n신규 공지로 등록 하시겠습니까?',
    stCancelText: '취소',
    stOkText: '확인',
    stClosable: false,
    actionConfirm: () => {
      if (!mess?.content.includes(FILE)) onPinMessage(mess)
      //   console.log(props?.item?.id)
    },
    actionCancel: () => {},
    actionAfterClose: () => {}
  })
}

const onUploadFile = async (e: any) => {
  isLoadingUpload.value = true

  const image = e.target.files[0]
  const type = image ? image.type.split('/')[1] : ''
  let sizeImg = image ? Number(image?.size) : sizeMax + 1

  if (sizeImg <= sizeMax) {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    formData.append('type', '2')
    formData.append('typeId', groupChatId ? groupChatId : '')
    // console.log(formData)
    let status = 'NO'

    await AuthRepo.uploadFile(formData)
      .then((res: any) => {
        const data = res?.data
        // ${image.name}
        if (data?.status === 'OK') {
          // console.log(data?.data)
          avatar1.value = `<p ${IS_FILE + image.name}">${
            image.name
          }<img ${IS_IMG} src="${data?.data.trim()}" alt="avatar" width="236px" height="auto" /></p>`
          status = 'OK'
        }
      })
      .catch((err: any) => {
        console.log(err)
      })

    if (status === 'OK') {
      showUploadList.value = false

      sendMessageImg(e)
    }
  }
  isLoadingUpload.value = false
}

const onUploadPdf = async (e: any) => {
  isLoadingUpload.value = true
  const image = e.target.files[0]
  const type = image ? image.type.split('/')[1] : ''
  let sizeImg = image ? Number(image?.size) : sizeMax + 1
  if (sizeImg <= sizeMax) {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    formData.append('type', '2')
    formData.append('typeId', groupChatId ? groupChatId : '')
    // console.log(formData)
    let status = 'NO'

    await AuthRepo.uploadFile(formData)
      .then((res: any) => {
        const data = res?.data

        if (data?.status === 'OK') {
          // console.log(data?.data)
          avatar1.value = `<p ${
            IS_FILE + image.name
          }"><a target="_blank" href="${data?.data.trim()}" >${image.name}</a></p>`
          status = 'OK'
        }
      })
      .catch((err: any) => {
        console.log(err)
      })

    if (status === 'OK') {
      showUploadList.value = false
      sendMessageImg(e)
    }
  }
  isLoadingUpload.value = false
}

const onUploadVideo = async (e: any) => {
  isLoadingUpload.value = true

  const image = e.target.files[0]
  const type = image ? image.type.split('/')[1] : ''
  let sizeImg = image ? Number(image?.size) : sizeMax * 5 + 1
  // console.log(image)
  if (sizeImg <= sizeMax * 5) {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    formData.append('type', '2')
    formData.append('typeId', groupChatId ? groupChatId : '')
    // console.log(formData)
    let status = 'NO'

    await AuthRepo.uploadFile(formData)
      .then((res: any) => {
        const data = res?.data

        if (data?.status === 'OK') {
          // console.log(data?.data)
          avatar1.value = `<p ${
            IS_FILE + image.name
          }"><video width="236px" height="auto" controls name="media"><source src="${data?.data.trim()}" type="video/mp4"></video></p>`

          status = 'OK'
        }
      })
      .catch((err: any) => {
        console.log(err)
      })

    if (status === 'OK') {
      showUploadList.value = false

      sendMessageImg(e)
    }
  }
  isLoadingUpload.value = false
}

watchEffect(() => {
  onGetMemberOnGroup()
})
watchEffect(() => {
  onGetProfile()
})
watchEffect(() => {
  onGetMessagePinned()
})
watchEffect(() => {
  onGetStoryByGroup()
})
</script>

<template>
  <div className="none">
    <form id="form" encType="multipart/form-data">
      <input
        accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
        id="icon-button-pdf"
        type="file"
        @change="onUploadPdf"
      />
    </form>
  </div>
  <div className="none">
    <form id="form" encType="multipart/form-data">
      <input
        accept="video/mp4,video/x-m4v,video/*"
        id="icon-button-video"
        type="file"
        @change="onUploadVideo"
      />
    </form>
  </div>
  <div className="none">
    <form id="form" encType="multipart/form-data">
      <input
        accept="image/png, image/gif, image/jpeg"
        id="icon-button-file"
        type="file"
        @change="onUploadFile"
      />
    </form>
  </div>

  <div class="RoomChatDetailView">
    <div v-if="stIsFilter" class="filter__popup">
      <div class="filter__popup__RoomChatDetailView">
        <div class="partner__conversation">
          <div class="filter__title">대화 상대</div>
          <div class="partner__conversation__invite mt10px">
            <div class="plus14" @click="reset">
              <img :src="plus14" alt="plus14" />
            </div>
            <div class="label__invite">대화 상대 초대</div>
          </div>
          <div class="partner__list mt10px">
            <Loading v-if="isLoadingInGroup" />
            <div class="partner__item" v-for="(item, index) in memberInGroup" :key="index">
              <img class="partner__avatar" :src="item?.avatar" alt="avatar" />
              <div class="partner__name">
                {{ item?.fullName }}
              </div>
            </div>
          </div>
        </div>

        <div class="space10"></div>

        <div class="invite__someone__bot">
          <div class="invite__someone" v-if="isInvite">
            <div class="filter__title">대화 상대 초대</div>
            <div class="find__relative mb20px">
              <el-input
                class="mt10px w244px"
                v-model="usernameSearch"
                @keyup.enter="onSearchMemberToGroup"
              />
              <img @click="onSearchMemberToGroup" class="find__icon" :src="find" alt="find" />
            </div>
            <div class="partner__list">
              <Loading v-if="isLoadingSearch" />
              <div
                class="partner__item cursor__pointer"
                v-for="(item, index) in memberSearch"
                :key="index"
                @click="selectMember(item?.id, memberSearch)"
              >
                <img
                  :class="item?.choose ? 'partner__avatar partner__avatar__act' : 'partner__avatar'"
                  :src="item?.avatar"
                  alt="avatar"
                />
                <div :class="item?.choose ? 'partner__name partner__name__act' : 'partner__name'">
                  {{ item?.fullName }}
                </div>
              </div>
            </div>

            <div
              v-if="memberSearch?.length > 0"
              @click="userJoin(memberSearch, 1)"
              class="Invite mt10px"
            >
              초대하기
            </div>
          </div>

          <div class="getout">
            <img class="getout__icon" :src="getout" alt="getout" />
            <div class="getout__title" @click="onDisConnect">채팅방 나가기</div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="stIsFilter"
      @click="
        () => {
          setIsFilter({ stIsFilter: false })
          reset()
        }
      "
      class="hidden__btn"
    >
      <img :src="right18" alt="right18" />
    </div>

    <div class="Header__main">
      <img
        class="cursor__pointer iconx__iconx"
        :src="0 ? iconx : left"
        width="24"
        alt="iconx"
        @click="
          () => {
            setIsFilter({ stIsFilter: false })
            router.push({ path: `/room-chat-list` })
          }
        "
      />
      <div class="search" v-if="tab">
        <el-input
          oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
          maxlength="31"
          v-on:keypress=""
          v-model="searchVal"
          placeholder="대화 내용 검색"
          class="w160px"
          autofocus="true"
          ref="email"
        />
        <span
          ><img @click="onSearchFrom(numIndex, 1)" class="cursor__pointer" :src="uparr" alt="uparr"
        /></span>
        <span v-if="dataSearch.length !== 0">
          {{ dataSearch.length - numIndex + '/' + dataSearch.length }}
        </span>
        <span v-else>
          {{ 0 + '/' + 0 }}
        </span>

        <span
          ><img
            @click="onSearchFrom(numIndex, -1)"
            class="dowarr cursor__pointer"
            :src="uparr"
            alt="dowarr"
        /></span>
      </div>
      <div class="login" v-else>
        {{ `${name} 님 채팅방` }}
      </div>
      <div class="iconx__right__search">
        <img @click="tab = !tab" class="cursor__pointer kinhlup" :src="kinhlup" alt="iconx" />
        <img
          @click="setIsFilter({ stIsFilter: true })"
          class="cursor__pointer setting"
          :src="setting"
          alt="iconx"
        />
      </div>
    </div>
    <div class="uptotop" style="transform: rotate(180deg)" @click="reloadStory" v-if="showToBot">
      <img :src="uparrow" alt="uparrow" />
    </div>
    <div
      @click="
        () => {
          onSearchFromPaging(messPinned?.id)
        }
      "
      class="intro cursor__pointer"
      v-if="messPinned?.content"
    >
      <div class="intro__a">
        <div class="notice">{{ messPinned?.content }}</div>
        <div class="notice__value">채팅방 이용시 비속어를 사용하지 않는 깨끗한</div>
      </div>
      <div class="content">
        채팅방을 유지해주세요. 장기적인 사용을 위해서 필요한 규칙들 을 읽어주시기 바랍니다.
      </div>
    </div>
    <div class="intro" v-else>
      <div class="intro__a">
        <div class="notice">공지사항</div>
        <div class="notice__value">채팅방 이용시 비속어를 사용하지 않는 깨끗한</div>
      </div>
      <div class="content">
        채팅방을 유지해주세요. 장기적인 사용을 위해서 필요한 규칙들 을 읽어주시기 바랍니다.
      </div>
    </div>
    <div class="RoomChatDetailView__content">
      <!-- main content -->
      <div @click="showUploadList = false" class="story mb10px" @scroll="scrolling">
        <div class="mt10px mb10px" ref="someElementTop"></div>
        <Loading v-if="isLoadingFrom" />

        <div
          class="story__item mt20px"
          v-for="(item, index) in [...dataPost].reverse()"
          :key="index"
          @click.right.prevent="
            () => {
              if (item?.type === 'CHAT') {
                openPopup(item)
                // onPinMessage(item)
              }
            }
          "
          @click="
            () => {
              openPopupViewImage(item)
            }
          "
        >
          <div class="story__from" v-if="item?.userId !== profile?.id && item?.type === 'CHAT'">
            <div class="story__from__name">{{ item?.createdBy }}</div>
            <div class="story__from__content">
              <img class="from__img" :src="item?.avatar ?? AVA" alt="story__from" />

              <div
                :class="
                  item?.content.includes(FILE) ? 'from__content__trang' : 'from__content__xanh'
                "
              >
                <div class="pre-wrap" v-html="hightlight(item?.content)"></div>
                <!--                 <div v-html="item?.id"></div>
 -->
              </div>
              <div class="from__date">
                {{ formatDate(moment(item?.createdDate).format(AM_PM)) }}
              </div>
            </div>
            <div
              class="from__slogan mt6px"
              v-for="(member, index) in memberInGroup.filter(
                (mem: any) => mem?.id.toString() === item?.userId.toString()
              )"
              :key="index"
            >
              <div class="slogan__a">혁신</div>
              <div class="slogan__b">을 연주하다.</div>

              <div class="slogan__c">
                <Advertising :member="member"></Advertising>
                <img class="slogan__d" :src="clickvang" alt="clickvang" />
              </div>
            </div>
          </div>
          <div
            class="story__from"
            v-if="item?.userId !== profile?.id && (item?.type === 'JOIN' || item?.type === 'LEAVE')"
          >
            <div class="story__from__JOIN">
              <div class="JOIN__content">
                {{ item?.content }}
              </div>
              <div class="JOIN__date">
                {{ formatDate(moment(item?.createdDate).format(AM_PM)) }}
              </div>
            </div>
          </div>
          <div class="story__to" v-if="item?.userId === profile?.id && item?.type === 'CHAT'">
            <div class="to__date">{{ formatDate(moment(item?.createdDate).format(AM_PM)) }}</div>

            <div :class="item?.content.includes(FILE) ? 'to__content__trang' : 'to__content__xanh'">
              <div class="pre-wrap" v-html="hightlight(item?.content)"></div>
              <!--               <div v-html="item?.id"></div>
 -->
            </div>
          </div>
        </div>
        <Loading v-if="isLoadingUpload" />
        <Loading v-if="isLoadingTo" />

        <div class="mb60px" ref="someElementBot"></div>
      </div>
      <!-- main content -->

      <div class="send__mess">
        <div v-if="showUploadList" tabindex="0" @blur="showUploadList = false" class="btn__list">
          <label class="btn__item" htmlFor="icon-button-file">
            <img :src="imageP" alt="pluswhite" />
            <div>이미지</div>
          </label>
          <label class="btn__item" htmlFor="icon-button-video">
            <img :src="circleP" alt="pluswhite" />
            <div>동영상</div>
          </label>
          <label class="btn__item" htmlFor="icon-button-pdf">
            <img :src="archiveP" alt="pluswhite" />
            <div>파일</div>
          </label>
        </div>
        <label class="cursor__pointer">
          <img
            @blur="showUploadList = false"
            @click="showUploadList = !showUploadList"
            :src="plusblue"
            alt="plusblue"
          />
        </label>

        <input
          @keyup.enter="sendMessage"
          v-model="messageChat"
          class="input__mess"
          type="text"
          placeholder="메시지 보내기"
          @click="showUploadList = false"
        />
        <!-- <img @click="sendMessage" :src="send" alt="" /> -->
        <img @click="sendMessage" :src="send" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.RoomChatDetailView {
  width: 100%;
  position: relative;
  .intro {
    width: 328px;
    height: 79px;
    margin: 0 auto;
    padding: 15px 17px 15px 15px;
    border-radius: 10px;
    background-color: #e2f1ff;
    .intro__a {
      display: flex;
      gap: 14px;

      .notice__value {
        font-family: SpoqaHanSansNeo;
        font-size: 11px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #51606d;
      }
    }
    .notice {
      font-family: SpoqaHanSansNeo;
      font-size: 11px;
      font-weight: 600;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #1867b3;

      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      max-width: 50px;
      width: 50px;
    }
    .content {
      font-family: SpoqaHanSansNeo;
      font-size: 11px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #51606d;
    }
  }
  .search {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-right: 6px;
    span {
      color: #000;
    }
    .el-input {
      .el-input__wrapper {
        box-shadow: none;
        border-radius: 10px;
        border: none;
        .el-input__inner {
          outline: none;
          border: none;
          height: 26px;
        }
      }
      .el-input__wrapper.is-focus {
        border: none;
      }
    }
  }
  .dowarr {
    transform: rotate(180deg);
  }
  .RoomChatDetailView__content {
    .story {
      margin: 0 auto;
      height: calc(100vh - 210px);
      overflow-x: hidden;
      padding: 0 16px;
      .story__from {
        display: flex;
        flex-direction: column;
        gap: 3px;
        .story__from__name {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: 600;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #242a37;
          margin-left: 52px;
        }
        .story__from__content {
          display: flex;
          gap: 5px;
          .from__img {
            width: 43px;
            height: 43px;
            min-width: 43px;
            min-height: 43px;
            border-radius: 50%;
            background-size: cover;
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-position: center center;
            object-fit: cover;
          }
          @mixin from__content {
            padding: 10px 14px;
            border-radius: 20px;

            font-family: SpoqaHanSansNeo;
            font-size: 12px;
            font-weight: normal;
            line-height: 16px;
            letter-spacing: -0.3px;
          }
          .pre-wrap {
            white-space: pre-wrap;
            overflow: hidden;
          }
          .from__content__xanh {
            width: 177px;
            min-width: 177px;
            @include from__content;
            background-color: #f1f2f6;
            color: #000;
          }
          .from__content__trang {
            width: 236px;
            min-width: 236px;
            @include from__content;
            background-color: #fff;
            color: #000;
          }
          .from__date {
            font-family: SpoqaHanSansNeo;
            font-size: 10px;
            font-weight: normal;
            line-height: 14px;
            letter-spacing: -0.25px;
            color: #9ba5b1;
            display: flex;
            align-items: flex-end;
          }
        }
        .from__slogan {
          display: flex;
          margin-left: 66px;
          @mixin slogan {
            font-family: SpoqaHanSansNeo;
            font-size: 12px;
            font-weight: bold;
            line-height: 16px;
            letter-spacing: -0.3px;
          }
          .slogan__a {
            @include slogan;
            color: #ff7a00;
          }
          .slogan__b {
            @include slogan;
            color: #242a37;
          }
          .slogan__c {
            @include slogan;
            color: #0069b9;
            position: relative;
            cursor: pointer;
            p {
              width: 100px;
              max-width: 100px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
          }
          .slogan__d {
            width: 15px;
            height: 15px;
            position: absolute;
            right: 0;
            top: 0;
          }
        }
      }
      .story__from__JOIN {
        display: flex;
        gap: 8px;
        justify-content: center;
        .JOIN__content {
          font-family: SpoqaHanSansNeo;
          font-size: 10px;
          font-weight: normal;
          line-height: 14px;
          letter-spacing: -0.25px;
          color: black;
        }
        .JOIN__date {
          font-family: SpoqaHanSansNeo;
          font-size: 8px;
          font-weight: normal;
          line-height: 14px;
          letter-spacing: -0.25px;
          color: #9ba5b1;
        }
      }

      .story__to {
        display: flex;
        justify-content: flex-end;
        gap: 5px;
        .to__date {
          font-family: SpoqaHanSansNeo;
          font-size: 10px;
          font-weight: normal;
          line-height: 14px;
          letter-spacing: -0.25px;
          color: #9ba5b1;
          display: flex;
          align-items: flex-end;
        }
        @mixin to__content {
          width: 236px;
          min-width: 236px;
          padding: 10px 14px;
          border-radius: 20px;

          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: normal;
          line-height: 16px;
          letter-spacing: -0.3px;
        }
        .to__content__xanh {
          @include to__content;

          background-color: #1767b3;

          color: #fff;
        }
        .to__content__trang {
          @include to__content;

          background-color: #fff;

          color: #1767b3;
        }
      }
    }

    .hightlight {
      background-color: #ffff00 !important;
      color: #242a37;
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: -0.3px;
    }

    .btn__list {
      position: absolute;
      left: 16px;
      bottom: 40px;
      width: 104px;
      height: 108px;
      border-radius: 4px;
      box-shadow: 0 0 10px 0 rgba(4, 67, 126, 0.16);
      background-color: #fff;

      display: flex;
      flex-direction: column;
      .btn__item {
        display: flex;
        gap: 4px;
        align-items: center;
        padding-left: 14px;
        height: 36px;
        cursor: pointer;
        div {
          font-family: SpoqaHanSansNeo;
          font-size: 13px;
          font-weight: normal;
          line-height: 16px;
          letter-spacing: -0.33px;
          color: #52606d;
        }
      }
    }
    .send__mess {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        cursor: pointer;
      }
      .input__mess {
        width: 262px;
        height: 43px;
        margin: 0 4px 0 14px;
        padding: 14px 15px 14px 15px;
        border-radius: 21.5px;
        background-color: #f1f2f6;
        border: none !important;
        outline: none !important;
      }
    }
    ::-webkit-scrollbar {
      width: 0.4em;
      height: 0.4em;
      position: absolute;
      right: 0;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: #c4c7ca;
    }

    ::-webkit-scrollbar-track {
      background: #f1f2f3;
    }
  }
}
</style>
