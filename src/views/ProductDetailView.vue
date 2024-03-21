<script setup lang="ts">
import Header from './../components/Header.vue'
import { ref, watchEffect, watch } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import {
  formatMoney,
  getDurationBetween,
  handleUpdateFavoriteDetail
} from '@/common/commonFunction'
import heartden from '@/assets/svg/heartden.svg'
import heartdo from '@/assets/svg/heartdo.svg'
import right from '@/assets/svg/right.svg'
import router from '@/router'
import { useCustomDialogStore } from '@/stores/customDialog'
import { TO_LOGIN } from '@/common/constance'

const ProductRepo = RepositoryFactory.get('product')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const productId = urlParams.get('id')
const name = urlParams.get('name')
const isLoading = ref<any>(true)
const isLoadingUpdate = ref<any>(false)

const dataPost = ref<any>({})
const onGetProductById = async () => {
  await ProductRepo.getProductById({
    productId: productId
  })
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

watchEffect(() => {
  onGetProductById()
})

const CompanyRepo = RepositoryFactory.get('company')
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
const onUpdateFavorite = async (item: any) => {
  isLoadingUpdate.value = true

  await CompanyRepo.updateFavorite({
    companyId: null,
    productId: item?.id,
    type: 2,
    isFavorite: !item?.isFavorite
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        dataPost.value = handleUpdateFavoriteDetail(dataPost.value)
        // onGetProductById()
      }
    })
    .catch((err: any) => {
      if (err?.response?.status === 401) {
        openPopup('confirm')
      }
      console.log(err)
    })
  isLoadingUpdate.value = false
}

const ChatRoomRepo = RepositoryFactory.get('chatRoom')
const isLoadingSupporter = ref<any>(false)

const onCreateChatVsSupporter = async () => {
  isLoadingSupporter.value = true

  await ChatRoomRepo.createChatVsSupporter({
    productId: dataPost.value?.id,
    groupChatName: `'${dataPost.value?.name}' 관련 문의합니다`
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
              name: `'${dataPost.value?.name}' 관련 문의합니다`
            }
          })
        } else {
          router.push({
            path: '/room-chat-detail',
            query: {
              id: data?.data?.groupChatId,
              name: `'${dataPost.value?.name}' 관련 문의합니다`,
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
  <div class="ProductDetailView">
    <Header
      :back="'/best-product-list'"
      :icon="2"
      :title="dataPost?.category"
      :iconRight="2"
    ></Header>
    <Loading v-if="isLoadingUpdate" />

    <Loading v-if="isLoading" />

    <div
      v-else
      class="ProductDetailView__content wrapper__main mt0px"
      style="max-height: calc(100vh - 60px)"
    >
      <img class="productImage" :src="dataPost?.productImage" alt="productImage" />
      <div class="ProductDetail__content mt20px">
        <div
          class="business__name"
          @click="router.push({ path: '/company-detail', query: { id: dataPost?.companyId } })"
        >
          <p>{{ dataPost?.companyName }}</p>
          <img :src="right" alt="right" />
        </div>
        <div class="tags mt10px">
          <div class="tag__a" v-if="getDurationBetween(Date.now(), dataPost?.createdDate) <= 31">
            신규
          </div>
          <div
            class="tag__b"
            v-if="dataPost?.favoriteNumber >= 3 || dataPost?.countChatNumber >= 30"
          >
            인기
          </div>
        </div>
        <div class="name mt10px">
          {{ dataPost?.name }}
        </div>
        <div class="description mt10px">
          {{ dataPost?.description }}
        </div>
        <div class="price mt20px">{{ formatMoney(dataPost?.price) }} 원</div>
        <div class="quantity__Order mt10px">주문수량협상</div>
        <div class="mt20px">
          <div
            class="productOptions"
            v-for="(item, index) in dataPost?.productOptions"
            :key="index"
          >
            <div class="productOptions__name">
              {{ item?.name }}
            </div>
            <div class="productOptions__desc__price">
              <div class="">
                {{ item?.description }}
              </div>
              <div class="">+{{ formatMoney(item?.price) }} 원</div>
            </div>
          </div>
        </div>
      </div>

      <div class="consultation pt10px pb10px">
        <div
          class="like__consultation"
          @click="
            (e) => {
              e.stopPropagation()
              onUpdateFavorite(dataPost)
            }
          "
        >
          <img :src="dataPost?.isFavorite ? heartdo : heartden" alt="heartden" />
        </div>
        <div class="btn__consultation" v-if="isLoadingSupporter">
          <Loading />
        </div>
        <div v-else class="btn__consultation" @click="onCreateChatVsSupporter">주문 상담하기</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ProductDetailView {
  width: 100%;
  min-height: calc(100vh - 20px);
  .ProductDetailView__content {
    .productImage {
      width: 359px;
      height: 240px;
      min-width: 359px;
      min-height: 240px;

      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: center center;
      object-fit: cover;
    }
    .ProductDetail__content {
      padding: 0 16px;
      flex: 1;
      .business__name {
        font-family: SpoqaHanSansNeo;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: -0.35px;
        color: #242a37;

        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        p {
          font-weight: bold;
        }
      }
      .name {
        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-weight: normal;
        line-height: 20px;
        letter-spacing: -0.38px;
        color: #242a37;
      }
      .description {
        font-family: SpoqaHanSansNeo;
        font-size: 13px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.33px;
        color: #52606d;
        white-space: pre-wrap;
      }
      .price {
        font-family: SpoqaHanSansNeo;
        font-size: 20px;
        font-weight: bold;
        line-height: 24px;
        letter-spacing: -0.5px;
        color: #000;
      }

      .quantity__Order {
        font-family: SpoqaHanSansNeo;
        font-size: 13px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.33px;
        color: #52606d;
      }
      .productOptions {
        border-top: 1px solid #cbd2da;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px 0;
        .productOptions__name {
          font-family: SpoqaHanSansNeo;
          font-size: 15px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.47;
          letter-spacing: -0.38px;
          text-align: left;
          color: #242a37;
        }
        .productOptions__desc__price {
          display: flex;
          justify-content: space-between;

          font-family: SpoqaHanSansNeo;
          font-size: 15px;
          font-weight: normal;
          line-height: 20px;
          letter-spacing: -0.38px;
          color: #242a37;
        }
      }

      .tags {
        display: flex;
        gap: 4px;
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
    .consultation {
      height: 69px;
      width: 359px;
      display: flex;
      gap: 6px;
      justify-content: center;
      align-items: center;
      border-top: 1px solid #cbd2da;
      .like__consultation {
        cursor: pointer;
        width: 49px;
        height: 49px;
        border-radius: 4px;
        border: solid 1px #cbd2da;
        background-color: #fff;

        display: flex;
        align-items: center;
        justify-content: center;
      }
      .btn__consultation {
        width: 272.8px;
        height: 49px;
        border-radius: 6px;
        background-color: #1767b3;

        display: flex;
        justify-content: center;
        align-items: center;

        font-family: SpoqaHanSansNeo;
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: -0.4px;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
