<script setup lang="ts">
import Header from './../components/Header.vue'
import { ref, watchEffect } from 'vue'
import info from '@/assets/img/info.png'
import diachi from '@/assets/img/diachi.png'
import phone from '@/assets/img/phone.png'
import link from '@/assets/img/link.png'
import heart from '@/assets/svg/heart.svg'
import heartlike from '@/assets/svg/heartlike.svg'
import DetailInfo from '@/components/CompanyDetail/DetailInfo.vue'
import DetailService from '@/components/CompanyDetail/DetailService.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { formatCustomerPhoneNumber } from '@/common/commonFunction'
import Loading from '@/components/Loading.vue'
import { handleUpdateFavoriteDetail } from '@/common/commonFunction'
import { useCustomDialogStore } from '@/stores/customDialog'
import { TO_LOGIN } from '@/common/constance'
import uparrow from '@/assets/svg/uparrow.svg'

import router from '@/router'

const step = ref<any>(1)
const CompanyRepo = RepositoryFactory.get('company')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const companyId = urlParams.get('id')
const isLoading = ref<any>(true)
const isLoadingUpdate = ref<any>(false)

const dataPost = ref<any>({})
const onGetListCompany = async () => {
  await CompanyRepo.getListCompany({
    // type: 'MEMBER',
    // pageSize: 5,
    // pageNum: 1,
    companyId: companyId
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data[0])
        dataPost.value = data?.data[0]
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoading.value = false
}

watchEffect(() => {
  onGetListCompany()
})
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
    companyId: item?.id,
    productId: null,
    type: 1,
    isFavorite: !item?.isFavorite
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        dataPost.value = handleUpdateFavoriteDetail(dataPost.value)
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
const someElementTop = ref<any>()
const scrollToTop = () => {
  if (someElementTop.value) someElementTop.value.scrollIntoView({ behavior: 'smooth' })
}
const showToTop = ref<any>(true)
const scrolling = (e: any) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  // console.log(scrollHeight)
  // console.log(clientHeight)
  // console.log(scrollTop)
  if (scrollTop > 200) {
    showToTop.value = false
  } else {
    showToTop.value = true
  }
}
</script>

<template>
  <div class="CompanyDetailView">
    <Header :back="'/company-list'" :icon="2" :title="'회원사 상세'" :iconRight="2"></Header>
    <div class="uptotop" :class="showToTop && 'dn'" @click="scrollToTop">
      <img :src="uparrow" alt="uparrow" />
    </div>
    <Loading v-if="isLoadingUpdate" />
    <Loading v-if="isLoading" />

    <div
      v-else
      class="CompanyDetailView__content wrapper__main mt0px"
      style="max-height: calc(100vh - 60px)"
      @scroll="scrolling"
    >
      <div class=" " ref="someElementTop"></div>
      <div class="CompanyDetailView__mid">
        <div class="CompanyDetailView__mid__item">
          <img class="logo__company" :src="dataPost?.logo" alt="logo" />
          <div class="heart" @click="onUpdateFavorite(dataPost)">
            <img :src="dataPost?.isFavorite === true ? heartlike : heart" alt="like" />
          </div>
          <div class="mid__item__a">
            <div class="item__a__a text__ellipsis">{{ dataPost?.name }}</div>
            <div class="item__a__b text__ellipsis">{{ dataPost?.companyGroupName }}</div>
          </div>
          <div class="mid__item__b mt8px">
            <img class="wh1818" :src="info" alt="info" />
            <div class="item__b__b w180px text__ellipsis">
              {{ dataPost?.representationUserFullName }}
            </div>
          </div>
          <div class="mid__item__b mt4px">
            <img class="wh1818" :src="diachi" alt="diachi" />
            <div class="item__b__b w180px text__ellipsis">{{ dataPost?.address }}</div>
          </div>
          <div class="mid__item__b mt4px">
            <img class="wh1818" :src="phone" alt="phone" />
            <div class="item__b__b w180px text__ellipsis">
              {{ formatCustomerPhoneNumber(dataPost?.hotline ?? '0123456789') }}
            </div>
          </div>
          <div class="mid__item__b mt4px">
            <img class="wh1818" :src="link" alt="link" />
            <div class="item__b__b w180px text__ellipsis">{{ dataPost?.website }}</div>
          </div>
          <div class="about mt20px">회사소개</div>
          <div class="about__desc mt6px">
            {{ dataPost?.description }}
          </div>
        </div>
      </div>
      <div class="navigate mt20px">
        <div
          @click="step = 1"
          :class="step === 1 ? 'navigate__btn__enabled' : 'navigate__btn__disabled'"
        >
          정보
        </div>
        <div
          @click="step = 2"
          :class="step === 2 ? 'navigate__btn__enabled' : 'navigate__btn__disabled'"
        >
          상품 및 서비스
        </div>
      </div>
      <DetailInfo
        :type="'Company'"
        :contact="'사업 제휴 문의하기'"
        :company="dataPost"
        v-if="step === 1"
      ></DetailInfo>
      <DetailService :company="dataPost" :companyId="companyId" v-else></DetailService>
    </div>
  </div>
</template>

<style lang="scss">
.CompanyDetailView {
  width: 100%;
  min-height: calc(100vh - 10px);

  .CompanyDetailView__content {
    .CompanyDetailView__mid {
      padding: 20px 0;
      background-color: #f1f2f6;
      .CompanyDetailView__mid__item {
        margin: 0 auto;
        width: 328px;
        height: 223px;
        padding: 19px 17px 20px 19px;
        border-radius: 10px;
        box-shadow: 0 0 6px 0 rgba(71, 133, 185, 0.2);
        background-color: #fff;
        position: relative;
        .heart {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          right: 17px;
          top: 19px;
          cursor: pointer;
        }
        .logo__company {
          position: absolute;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          border: 1px solid #787879;
          right: 17px;
          top: 19px;
        }
        .mid__item__a {
          display: flex;
          gap: 6px;
          align-items: center;
          .item__a__a {
            font-family: SpoqaHanSansNeo;
            font-size: 15px;
            font-weight: bold;
            line-height: 20px;
            letter-spacing: -0.38px;
            color: #242a37;
            width: 103px;
            max-width: 103px;
          }
          .item__a__b {
            width: 98px;
            height: 19px;
            padding: 0 6px;
            border-radius: 9.5px;
            border: solid 1px #006ed6;

            // display: flex;
            // align-items: center;
            // justify-content: center;
            text-align: center;

            font-family: SpoqaHanSansNeo;
            font-size: 12px;
            font-weight: 500;
            line-height: 17px;
            letter-spacing: -0.3px;
            color: #1767b3;
          }
        }

        .mid__item__b {
          display: flex;
          gap: 4px;
          align-items: center;
          .wh1818 {
            width: 18px;
            height: 18px;
          }
          .item__b__b {
            font-family: SpoqaHanSansNeo;
            font-size: 12px;
            font-weight: normal;
            line-height: 16px;
            letter-spacing: -0.3px;
            color: #52606d;
          }
        }

        .about {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #006ed6;
        }
        .about__desc {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: normal;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #242a37;

          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>
