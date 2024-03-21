<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import Loading from '@/components/Loading.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import InquiryItem from './InquiryItem.vue'
import uparrow from '@/assets/svg/uparrow.svg'
import { PAGESIZE_10 } from '@/common/constance'
import pluswhite24 from '@/assets/svg/pluswhite24.svg'
import router from '@/router'

const dataInquiry = ref<any>([])

const inquiryRepo = RepositoryFactory.get('inquiry')
const isLoading = ref<any>(true)

const params = ref<any>({
  pageSize: PAGESIZE_10,
  pageNum: 1,
  orderSort: 'ASC'
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
const onGetAllInquiries = async () => {
  isLoading.value = true

  await inquiryRepo
    .getAllInquiries({
      ...params.value
    })
    .then((res: any) => {
      const data = res?.data
      // console.log(data)
      if (data?.status === 'OK') {
        if (data?.data?.length > 0) {
          if (data?.totalCount % PAGESIZE_10 === 0) {
            totalPa.value = Math.floor(data?.totalCount / PAGESIZE_10)
          } else {
            totalPa.value = Math.floor(data?.totalCount / PAGESIZE_10 + 1)
          }
          dataInquiry.value = [...dataInquiry.value.concat(data?.data)]
        }
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoading.value = false
}
watchEffect(() => {
  onGetAllInquiries()
})
const someElementTop = ref<any>()

const scrollToTop = () => {
  if (someElementTop.value) someElementTop.value.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div
    class="uptotop"
    :style="0? 'bottom: 160px' : ''"
    @click="router.push({ path: `/inquiry-create` })"
  >
    <img :src="pluswhite24" alt="pluswhite24" />
  </div>
  <!-- <div class="uptotop" :class="showToTop && 'dn'" @click="scrollToTop">
    <img :src="uparrow" alt="uparrow" />
  </div> -->
  <div class="OrganizationPostsListView__content__card mt0px" @scroll="scrolling">
    <div class="mb10p mt10px" ref="someElementTop"></div>
    <InquiryItem v-for="(item, index) in dataInquiry" :key="index" :item="item"></InquiryItem>

    <div class="mt20px mb20px" v-if="isLoading">
      <Loading />
    </div>
  </div>
</template>

<style lang="scss">
.OrganizationPostsListView__content__card {
  height: calc(100vh - 58px);
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .zczxc {
    bottom: 160px;
  }
}
</style>
