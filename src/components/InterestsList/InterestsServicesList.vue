<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import uparrow from '@/assets/svg/uparrow.svg'
import BestServiceItem from '@/components/InterestsList/BestServiceItem.vue'
import { handleUpdateFavorite } from '@/common/commonFunction'
import { PAGESIZE_6 } from '@/common/constance'

const dataProduct = ref<any>([])

const ProductRepo = RepositoryFactory.get('product')
const isLoading = ref<any>(true)
const params = ref<any>({
  category: 'ALL',
  type: 'SERVICE',
  isSearchByFavorite: true,
  pageSize: PAGESIZE_6,
  pageNum: 1
})
const currentPa = ref<any>(1)
const totalPa = ref<any>(1)
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
  if (scrollTop + clientHeight >= scrollHeight - 2) {
    if (currentPa.value < totalPa.value) {
      params.value = {
        ...params.value,
        pageNum: currentPa.value + 1
      }
      currentPa.value = currentPa.value + 1
    }
  }
}
const onGetListProduct = async () => {
  isLoading.value = true

  await ProductRepo.getListProduct({
    ...params.value
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        if (data?.data?.length > 0) {
          if (data?.totalCount % PAGESIZE_6 === 0) {
            totalPa.value = Math.floor(data?.totalCount / PAGESIZE_6)
          } else {
            totalPa.value = Math.floor(data?.totalCount / PAGESIZE_6 + 1)
          }
          dataProduct.value = [...dataProduct.value.concat(data?.data)]
        }
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  isLoading.value = false
}
watchEffect(() => {
  onGetListProduct()
})

const someElement = ref<any>()
const scrollToTop = () => {
  if (someElement.value) someElement.value.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="uptotop" :class="showToTop && 'dn'" @click="scrollToTop">
    <img :src="uparrow" alt="uparrow" />
  </div>
  <div
    style="height: calc(100vh - 134px)"
    class="OrganizationListView__mid mt20px"
    @scroll="scrolling"
  >
    <div class="mb20px" ref="someElement"></div>
    <BestServiceItem
      :dataProduct="dataProduct"
      :isLoading="isLoading"
      @onGetDataProduct="
        (id: any) => {
          dataProduct = handleUpdateFavorite(id, dataProduct)
          let isFavoriteArr = dataProduct.filter((item: any) => item.isFavorite)
          dataProduct = isFavoriteArr
        }
      "
    ></BestServiceItem>
  </div>
</template>
<style lang="scss"></style>
