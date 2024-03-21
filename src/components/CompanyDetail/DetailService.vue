<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import router from '@/router'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { useRoute } from 'vue-router'
import DetailCompanyProduct from '@/components/CompanyDetail/DetailCompanyProduct.vue'
import DetailOrganService from '@/components/CompanyDetail/DetailOrganService.vue'
import Loading from '@/components/Loading.vue'
import { TO_LOGIN } from '@/common/constance'
import { useCustomDialogStore } from '@/stores/customDialog'

const props = defineProps(['company', 'companyId'])
const CompanyRepo = RepositoryFactory.get('company')

const isLoading = ref<any>(false)
const onGetListCompanyProduct = async () => {
  isLoading.value = true
  await CompanyRepo.getListCompanyProduct({ companyId: props?.companyId })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        dataPost.value = data?.data
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoading.value = false
}
const get100C = (text: any) => {
  return text.substring(0, 150) + '...'
}

const showAll = ref<any>(false)
const dataPost = ref<any>([])
watchEffect(() => {
  onGetListCompanyProduct()
})
const route = useRoute()

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
  <div class="DetailService mt20px">
    <div class="DetailService__content">
      <div v-if="company?.introduceProduct" class="area">주요 상품 및 서비스 소개</div>
      <div v-if="company?.introduceProduct" class="area__semi mt10px">
        {{ company?.introduceProduct }}
      </div>
      <Loading v-if="isLoading" />
      <div v-else class="products mt50px" v-if="route.path.includes('company-detail')">
        <DetailCompanyProduct v-for="(item, index) in dataPost" :key="index" :productId="item?.id">
        </DetailCompanyProduct>
      </div>
      <div class="products mt50px" v-if="route.path.includes('organization-detail')">
        <DetailOrganService v-for="(item, index) in dataPost" :key="index" :productId="item?.id">
        </DetailOrganService>
      </div>
      <div v-if="company?.referenceProduct">
        <div class="area mt40px">참고 및 주의사항</div>
        <div
          class="area__semi mt10px"
          v-if="!showAll"
          @click="showAll = !showAll"
          v-html="get100C(company?.referenceProduct)"
        ></div>
        <div
          class="area__semi mt10px"
          v-else
          @click="showAll = !showAll"
          v-html="company?.referenceProduct"
        ></div>
      </div>
    </div>
    <div class="contact__btn__box mt30px">
      <div class="contact__btn" v-if="isLoadingSupporter">
        <Loading />
      </div>
      <div v-else class="contact__btn" @click="onCreateChatVsSupporter">문의하기</div>
    </div>
  </div>
</template>

<style lang="scss">
.DetailService {
  width: 100%;
  .DetailService__content {
    padding: 0 16px;
    .products {
      display: flex;
      flex-direction: column;
      gap: 20px;
      .products__item {
        display: flex;
        width: 328px;
        gap: 10px;
        align-items: center;
        cursor: pointer;
        .cxzzcz {
          width: 148px;
          height: 148px;
          position: relative;
          .tags {
            display: flex;
            gap: 4px;
            position: absolute;
            top: 10px;
            left: 10px;
            @mixin tag {
              font-family: SpoqaHanSansNeo;
              font-size: 12px;
              font-weight: 500;
              line-height: 16px;
              letter-spacing: -0.3px;
              color: #fff;

              width: 34px;
              height: 19px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .tag__a {
              @include tag;

              background-color: #006ed6;
            }
            .tag__b {
              @include tag;

              background-color: #f3485b;
            }
          }
        }
        .profake {
          border-radius: 8px;
          min-width: 148px;
          min-height: 148px;
          width: 148px;
          height: 148px;

          background-size: cover;
          background-repeat: no-repeat;
          background-attachment: fixed;
          background-position: center center;
          object-fit: cover;
        }
        .products__item__right {
        }
      }
    }

    .area {
      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: bold;
      line-height: 20px;
      letter-spacing: -0.38px;
      color: #000;

      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .area__semi {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #242a37;
      white-space: pre-wrap;
      cursor: pointer;
    }
    .area_semi__a {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #52606d;
    }
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
  .btn__like {
    cursor: pointer;
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: center;

    width: 170px;
    height: 32px;
    border-radius: 4px;
    border: solid 1px #cbd2da;
    background-color: #fff;
    p {
      font-family: SpoqaHanSansNeo;
      font-size: 13px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.33px;
      color: #242a37;
    }
  }
  .target {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: bold;
    line-height: 16px;
    letter-spacing: -0.3px;
    color: #242a37;
  }
}
</style>
