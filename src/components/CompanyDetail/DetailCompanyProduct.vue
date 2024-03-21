<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { formatMoney, getDurationBetween } from '@/common/commonFunction'
import router from '@/router'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import heartden from '@/assets/svg/heartden20.svg'
import heartdo from '@/assets/svg/heartdo20.svg'
import Loading from '@/components/Loading.vue'
import { useCustomDialogStore } from '@/stores/customDialog'
import { TO_LOGIN } from '@/common/constance'

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
const isLoadingUpdate = ref<any>(false)
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
        path: '/product-detail',
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
      <div class="area mt8px">{{ formatMoney(dataPost?.price) }}원</div>
      <div class="area_semi__a mt8px">주문수량협상</div>
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
