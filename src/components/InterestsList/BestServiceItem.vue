<script setup lang="ts">
import { ref } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import heartden from '@/assets/svg/heartden20.svg'
import heartdo from '@/assets/svg/heartdo20.svg'
import uparrow from '@/assets/svg/uparrow.svg'
import router from '@/router'
import { DATE_DOT } from '@/common/constance'
import moment from 'moment'
import { useCustomDialogStore } from '@/stores/customDialog'
import { TO_LOGIN } from '@/common/constance'

defineProps(['dataProduct', 'isLoading'])
const emits = defineEmits(['onGetDataProduct'])

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
    companyId: null,
    productId: item?.id,
    type: 2,
    isFavorite: !item?.isFavorite
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        emits('onGetDataProduct', item?.id)
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
  <div class="bestProduct__list">
    <div
      v-for="(item, index) in dataProduct"
      @click="router.push({ path: '/product-detail', query: { id: item?.id, name: item?.name } })"
      class="bestProduct__item"
      :key="index"
    >
      <div class="bestProduct__item__left">
        <img class="productImage" :src="item?.productImage" alt="productImage" />
        <div class="service__company"></div>
        <div class="companyName">
          {{ item?.companyName }}
        </div>
      </div>
      <div class="bestProduct__item__right">
        <div class="name">{{ item?.name }}</div>

        <div class="support__target mt8px">지원대상</div>
        <div class="description mt4px">{{ item?.description }}</div>
        <div class="createdDate mt8px">
          {{ moment(item?.createdDate).format(DATE_DOT) }} ~
          {{
            moment(
              new Date(moment(item?.createdDate).format(DATE_DOT)).setMonth(
                new Date(moment(item?.createdDate).format(DATE_DOT)).getMonth() + 1
              )
            ).format(DATE_DOT)
          }}
        </div>

        <div
          class="btn__like mt8px"
          @click="
            (e) => {
              e.stopPropagation()
              onUpdateFavorite(item)
            }
          "
        >
          <img :src="item?.isFavorite ? heartdo : heartden" alt="heartden" />
          <p>찜하기</p>
        </div>
      </div>
    </div>
  </div>
  <div class="mt20px mb20px" v-if="isLoading">
    <Loading />
  </div>
</template>
<style lang="scss">
.bestProduct__list {
  display: flex;
  gap: 20px;
  flex-direction: column;

  .bestProduct__item {
    cursor: pointer;
    width: 328px;
    max-width: 328px;
    height: 148px;
    max-height: 148px;

    display: flex;
    align-items: center;
    gap: 10px;
    flex-direction: row;
    .bestProduct__item__left {
      width: 148px;
      height: 148px;
      position: relative;
      @mixin companyName {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 25px;
      }
      .service__company {
        @include companyName;
        background-color: #242a37;
        opacity: 0.4;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
      }
      .companyName {
        @include companyName;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;

        font-family: SpoqaHanSansNeo;
        font-size: 10px;
        font-weight: 500;
        line-height: 25px;
        letter-spacing: -0.25px;
        text-align: center;
        color: #fff;
        padding: 0 6px;
      }

      .productImage {
        width: 148px;
        height: 148px;
        border-radius: 10px;
        min-width: 148px;
        min-height: 148px;

        background-size: cover;
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-position: center center;
        object-fit: cover;
      }
    }

    .bestProduct__item__right {
      display: flex;
      flex-direction: column;
      max-width: 170px;

      .name {
        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-weight: normal;
        line-height: 20px;
        letter-spacing: -0.38px;
        color: #242a37;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .support__target {
        font-size: 12px;
        font-weight: bold;
        line-height: 16px;
        letter-spacing: -0.3px;
        text-align: left;
        color: #242a37;
      }
      .description {
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #242a37;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .createdDate {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #52606d;
        display: flex;
        justify-content: flex-start;
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
          color: #f3485b;
        }
      }
    }
  }
}
</style>
