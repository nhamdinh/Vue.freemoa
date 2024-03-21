<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { COMMUNITY, PAGESIZE_10, PAGESIZE_100, dataArticleIds_STORAGE } from '@/common/constance'
import Loading from '@/components/Loading.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import ArticleItem from '@/components/Article/ArticleItem.vue'
import uparrow from '@/assets/svg/uparrow.svg'
import { useRoute } from 'vue-router'
import pluswhite24 from '@/assets/svg/pluswhite24.svg'
import router from '@/router'

const props = defineProps(['pathTo', 'articleType', 'communitySearchType', 'communityCategory'])
const route = useRoute()
const dataArticle = ref<any>([])
const dataArticleIds = ref<any>([])

const ArticleRepo = RepositoryFactory.get('article')

const params = ref<any>({
  orderSort: 'DESC',
  pageSize: PAGESIZE_10,
  pageNum: 1,
  articleType: props.articleType
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
const isLoading = ref<any>(false)

const onGetArticleList = async () => {
  isLoading.value = true

  let payload: any = {
    ...params.value
  }
  if (props.articleType === COMMUNITY) {
    if (props.communitySearchType === 'ALL') {
      payload = {
        ...payload,
        communitySearchType: props.communitySearchType,
        communityCategory: props.communityCategory
      }
    } else {
      payload = {
        ...payload,
        communitySearchType: props.communitySearchType
      }
    }
  }

  await ArticleRepo.getArticleList({
    // NOTIFICATION(1, "NOTIFICATION"),
    // NEWS(2, "NEWS"),
    // NOTICE_BOARD(3, "NOTICE_BOARD"),
    // COMMUNITY(4, "COMMUNITY"),
    // PRODUCT_REVIEW(5, "PRODUCT_REVIEW"),
    // POST(6, "POST");
    ...payload
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
          let dataArticle_temp: any = [...dataArticle.value.concat(data?.data)]
          // let dataArticleIds_temp: any = []
          dataArticle.value = dataArticle_temp
          // dataArticle_temp.map((item: any) => {
          //   dataArticleIds_temp.push(item?.id)
          // })
          // dataArticleIds.value = dataArticleIds_temp
          // localStorage.setItem(dataArticleIds_STORAGE, dataArticleIds_temp)
        }
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoading.value = false
}

const onGetArticleList100 = async () => {
  let payload: any = {
    ...params.value,
    pageSize: PAGESIZE_100,
    pageNum: 1
  }
  if (props.articleType === COMMUNITY) {
    if (props.communitySearchType === 'ALL') {
      payload = {
        ...payload,
        communitySearchType: props.communitySearchType,
        communityCategory: props.communityCategory
      }
    } else {
      payload = {
        ...payload,
        communitySearchType: props.communitySearchType
      }
    }
  }

  await ArticleRepo.getArticleList({
    // NOTIFICATION(1, "NOTIFICATION"),
    // NEWS(2, "NEWS"),
    // NOTICE_BOARD(3, "NOTICE_BOARD"),
    // COMMUNITY(4, "COMMUNITY"),
    // PRODUCT_REVIEW(5, "PRODUCT_REVIEW"),
    // POST(6, "POST");
    ...payload
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        if (data?.data?.length > 0) {
          let dataArticle_temp: any = data?.data
          let dataArticleIds_temp: any = []
          dataArticle_temp.map((item: any) => {
            dataArticleIds_temp.push(item?.id)
          })
          dataArticleIds.value = dataArticleIds_temp
          localStorage.setItem(dataArticleIds_STORAGE, dataArticleIds_temp)
        }
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}

const handleUpdateLike = (id: any) => {
  let arrr1: any = [...dataArticle.value]
  let arrr2: any = []
  arrr1.map((item: any) => {
    if (item?.id === id) {
      let coefficient = 1
      if (item?.isLike) {
        coefficient = -1
      }
      arrr2.push({
        ...item,
        isLike: !item?.isLike,
        totalLikes: item?.totalLikes + coefficient
      })
    } else {
      arrr2.push(item)
    }
  })
  dataArticle.value = [...arrr2]
}

watchEffect(() => {
  onGetArticleList()
})

watchEffect(() => {
  onGetArticleList100()
})
const someElementTop = ref<any>()

const scrollToTop = () => {
  if (someElementTop.value) someElementTop.value.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <!-- {{ console.log(dataArticleIds) }} -->
  <div
    class="uptotop"
    @click="router.push({ path: `/post-create` })"
    v-if="route.path.includes('board')"
  >
    <img :src="pluswhite24" alt="uparrow" />
  </div>
  <div class="uptotop" @click="scrollToTop" :class="showToTop && 'dn'" v-else>
    <img :src="uparrow" alt="uparrow" />
  </div>
  <div
    style="background-color: #fff; padding: 0"
    :style="
      route.path.includes('board') ? 'height: calc(100vh - 180px)' : 'height: calc(100vh - 60px)'
    "
    class="OrganizationListView__mid mt0px"
    @scroll="scrolling"
  >
    <div class=" " ref="someElementTop"></div>
    <ArticleItem
      v-for="(item, index) in dataArticle"
      :key="index"
      :item="item"
      :pathTo="pathTo"
      :dataArticleIds="dataArticleIds"
      @getArticleList="
        (id: any) => {
          handleUpdateLike(id)
        }
      "
    ></ArticleItem>
    <div class="mt20px mb20px" v-if="isLoading">
      <Loading />
    </div>
  </div>
</template>

<style lang="scss">
.OrganizationPostsListView {
  width: 100%;
}
.fw600 {
  font-weight: 600 !important;
}
.list__img {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.top__img__ProductReview {
  width: 100px;
  height: 100px;
  min-width: 100px;
  min-height: 100px;
  border-radius: 10px;
  background-position: center center;
  object-fit: cover;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
@mixin status__label {
  width: 58px;
  height: 19px;
  border-radius: 9.5px;

  font-family: SpoqaHanSansNeo;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.3px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.status__label__ena {
  @include status__label;
  border: solid 1px #1767b3;
  color: #1767b3;
}
.status__label__dis {
  @include status__label;
  border: solid 1px #9ba5b1;
  color: #9ba5b1;
}
.createdDate {
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: SpoqaHanSansNeo;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.3px;
  color: #9ba5b1;
}
.end__block__line {
  background-color: #f1f2f6;
  width: 100%;
  .end__block {
    margin: 0 auto;
    width: 328px;
    height: 1px;
    background-color: #cbd2da;
  }
}

.OrganizationPostsListView__content__question {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;
  padding: 20px 16px;
  background-color: #f1f2f6;
  .question {
    font-family: SpoqaHanSansNeo;
    font-size: 15px;
    font-weight: normal;
    line-height: 20px;
    letter-spacing: -0.38px;
    color: #242a37;
  }
}

.OrganizationPostsListView__content__answer {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;
  padding: 20px 16px;
  background-color: #f1f2f6;
  border-bottom: 1px solid #cbd2da;

  .answer {
    font-family: SpoqaHanSansNeo;
    font-size: 15px;
    font-weight: normal;
    line-height: 20px;
    letter-spacing: -0.38px;
    color: #242a37;
  }
  .admin__avatar {
    display: flex;
    gap: 6px;
    align-items: center;
    .avatar {
      border-radius: 50%;
      width: 30px;
      height: 30px;
      min-width: 30px;
      min-height: 30px;
    }
    .admin__name {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #52606d;
    }
  }
}

.OrganizationPostsListView__content__top {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  padding: 20px 16px;
  border-bottom: 1px solid #cbd2da;
  cursor: pointer;
  .top__content__ProductReview {
    .content__ProductReview__a {
      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: normal;
      line-height: 20px;
      color: #242a37;

      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .content__ProductReview__b {
      display: flex;
      gap: 6px;
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #9ba5b1;
    }
    .content__ProductReview__c {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #9ba5b1;
      div {
        display: flex;
        align-items: center;
        gap: 2px;
      }
    }
  }
}

.OrganizationPostsListView__content__bottom {
  padding: 20px 16px;
  border-bottom: 1px solid #cbd2da;
  .content__bottom__a {
    font-family: SpoqaHanSansNeo;
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    letter-spacing: -0.38px;
    color: #242a37;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .content__bottom__b {
    display: flex;
    align-items: center;
    gap: 6px;

    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: -0.3px;
    color: #9ba5b1;

    div {
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }
}
</style>
