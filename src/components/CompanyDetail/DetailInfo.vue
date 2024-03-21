<script setup lang="ts">
import { ref } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import router from '@/router'
import { TO_LOGIN } from '@/common/constance'
import { useCustomDialogStore } from '@/stores/customDialog'

const props = defineProps(['company', 'type', 'contact'])

const step = ref<any>(1)

const row1 = ref<any>(props?.company?.tag?.split(','))

let video = props?.company?.video ? (props?.company?.video).replace('watch?v=', 'embed/') : ''

const ChatRoomRepo = RepositoryFactory.get('chatRoom')
const isLoadingSupporter = ref<any>(false)

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
      // showAction.value = false
      console.log('cancel')
    },
    actionAfterClose: () => {}
  })
}

const onCreateChatVsSupporter = async () => {
  isLoadingSupporter.value = true
  if (1)
    await ChatRoomRepo.createChatVsSupporter({
      companyId: props.company?.id,
      groupChatName: `'${props.company?.name}' 관련 문의합니다`
    })
      .then((res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          // console.log(data?.data?.groupChatId)
          // console.log(data?.data?.isExistedGroupChat)
          if (0) {
            router.push({
              path: '/room-chat-detail',
              query: {
                id: data?.data?.groupChatId,
                name: `'${props.company?.name}' 관련 문의합니다`
              }
            })
          } else {
            router.push({
              path: '/room-chat-detail',
              query: {
                id: data?.data?.groupChatId,
                name: `'${props.company?.name}' 관련 문의합니다`,
                supporterUsername: data?.data?.supporter?.username,
                supporterId: data?.data?.supporter?.id
              }
            })
          }
        }
      })
      .catch((err: any) => {
        if (err?.response?.status === 401) {
          openPopup('confirm')
        }
        console.log(err)
      })
  isLoadingSupporter.value = false
}
</script>

<template>
  <div class="DetailInfo mt20px">
    <div class="DetailInfo__content">
      <iframe
        v-if="video"
        :src="video"
        width="328"
        height="226"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        title="Tr&amp;eacute;ning TEXT"
      ></iframe>

      <img class="CK mt20px" :src="company?.bannerImage" alt="bannerImage" />
      <div v-if="company?.businessFieldsImage" class="area mt44px">사업 분야</div>
      <img v-if="company?.businessFieldsImage" class="quangcao mt20px" :src="company?.businessFieldsImage" alt="businessFieldsImage" />
      <div class="area mt40px" v-if="company?.tag" >키워드</div>
      <div class="DetailInfo__row mt20px" v-if="company?.tag">
        <div class="tag" v-for="(item, index) in row1" :key="index">{{ item }}</div>
      </div>

      <div class="area mt70px">회사 주소 및 위치</div>
      <div class="area__semi mt10px">{{ company?.address }}</div>
    </div>

    <iframe
      class="mt20px"
      :src="`https://www.google.com/maps?q=${company?.longitude},${company?.latitude}&hl=es;z%3D14&amp&output=embed`"
      width="359"
      height="187"
      frameborder="0"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      loading="lazy"
    ></iframe>
    <div class="contact__btn__box mt30px">
      <div class="contact__btn" v-if="isLoadingSupporter">
        <Loading />
      </div>
      <div v-else class="contact__btn" @click="onCreateChatVsSupporter">
        {{ contact }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.DetailInfo {
  width: 100%;
  .DetailInfo__content {
    padding: 0 16px;
    .DetailInfo__row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      .tag {
        height: 31px;
        padding: 0 12px;
        border-radius: 10px;
        background-color: #f1f2f6;

        font-family: SpoqaHanSansNeo;
        font-size: 11px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #52606d;

        display: flex;
        align-items: center;
      }
    }
    .youtube {
      width: 328px;
      height: 226px;
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: center center;
      object-fit: cover;
    }
    .CK {
      width: 328px;
      height: 145px;
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: center center;
      object-fit: cover;
      border-radius: 5px;
    }
    .quangcao {
      width: 328px;
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: center center;
      object-fit: cover;
    }
    .area {
      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: bold;
      line-height: 20px;
      letter-spacing: -0.38px;
      color: #000;
    }
    .area__semi {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #242a37;
    }
  }

  .map {
    width: 360px;
    height: 187px;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center center;
    object-fit: cover;
  }

  .contact__btn {
    margin: 0 auto;
    width: 328px;
    height: 49px;
    border-radius: 6px;
    background-color: #1767b3;

    font-family: SpoqaHanSansNeo;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.4px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
.contact__btn__box {
  border-top: 1px solid #cbd2da;
  height: 69px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
