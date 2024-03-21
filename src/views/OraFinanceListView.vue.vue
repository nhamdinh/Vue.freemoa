<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue'
import Footer from '@/components/Footer.vue'
import uparrow from '@/assets/svg/uparrow.svg'
import OrganizationItem from '@/components/Organization/OrganizationItem.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import router from '@/router'
import tune_black_24dp from '@/assets/svg/tune_black_24dp.svg'
import left from '@/assets/svg/left.svg'
import FilterOrganization from '@/components/Filter/FilterOrganization.vue'
import NoticesCha from '@/components/CompanyNotices/NoticesCha.vue'
import NoticesCon from '@/components/CompanyNotices/NoticesCon.vue'
import { PAGESIZE_100, PAGESIZE_5 } from '@/common/constance'
import { handleUpdateFavorite } from '@/common/commonFunction'
import logomini from '@/assets/img/logomini.png'
import { storeToRefs } from 'pinia'
import { useCompanyStore } from '@/stores/company'

const storeCompany = useCompanyStore()
const { stIsFilter } = storeToRefs(storeCompany)
const { setIsFilter } = storeCompany

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const companyGroupId = urlParams.get('id')

const CompanyRepo = RepositoryFactory.get('company')
const dataCompany = ref<any>([])
const isLoading = ref<any>(false)

const currentPa = ref<any>(1)
const totalPa = ref<any>(1)
const params = ref<any>({
  orderSort: 'DESC',
  type: 'FINANCIAL',
  pageSize: PAGESIZE_5,
  pageNum: currentPa.value,
  companyGroupId: companyGroupId ?? -1
})
const height = ref<any>('173px')
const isSearch = ref<any>(false)
const existNoticesCha = ref<any>(false)
const existNoticesCon = ref<any>(false)

const onGetListCompany = async () => {
  isLoading.value = true
  await CompanyRepo.getListCompany({
    ...params.value
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        if (data?.data?.length >= 0) {
          if (isSearch.value) {
            dataCompany.value = data?.data
          } else {
            if (data?.totalCount % PAGESIZE_5 === 0) {
              totalPa.value = Math.floor(data?.totalCount / PAGESIZE_5)
            } else {
              totalPa.value = Math.floor(data?.totalCount / PAGESIZE_5 + 1)
            }
            dataCompany.value = [...dataCompany.value.concat(data?.data)]
          }
        }
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoading.value = false
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

watchEffect(() => {
  onGetListCompany()
})

const someElementTop = ref<any>()
const scrollToTop = () => {
  if (someElementTop.value) someElementTop.value.scrollIntoView({ behavior: 'smooth' })
}
const onGetListGroupsCompany = async () => {
  await CompanyRepo.getListGroupsCompany({
    pageSize: PAGESIZE_100,
    groupParent: companyGroupId
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        lastIndTags.value = data?.data.length - 0
        endPoint.value = data?.data.length - 4

        const tagAll = [
          {
            id: 0,
            companyGroupName: '전체'
          }
        ]
        tags.value = [...tagAll.concat(data?.data)]

        tagsRender.value = [...tagAll.concat(data?.data)]
      } else {
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}

const tags = ref<any>([])
const indexSlideTags = ref<any>(0)
const lastIndTags = ref<any>(1)
const endPoint = ref<any>(1)
const tagActive = ref<any>(0)

const tagsRender = ref<any>([])

watch(indexSlideTags, async (newV, oldV) => {
  if (indexSlideTags.value !== endPoint.value)
    tagsRender.value = [...tags.value].slice(indexSlideTags.value, lastIndTags.value + 1)
})
watch([existNoticesCha, existNoticesCon], async (newV, oldV) => {
  let bonus = (existNoticesCha.value ? 76 : 0) + (existNoticesCon.value ? 76 : 0)
  if (companyGroupId) {
    height.value = (246 + bonus).toString() + 'px'
  }
  // onGetListCompany()
})
watchEffect(() => {
  if (companyGroupId) onGetListGroupsCompany()
})
watchEffect(() => {
  let bonus = (existNoticesCha.value ? 76 : 0) + (existNoticesCon.value ? 76 : 0)
  if (companyGroupId) {
    height.value = (246 + bonus).toString() + 'px'
  }
})
</script>

<template>
  <div class="OrganizationListView">
    <FilterOrganization
      v-if="stIsFilter"
      :isFilter="stIsFilter"
      @setSearchTrue="isSearch = true"
      @closeFilter="setIsFilter({ stIsFilter: false })"
      @setParams="
        (aaa: any) => {
          params = { ...aaa, type: 'FINANCIAL' }
        }
      "
    ></FilterOrganization>
    <div class="OrganizationListView__content">
      <div class="uptotop" :class="showToTop && 'dn'" @click="scrollToTop">
        <img :src="uparrow" alt="uparrow" />
      </div>

      <div class="Header__main__logo">
        <div class="logo__a">
          <img class="logomini" :src="logomini" alt="logomini" />
        </div>
        <img
          @click="setIsFilter({ stIsFilter: true })"
          class="cursor__pointer iconx__right"
          :src="tune_black_24dp"
          width="24"
          alt="iconx"
        />
      </div>

      <div class="navigate mb15px">
        <div class="navigate__btn__enabled">금융기관 리스트</div>
        <div @click="router.push({ path: '/government-list' })" class="navigate__btn__disabled">
          지원기관 리스트
        </div>
      </div>

      <div class="from__home" v-if="companyGroupId">
        <NoticesCha
          :companyGroupId="companyGroupId"
          @setNoticesCha="
            (isExist) => {
              existNoticesCha = isExist
            }
          "
        ></NoticesCha>
        <div class="slider pt14px pb14px" style="background-color: #f1f2f6; height: 73px">
          <section
            :class="tagActive === item?.id ? 'tag__item__active' : 'tag__item__passive'"
            v-for="(item, index) in tagsRender"
            :key="index"
            @click="
              () => {
                tagActive = item?.id
              }
            "
          >
            {{ item?.companyGroupName }}
          </section>
        </div>

        <!--         <div
          class="tag__list pt20px pb14px"
          :class="
            indexSlideTags === endPoint ? 'flex__end pr16px' : indexSlideTags === 0 ? 'pl16px' : ''
          "
          style="background-color: #f1f2f6; height: 73px"
          draggable="false"
          v-touch:swipe.left="
            () => {
              indexSlideTags = indexSlideTags + 1
              if (indexSlideTags < 0) {
                indexSlideTags = 0
              }
              if (indexSlideTags > endPoint) {
                indexSlideTags = endPoint
              }
            }
          "
          v-touch:swipe.right="
            () => {
              indexSlideTags = indexSlideTags - 1
              if (indexSlideTags < 0) {
                indexSlideTags = 0
              }
              if (indexSlideTags > endPoint) {
                indexSlideTags = endPoint
              }
            }
          "
        >
          <div
            :class="tagActive === item?.id ? 'tag__item__active' : 'tag__item__passive'"
            v-for="(item, index) in tagsRender"
            :key="index"
            @click="
              () => {
                tagActive = item?.id
              }
            "
          >
            {{ item?.companyGroupName }}
          </div>
        </div> -->
        <NoticesCon
          :tagActive="tagActive"
          @setNoticesCon="
            (isExist) => {
              existNoticesCon = isExist
            }
          "
        ></NoticesCon>
      </div>

      <div
        class="OrganizationListView__mid"
        @scroll="scrolling"
        :style="`height: calc(100vh - ${height}) !important`"
      >
        <div class="mt14px" ref="someElementTop"></div>
        <OrganizationItem
          :organization="'Financial'"
          :isLoading="isLoading"
          :dataCompany="dataCompany"
          @onGetDataCompany="
            (id: any) => {
              dataCompany = handleUpdateFavorite(id, dataCompany)
            }
          "
        ></OrganizationItem>
      </div>
      <Footer :active="4"></Footer>
    </div>
  </div>
</template>

<style lang="scss">
.OrganizationListView {
  width: 100%;
  position: relative;

  .OrganizationListView__content {
  }
  ::-webkit-scrollbar {
    width: 0.4em;
    height: 0.4em;
    position: absolute;
    right: 0;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #c4c7ca;
  }

  ::-webkit-scrollbar-track {
    background: #f1f2f3;
  }
}
</style>
