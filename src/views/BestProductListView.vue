<script setup lang="ts">
import Header from './../components/Header.vue'
import BestProductItem from '@/components/InterestsList/BestProductItem.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { ref, watchEffect } from 'vue'
import uparrow from '@/assets/svg/uparrow.svg'
import { PAGESIZE_10 } from '@/common/constance'
import { handleUpdateFavorite } from '@/common/commonFunction'

const dataProduct = ref<any>([])

const ProductRepo = RepositoryFactory.get('product')
const isLoading = ref<any>(true)

const onGetListProductTop = async () => {
  await ProductRepo.getListProductTop({
    category: 'ALL',
    pageSize: PAGESIZE_10,
    pageNum: 1
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        dataProduct.value = data?.data
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  isLoading.value = false
}
watchEffect(() => {
  onGetListProductTop()
})
const someElement = ref<any>()
const scrollToTop = () => {
  if (someElement.value) someElement.value.scrollIntoView({ behavior: 'smooth' })
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
  <div class="BestProductListView">
    <Header :back="'/home'" :icon="2" :title="'베스트 상생 상품'" :iconRight="1"></Header>
    <div class="uptotop" :class="showToTop && 'dn'" @click="scrollToTop">
      <img :src="uparrow" alt="uparrow" />
    </div>
    <div
      style="height: calc(100vh - 60px)"
      class="OrganizationListView__mid mt0px pr12px pl12px"
      @scroll="scrolling"
    >
      <div class="mb20px" ref="someElement"></div>
      <BestProductItem
        :dataProduct="dataProduct"
        :isLoading="isLoading"
        @onGetDataProduct="
          (id: any) => {
            dataProduct = handleUpdateFavorite(id, dataProduct)
          }
        "
      ></BestProductItem>
    </div>
  </div>
</template>

<style lang="scss">
.BestProductListView {
  width: 100%;
  position: relative;
  min-height: calc(100vh - 10px);
  overflow: hidden;
}
</style>
