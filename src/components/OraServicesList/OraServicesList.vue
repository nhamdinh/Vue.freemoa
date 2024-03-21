<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PAGESIZE_10 } from '@/common/constance'
import Loading from '@/components/Loading.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import uparrow from '@/assets/svg/uparrow.svg'
import { useRoute } from 'vue-router'
import router from '@/router'
import { DATE_DOT } from '@/common/constance'
import moment from 'moment'

const props = defineProps(['pathTo'])
const route = useRoute()
const params = ref<any>({
  category: 'ALL',
  type: 'SERVICE',
  pageSize: PAGESIZE_10,
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

const dataSupportServices = ref<any>([])
const ProductRepo = RepositoryFactory.get('product')
const onGetListProduct = async () => {
  isLoading.value = true

  await ProductRepo.getListProduct({
    ...params.value
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        if (data?.data?.length > 0) {
          if (data?.totalCount % PAGESIZE_10 === 0) {
            totalPa.value = Math.floor(data?.totalCount / PAGESIZE_10)
          } else {
            totalPa.value = Math.floor(data?.totalCount / PAGESIZE_10 + 1)
          }
          dataSupportServices.value = [...dataSupportServices.value.concat(data?.data)]
        }
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  isLoading.value = false
}

const isLoading = ref<any>(true)

watchEffect(() => {
  onGetListProduct()
})
const someElementTop = ref<any>()

const scrollToTop = () => {
  if (someElementTop.value) someElementTop.value.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="uptotop" :class="showToTop && 'dn'" @click="scrollToTop">
    <img :src="uparrow" alt="uparrow" />
  </div>
  <div
    style="background-color: #fff; padding: 0"
    :style="
      route.path.includes('board') ? 'height: calc(100vh - 170px)' : 'height: calc(100vh - 60px)'
    "
    class="OrganizationListView__mid mt0px"
    @scroll="scrolling"
  >
    <div class="mb10p mt10px" ref="someElementTop"></div>

    <div
      class="service__item cursor__pointer"
      v-for="(item, index) in dataSupportServices"
      :key="index"
    >
      <div
        @click="router.push({ path: pathTo, query: { id: item?.id } })"
        class="OrganizationPostsListView__content__top"
      >
        <div class="service__img">
          <img class="top__img__ProductReview" :src="item?.productImage" alt="img" />
          <div class="service__company"></div>
          <div class="companyName">
            {{ item?.companyName }}
          </div>
        </div>
        <div class="top__content__ProductReview">
          <div class="service__list__a">
            {{ item?.name }}
          </div>
          <div class="service__list__b mt10px">
            <label class="service__list__b__a" for=""> 지원대상</label>
            {{ item?.targetService }}
          </div>
          <div class="service__list__c mt4px">
            {{ moment(item?.createdDate).format(DATE_DOT) }} ~
            {{
              moment(
                new Date(moment(item?.createdDate).format(DATE_DOT)).setMonth(
                  new Date(moment(item?.createdDate).format(DATE_DOT)).getMonth() + 1
                )
              ).format(DATE_DOT)
            }}
          </div>
          <div class="service__list__d mt10px">
            {{ item?.description }}
          </div>
        </div>
      </div>
    </div>

    <div class="mt20px mb20px" v-if="isLoading">
      <Loading />
    </div>
  </div>
</template>

<style lang="scss">
.service__img {
  width: 100px;
  height: 100px;
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
    padding: 0 2px;
  }
}
.service__list__a {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  font-size: 15px;
  font-weight: normal;
  line-height: 18px;
  letter-spacing: -0.38px;
  color: #242a37;
  font-family: SpoqaHanSansNeo;
}
.service__list__b {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  font-size: 12px;
  font-weight: normal;
  line-height: 16px;
  letter-spacing: -0.3px;
  color: #52606d;
  font-family: SpoqaHanSansNeo;
  .service__list__b__a {
    font-weight: bold;
  }
}

.service__list__c {
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.3px;
  color: #52606d;
  font-family: SpoqaHanSansNeo;
}

.service__list__d {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;

  font-family: SpoqaHanSansNeo;
  font-size: 12px;
  font-weight: normal;
  line-height: 16px;
  letter-spacing: -0.3px;
  color: #9ba5b1;
}
</style>
