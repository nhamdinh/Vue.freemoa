<script setup lang="ts">
import router from '@/router'
import diachi from '@/assets/img/diachi.png'
import phone from '@/assets/img/phone.png'
import link from '@/assets/img/link.png'
import heart from '@/assets/svg/heart.svg'
import heartlike from '@/assets/svg/heartlike.svg'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import { formatCustomerPhoneNumber } from '@/common/commonFunction'
import info from '@/assets/img/info.png'
import { ref } from 'vue'
import { useCustomDialogStore } from '@/stores/customDialog'
import { TO_LOGIN } from '@/common/constance'

defineProps(['organization', 'dataCompany', 'isLoading', 'type'])
const emits = defineEmits(['onGetDataCompany'])

const CompanyRepo = RepositoryFactory.get('company')
const isLoadingUpdate = ref<any>(false)
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
        emits('onGetDataCompany', item?.id)
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
</script>

<template>
  <Loading v-if="isLoadingUpdate" />
  <div
    v-for="(item, index) in dataCompany"
    :key="index"
    @click="
      () => {
        if (type === 'company') {
          router.push({ path: '/company-detail', query: { id: item?.id } })
        } else {
          if (organization === 'Financial' || organization === 'Support')
            router.push({ path: '/organization-detail', query: { id: item?.id } })
        }
      }
    "
    class="OrganizationListView__mid__item mb20px cursor__pointer"
    :style="type === 'company' ? 'height: 223px;min-height: 223px;' : ''"
  >
    <img class="logo__company" :src="item?.logo" alt="logo" />
    <div
      class="heart"
      @click="
        (e) => {
          e.stopPropagation()
          onUpdateFavorite(item)
        }
      "
    >
      <img :src="item?.isFavorite === true ? heartlike : heart" alt="like" />
    </div>
    <div class="mid__item__a">
      <div class="item__a__a text__ellipsis">{{ item?.name }}</div>
      <div class="item__a__b text__ellipsis">{{ item?.companyGroupName }}</div>
    </div>
    <div class="mid__item__b mt8px" v-if="type === 'company'">
      <img class="wh1818" :src="info" alt="diachi" />
      <div class="item__b__b w180px text__ellipsis">{{ item?.representationUserFullName }}</div>
    </div>

    <div class="mid__item__b mt8px">
      <img class="wh1818" :src="diachi" alt="diachi" />
      <div class="item__b__b w180px text__ellipsis">{{ item?.address }}</div>
    </div>
    <div class="mid__item__b mt4px">
      <img class="wh1818" :src="phone" alt="phone" />
      <div class="item__b__b w180px text__ellipsis">
        {{ formatCustomerPhoneNumber(item?.hotline ?? '1234567890') }}
      </div>
    </div>
    <div class="mid__item__b mt4px">
      <img class="wh1818" :src="link" alt="link" />
      <div class="item__b__b w180px text__ellipsis">{{ item?.website }}</div>
    </div>
    <div class="about mt20px">회사소개</div>
    <div class="about__desc mt6px">
      {{ item?.description }}
    </div>
  </div>
  <Loading v-if="isLoading" />
</template>

<style lang="scss">
.OrganizationListView__mid {
  padding: 20px 16px;
  height: calc(100vh - 180px);
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 0;
  background-color: #f1f2f6;
  display: flex;
  flex-direction: column;

  // background-color: yellowgreen;
  .OrganizationListView__mid__item {
    width: 328px;
    height: 201px;
    min-height: 201px;
    padding: 19px 17px 20px 19px;
    border-radius: 10px;
    box-shadow: 0 0 6px 0 rgba(71, 133, 185, 0.2);
    background-color: #fff;
    position: relative;
    cursor: pointer;

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
      /*           width: 150px;
          height: 50px; */
    }
  }
}
</style>
