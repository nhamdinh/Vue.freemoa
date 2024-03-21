<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { formatMoney, getDurationBetween } from '@/common/commonFunction'
import router from '@/router'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import heartden from '@/assets/svg/heartden20.svg'
import heartdo from '@/assets/svg/heartdo20.svg'
import Loading from '@/components/Loading.vue'
import { DATE_DOT, TO_LOGIN } from '@/common/constance'
import moment from 'moment'
import { useCustomDialogStore } from '@/stores/customDialog'

const props = defineProps(['productId'])
const ProductRepo = RepositoryFactory.get('product')
const CompanyRepo = RepositoryFactory.get('company')
const isLoading = ref<any>(false)

const dataPost = ref<any>({})
const onGetProductById = async () => {
  isLoading.value = true

  await ProductRepo.getProductById({
    productId: props.productId
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

const onUpdateFavorite = async (dataPost: any) => {
  isLoadingUpdate.value = true

  await CompanyRepo.updateFavorite({
    companyId: null,
    productId: dataPost?.id,
    type: 2,
    isFavorite: !dataPost?.isFavorite
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        onGetProductById()
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
  <div
    class="products__item"
    @click="
      router.push({
        path: '/service-detail-organization',
        query: { id: dataPost?.id, name: dataPost?.name }
      })
    "
  >
    <div class="cxzzcz">
      <img class="profake" :src="dataPost?.productImage" alt="profake1" />
      <div class="tags">
        <div class="tag__a" v-if="getDurationBetween(Date.now(), dataPost?.createdDate) <= 31">
          신규
        </div>
        <div class="tag__b" v-if="dataPost?.favoriteNumber >= 3 || dataPost?.countChatNumber >= 30">
          인기
        </div>
      </div>
    </div>
    <div class="products__item__right">
      <div class="area" style="font-weight: normal">{{ dataPost?.name }}</div>
      <div class="target mt8px">지원대상</div>
      <div class="service__list__b mt4px">
        {{ dataPost?.targetService }}
      </div>
      <div class="service__list__b mt4px">
        {{ moment(dataPost?.createdDate).format(DATE_DOT) }} ~
        {{
          moment(
            new Date(moment(dataPost?.createdDate).format(DATE_DOT)).setMonth(
              new Date(moment(dataPost?.createdDate).format(DATE_DOT)).getMonth() + 1
            )
          ).format(DATE_DOT)
        }}
      </div>
      <div
        class="btn__like mt8px"
        @click="
          (e) => {
            e.stopPropagation()
            onUpdateFavorite(dataPost)
          }
        "
      >
        <Loading v-if="isLoadingUpdate || isLoading" />
        <img v-else :src="dataPost?.isFavorite ? heartdo : heartden" alt="heartden" />
        <p>찜하기</p>
      </div>
    </div>
  </div>
</template>
