<script setup lang="ts">
import left from './../assets/svg/left.svg'
import iconx from './../assets/svg/icon-x.svg'
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
import { FAIL, SAVE_SUCCESS, SOCKET_DOMAIN, SUCCESS } from '@/common/constance'
import router from '@/router'
import kinhlup from '@/assets/img/kinhlup.png'
import setting from '@/assets/img/setting.png'
import right18 from './../assets/svg/right18.svg'
import find from './../assets/svg/find.svg'
import plus14 from './../assets/svg/plus14.svg'
import Loading from '@/components/Loading.vue'
import { useCustomDialogStore } from '@/stores/customDialog'
import { useCompanyStore } from '@/stores/company'

const storeCompany = useCompanyStore()
const { setIsFilter } = storeCompany

const storeAuth = useAuthStore()
const { setProfile } = storeAuth
const { stProfile } = storeToRefs(storeAuth)

const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

const AuthRepo = RepositoryFactory.get('auth')
const ChatRoomRepo = RepositoryFactory.get('chatRoom')

const groupChatId = ref<any>('')
const groupChatName = ref<any>('')
const groupChatNameCreated = ref<any>('')
const usernameSearch = ref<any>('')
const memberSearch = ref<any>([])
const isLoadingSearch = ref<any>(false)
const isLoadingGroup = ref<any>(false)
const isLoading = ref<any>(false)

/* SockJS */
let stompClient: any = null
const userData = ref<any>({
  username: profile.value.username,
  connected: false
})

const connect = () => {
  let Sock = new SockJS(SOCKET_DOMAIN)
  stompClient = over(Sock)
  stompClient.connect({}, onConnected, onError)
}

const onConnected = () => {
  userData.value = { ...userData, connected: true }
  stompClient.subscribe('/topic/public/' + groupChatId.value, onMessageReceived)
  // userJoin([
  //   {
  //     username: profile.value.username,
  //     id: profile.value.id,
  //     choose: true
  //   }
  // ])
}

const userJoin = (arr: any) => {
  arr.push({
    username: profile.value.username,
    id: profile.value.id,
    choose: true
  })
  if (groupChatId.value) {
    arr.map((item: any) => {
      if (item.choose) {
        let userJoin = {
          sender: item.username,
          type: 'JOIN',
          groupChatId: groupChatId.value,
          userChatId: item.id
        }
        // console.log(userJoin)
        // stompClient.send('/app/message', {}, JSON.stringify(chatMessage))

        stompClient.send('/app/chat.addUser', {}, JSON.stringify(userJoin))
      }
    })
  } else {
    openDialogProp(FAIL)
  }
  setIsFilter({ stIsFilter: false })

  router.push({
    path: '/room-chat-detail',
    query: { id: groupChatId.value, name: groupChatNameCreated.value }
  })
}

const onMessageReceived = (payload: any) => {
  let payloadData = JSON.parse(payload?.body)
  // console.log('payloadData ::: ', payloadData)

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
/* SockJS */

const onSearchMemberToGroup = async () => {
  isLoadingSearch.value = true
  await ChatRoomRepo.searchMemberToGroup({
    fullName: usernameSearch.value,
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
        memberSearch.value = [...dataMemberFriend_temp]

        // scrollToTop()
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoadingSearch.value = false
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
const store = useCustomDialogStore()
const { openDialog } = store
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
const onAddNewGroupChat = async () => {
  if (groupChatName.value) {
    isLoadingGroup.value = true

    await ChatRoomRepo.createNewGroupChat({
      groupChatName: groupChatName.value.trim()
      // fullName: 'minh'
    })
      .then((res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          groupChatId.value = data?.data
          groupChatNameCreated.value = groupChatName.value.trim()
          connect()

          openDialogProp(SAVE_SUCCESS)
        } else {
          openDialogProp(FAIL)
        }
      })
      .catch((err: any) => {
        openDialogProp(FAIL)

        console.log(err)
      })
    isLoadingGroup.value = false
  }
}

const reset = () => {
  memberSearch.value = []
  usernameSearch.value = ''
}

const onGetProfile = async () => {
  await AuthRepo.getProfile()
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        setProfile({ stProfile: data?.data })
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}

watchEffect(() => {
  onGetProfile()
})

watchEffect(() => {
  setIsFilter({ stIsFilter: true })
})
</script>

<template>
  <div class="RoomChatCreateView">
    <div class="filter__popup">
      <div class="filter__popup__RoomChatDetailView">
        <div class="invite__someone__bot">
          <div class="invite__someone pt0px">
            <div class="new__group mt6px">
              <el-input
                placeholder="새 채팅 그룹 이름"
                class="w168px"
                v-model="groupChatName"
                @keyup.enter="onAddNewGroupChat"
              />
              <div class="new__group__ok" v-if="isLoadingGroup">
                <Loading />
              </div>
              <div
                v-else
                @click="onAddNewGroupChat"
                :class="groupChatName ? 'new__group__ok' : 'new__group__cancel'"
              >
                등록
              </div>
            </div>

            <div class="filter__title mt10px">대화 상대 초대</div>
            <div class="find__relative">
              <el-input
                class="mt10px w244px"
                v-model="usernameSearch"
                @keyup.enter="onSearchMemberToGroup"
              />
              <img @click="onSearchMemberToGroup" class="find__icon" :src="find" alt="find" />
            </div>

            <div class="partner__list mt10px" style="max-height: calc(80vh - 230px)">
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
              @click="userJoin(memberSearch)"
              class="Invite mt10px"
            >
              초대하기
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      @click="
        () => {
          setIsFilter({ stIsFilter: false })
          router.push({ path: '/room-chat-list' })
        }
      "
      class="hidden__btn"
    >
      <img :src="right18" alt="right18" />
    </div>

    <div class="RoomChatDetailView__content">
      <!-- <div class="Header__main">
        <img
          class="cursor__pointer iconx__iconx"
          :src="0 ? iconx : left"
          width="24"
          alt="iconx"
          @click="
            () => {
              router.push({ path: `/room-chat-list` })
            }
          "
        />
        <div class="iconx__right__search">
          <img class="cursor__pointer kinhlup" :src="kinhlup" alt="iconx" />
          <img class="cursor__pointer setting" :src="setting" alt="iconx" />
        </div>
      </div> -->

      <div class="intro">
        <div class="intro__a">
          <div class="notice">공지사항</div>
          <div class="notice__value">채팅방 이용시 비속어를 사용하지 않는 깨끗한</div>
        </div>
        <div class="content">
          채팅방을 유지해주세요. 장기적인 사용을 위해서 필요한 규칙들 을 읽어주시기 바랍니다.
        </div>
      </div>

      <div class="story mb20px"></div>

      <div class="send__mess mb20px">
        <img :src="plusblue" alt="plusblue" />
        <input class="input__mess" type="text" placeholder="메시지 보내기" />
        <img :src="send" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.filter__popup {
  position: absolute;
  z-index: 999;
  width: 280px;
  background-color: #fff;
  right: 0;
  top: 0;
  height: 100%;
  padding-top: 20px;
  animation: hidden__filter__popup 0.2s linear forwards;
  @keyframes hidden__filter__popup {
    0% {
      right: -200px;
    }
    50% {
      right: -100px;
    }
    100% {
      right: 0;
    }
  }
  .space10 {
    height: 10px;
    background-color: #f1f2f6;
  }
  .filter__title {
    font-family: SpoqaHanSansNeo;
    font-size: 17px;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: -0.43px;
    color: #242a37;
  }

  .filter__semi__title {
    font-family: SpoqaHanSansNeo;
    font-size: 15px;
    font-weight: normal;
    line-height: 20px;
    letter-spacing: -0.38px;
    color: #242a37;
  }
  .find__relative {
    position: relative;
    .find__icon {
      position: absolute;
      right: 16px;
      top: 20px;
      cursor: pointer;
    }
  }
  .filter__popup__RoomChatDetailView {
    height: 100%;
    display: flex;
    flex-direction: column;
    .partner__conversation {
      background-color: #fff;
      padding: 0 20px;
      padding-bottom: 40px;
      .partner__conversation__invite {
        display: flex;
        align-items: center;
        gap: 10px;
        .plus14 {
          border: solid 1px #006ed6;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .label__invite {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #006ed6;
        }
      }
    }

    .invite__someone__bot {
      display: flex;
      height: calc(50vh - 100px);
      flex-direction: column;
      .invite__someone {
        background-color: #fff;
        padding: 0 20px;
        padding-top: 20px;
      }
      .Invite {
        margin: 0 auto;
        width: 100px;
        height: 32px;
        border-radius: 6px;
        border: solid 1px #1767b3;
        background-color: #fff;

        font-family: SpoqaHanSansNeo;
        font-size: 13px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.33px;
        color: #1767b3;

        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .getout {
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        gap: 4px;
        background-color: #fff;
        border-top: 1px solid #f1f2f6;
        height: 40px;
        padding-left: 20px;
        cursor: pointer;
        .getout__icon {
          width: 20px;
          height: 20px;
        }
        .getout__title {
          font-family: SpoqaHanSansNeo;
          font-size: 13px;
          font-weight: normal;
          line-height: 16px;
          letter-spacing: -0.33px;
          color: #52606d;
        }
      }
    }
    .partner__list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-x: hidden;
      overflow-y: auto;
      max-height: calc(50vh - 220px);
    }
    .partner__item {
      display: flex;
      align-items: center;
      gap: 10px;
      .partner__avatar {
        width: 40px;
        height: 40px;
        min-width: 40px;
        min-height: 40px;
        border-radius: 50%;
        background-position: center center;
        object-fit: cover;
        background-size: cover;
        background-attachment: fixed;
        background-repeat: no-repeat;
      }
      .partner__avatar__act {
        border: solid 2px #f58220 !important;
      }
      .partner__name {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #242a37;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        width: 90%;
        max-width: 90%;
      }
      .partner__name__act {
        color: #f58220 !important;
      }
    }
  }
  .filter__CompanyListView__scroll {
    max-height: calc(100vh - 100px);
    overflow-y: scroll;
  }
  .filter__popup__CompanyListView {
    .filter__sort {
      background-color: #fff;
      padding: 0 20px;
      .list__drop {
        display: flex;
        gap: 4px;
      }
    }

    .filter__filter {
      background-color: #fff;
      padding: 0 20px;
    }

    .keyword__list {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      @mixin keyword__item {
        cursor: pointer;
        width: 70px;
        height: 31px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.3px;
      }
      .keyword__item__passive {
        @include keyword__item;
        color: #52606d;
        background-color: #f1f2f6;
      }
      .keyword__item__active {
        @include keyword__item;
        color: #ffffff;
        background-color: #006ed6;
      }
    }
    .list__btn {
      display: flex;
      gap: 10px;
      @mixin filter__btn {
        width: 115px;
        height: 46px;
        border-radius: 16px;

        display: flex;
        justify-content: center;
        align-items: center;

        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-style: normal;
        line-height: 20px;
        letter-spacing: -0.75px;
        text-align: center;
        cursor: pointer;
      }
      .btn__reset {
        @include filter__btn;
        border: solid 1px #0067b9;
        background-color: #fff;
        color: #0067b9;
      }
      .btn__apply {
        @include filter__btn;
        background-color: #0067b9;
        color: #fff;
      }
    }
  }
  .el-input {
    .el-input__wrapper {
      box-shadow: none;
      border-radius: 10px;
      border: solid 1px #cbd2da;
      .el-input__inner {
        outline: none;
        border: none;
        height: 42px;
      }
    }
    .el-input__wrapper.is-focus {
      border: solid 1px #1767b3;
    }
  }
}
.RoomChatCreateView {
  width: 100%;
  position: relative;
  margin-top: -54px;

  .new__group {
    display: flex;
    gap: 6px;
    @mixin new__group__btn {
      width: 80px;
      height: 46px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: normal;
      line-height: 20px;
      letter-spacing: normal;
    }
    .new__group__ok {
      @include new__group__btn;
      background-color: #1767b3;
      color: #fff;
      cursor: pointer;
    }
    .new__group__cancel {
      @include new__group__btn;
      background-color: #cbd2da;
      color: #52606d;
      cursor: not-allowed;
    }
  }

  .RoomChatDetailView__content {
    .hightlight {
      background-color: #ffff00 !important;
      color: #242a37;
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: -0.3px;
    }
    .dowarr {
      transform: rotate(180deg);
    }
    .search {
      display: flex;
      gap: 6px;
      margin-right: 6px;
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
        .notice {
          font-family: SpoqaHanSansNeo;
          font-size: 11px;
          font-weight: 600;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #1867b3;
        }
        .notice__value {
          font-family: SpoqaHanSansNeo;
          font-size: 11px;
          font-weight: normal;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #51606d;
        }
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

    .story {
      height: calc(100vh - 230px);
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
          .from__content {
            width: 177px;
            min-width: 177px;
            padding: 10px 14px;
            border-radius: 20px;
            background-color: #f1f2f6;

            font-family: SpoqaHanSansNeo;
            font-size: 12px;
            font-weight: normal;
            line-height: 16px;
            letter-spacing: -0.3px;
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
        .to__content {
          width: 236px;
          min-width: 236px;
          padding: 10px 14px;
          border-radius: 20px;
          background-color: #1767b3;

          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: normal;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #fff;
        }
      }
    }

    .send__mess {
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
        padding: 14px 180px 14px 15px;
        border-radius: 21.5px;
        background-color: #f1f2f6;
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
