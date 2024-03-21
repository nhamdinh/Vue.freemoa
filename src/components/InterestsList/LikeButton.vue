<script setup lang="ts">
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import heartden from '@/assets/svg/heartden20.svg'
import heartdo from '@/assets/svg/heartdo20.svg'
import { ref } from 'vue'
import { useCustomDialogStore } from '@/stores/customDialog'
import { TO_LOGIN } from '@/common/constance'

import router from '@/router'

defineProps(['item'])
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
      console.log('res res')

      console.log(res)
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
  <div
    class="btn__like mt8px"
    @click="
      (e) => {
        e.stopPropagation()
        onUpdateFavorite(item)
      }
    "
  >
    <Loading v-if="isLoadingUpdate" />
    <img v-else :src="item?.isFavorite ? heartdo : heartden" alt="heartden" />
    <p>찜하기</p>
  </div>
</template>
