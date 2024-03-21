<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue'
import Footer from '@/components/Footer.vue'
import uparrow from '@/assets/svg/uparrow.svg'
import OrganizationItem from '@/components/Organization/OrganizationItem.vue'
import router from '@/router'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import FilterCompany from '@/components/Filter/FilterCompany.vue'
import NoticesCha from '@/components/CompanyNotices/NoticesCha.vue'
import NoticesCon from '@/components/CompanyNotices/NoticesCon.vue'
import { PAGESIZE_100, PAGESIZE_5 } from '@/common/constance'
import { handleUpdateFavorite } from '@/common/commonFunction'
import tune_black_24dp from '@/assets/svg/tune_black_24dp.svg'
import logomini from '@/assets/img/logomini.png'
import { storeToRefs } from 'pinia'
import { useCompanyStore } from '@/stores/company'

const storeCompany = useCompanyStore()
const { stIsFilter } = storeToRefs(storeCompany)
const { setIsFilter } = storeCompany

const CompanyRepo = RepositoryFactory.get('company')

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const companyGroupId = urlParams.get('id')
const dataCompany = ref<any>([])

const currentPa = ref<any>(1)
const totalPa = ref<any>(1)
const params = ref<any>({
  type: 'MEMBER',
  orderSort: 'DESC',
  pageSize: PAGESIZE_5,
  pageNum: currentPa.value,
  companyGroupId: companyGroupId ?? -1
})

const height = ref<any>('173px')
const isSearch = ref<any>(false)
const isLoading = ref<any>(false)
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
watch(params, async (newV, oldV) => {
  // onGetListCompany()
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
  <div class="CompanyListView">
    <FilterCompany
      v-if="stIsFilter"
      :isFilter="stIsFilter"
      @setSearchTrue="isSearch = true"
      @closeFilter="setIsFilter({ stIsFilter: false })"
      @setParams="
        (aaa: any) => {
          params = { ...aaa, type: 'MEMBER' }
        }
      "
    ></FilterCompany>
    <div class="CompanyListView__content">
      <div class="uptotop" :class="showToTop && 'dn'" @click="scrollToTop">
        <img :src="uparrow" alt="uparrow" />
      </div>
      <!--       <Header :icon="2" :title="'회원사'" :iconRight="1"></Header>
 -->

      <div class="Header__main__logo">
        <div class="logo__a">
          <img class="logomini" :src="logomini" alt="logomini" />
        </div>
        <img
          @click="stIsFilter = true"
          class="cursor__pointer iconx__right"
          :src="tune_black_24dp"
          width="24"
          alt="iconx"
        />
      </div>

      <div class="navigate mb15px">
        <div class="navigate__btn__enabled">회원사 리스트</div>
        <div @click="router.push({ path: `/room-chat-list` })" class="navigate__btn__disabled">
          채팅방 리스트
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

        <!-- 
        <div
          class="tag__list pt20px pb14px zzzaaa"
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
            class="conconco"
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
        :style="`height: calc(100vh - ${height}) !important`"
        @scroll="scrolling"
      >
        <div class="mt14px" ref="someElementTop"></div>
        <OrganizationItem
          :isLoading="isLoading"
          :type="'company'"
          :dataCompany="dataCompany"
          @onGetDataCompany="
            (id: any) => {
              dataCompany = handleUpdateFavorite(id, dataCompany)
            }
          "
        ></OrganizationItem>
      </div>

      <Footer :active="1"></Footer>
    </div>
  </div>
</template>
<style lang="scss">
.slider {
  scroll-snap-type: x mandatory;
  display: flex;
  -webkit-overflow-scrolling: touch;
  overflow-x: scroll;

  display: flex;
  // justify-content: flex-end;
  gap: 10px;
  flex-wrap: nowrap;
  width: 100%;
  section {
    scroll-snap-align: start;
  }
  section:last-child {
    margin-right: 16px;
  }
}
.slider::-webkit-scrollbar {
  display: none;
}
.slider {
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  overflow-y: scroll;
}

.CompanyListView {
  width: 100%;
  position: relative;

  .CompanyListView__content {
  }
}

.__noticesCha {
  /* have to have a height */
  min-height: 72px;
  overflow: hidden;
  display: flex;
  position: relative;

  .notice__lv1 {
    height: 72px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    box-shadow: 0 0 6px 0 rgba(71, 133, 185, 0.2);
    background-color: #fff;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 360px;
    min-width: 360px;
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.1s linear;
  }
}
.__noticesCon {
  /* have to have a height */
  min-height: 72px;
  width: 328px;
  min-width: 328px;
  overflow: hidden;
  display: flex;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  .notice__lv2 {
    // margin: 0 auto;
    height: 72px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    box-shadow: 0 0 6px 0 rgba(71, 133, 185, 0.2);
    background-color: #fff;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 328px;
    min-width: 328px;
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.1s linear;
  }
}

.notice__lv1__a {
  display: flex;
  gap: 4px;

  font-family: SpoqaHanSansNeo;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.38px;
  color: #242a37;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  .lv1__a__title {
    font-family: SpoqaHanSansNeo;
    font-size: 15px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.38px;
    color: #f58220;
  }
}

.notice__lv1__b {
  font-family: SpoqaHanSansNeo;
  font-size: 12px;
  font-weight: normal;
  line-height: 16px;
  letter-spacing: -0.3px;
  color: #9ba5b1;

  display: flex;
  gap: 8px;
}
.blur {
  position: absolute;
  z-index: 98;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
  background-color: #b1b1b1;
  opacity: 0.6;
}
</style>
