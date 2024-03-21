<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import uparrow from '@/assets/svg/uparrow.svg'
import OrganizationItem from '@/components/Organization/OrganizationItem.vue'
import { handleUpdateFavorite } from '@/common/commonFunction'
import { PAGESIZE_5 } from '@/common/constance'

const CompanyRepo = RepositoryFactory.get('company')

const dataCompany = ref<any>([])
const isLoading = ref<any>(true)

const params = ref<any>({
  type: 'FINANCIAL',
  // type: 'GOVERNMENT',
  // type: 'MEMBER',
  isSearchByFavorite: true,
  orderSort: 'DESC',
  pageSize: PAGESIZE_5,
  pageNum: 1,
  companyGroupId: -1
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

const onGetListCompany = async () => {
  isLoading.value = true
  await CompanyRepo.getListCompany({
    ...params.value
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        if (data?.data?.length > 0) {
          if (data?.totalCount % PAGESIZE_5 === 0) {
            totalPa.value = Math.floor(data?.totalCount / PAGESIZE_5)
          } else {
            totalPa.value = Math.floor(data?.totalCount / PAGESIZE_5 + 1)
          }
          dataCompany.value = [...dataCompany.value.concat(data?.data)]
        }
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
    <OrganizationItem
      :organization="'Financial'"
      :isLoading="isLoading"
      :dataCompany="dataCompany"
      @onGetDataCompany="
        (id: any) => {
          dataCompany = handleUpdateFavorite(id, dataCompany)
          let isFavoriteArr = dataCompany.filter((item: any) => item.isFavorite)
          dataCompany = isFavoriteArr
        }
      "
    ></OrganizationItem>
  </div>
</template>
<style lang="scss"></style>
