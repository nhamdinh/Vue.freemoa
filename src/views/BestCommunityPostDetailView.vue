<script setup lang="ts">
import Header from '@/components/Header.vue'
import PostDetail from '@/components/PostDetail/PostDetail.vue'
import { ref, watch, watchEffect } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import uparrow from '@/assets/svg/uparrow.svg'
import router from '@/router'
import { useRoute } from 'vue-router'
import { dataArticleIds_STORAGE, fromPath_STORAGE } from '@/common/constance'
import { getPre, getNext } from '@/common/commonFunction'

const category = ref<any>('')
const categoryName = ref<any>('')
const back = ref<any>('/board-list')

const CompanyRepo = RepositoryFactory.get('company')

const onGetListTags = async () => {
  await CompanyRepo.getListTags({
    code: category.value
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        categoryName.value = data?.data[0]?.name ?? ''
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}

const route = useRoute()

const articleId = ref<any>(route.query?.id)
const nextId = ref<any>(route.query?.nextId)
const previousId = ref<any>(route.query?.previousId)

const ArticleRepo = RepositoryFactory.get('article')
const isLoading = ref<any>(false)
const dataFetch = ref<any>({})

const onGetArticleById = async () => {
  isLoading.value = true

  await ArticleRepo.getArticleById({
    articleId: articleId.value,
    nextId: nextId.value,
    previousId: previousId.value
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        dataFetch.value = data?.data
        // emits('setCategory', data?.data.detail?.category)
        category.value = data?.data.detail?.category
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  isLoading.value = false
}
watch(route, async (newV, oldV) => {
  articleId.value = route.query?.id ?? ''
  nextId.value = route.query?.nextId ?? ''
  previousId.value = route.query?.previousId ?? ''
})

watchEffect(() => {
  if (articleId.value) onGetArticleById()
})
watchEffect(() => {
  if (category.value) onGetListTags()
})
const dataArticleIds = ref<any>([])

watchEffect(() => {
  const dataArticleIds_temp = localStorage.getItem(dataArticleIds_STORAGE)
  if (dataArticleIds_temp) {
    dataArticleIds.value = dataArticleIds_temp.split(',')
  }
})

watchEffect(() => {
  const fromPath_temp = localStorage.getItem(fromPath_STORAGE)
  if (fromPath_temp) {
    back.value = fromPath_temp
  }
})

const morePrevious = ref<any>(false)
const moreNext = ref<any>(false)

const someElementTop = ref<any>()
const scrollToTop = () => {
  if (someElementTop.value) someElementTop.value.scrollIntoView({ behavior: 'smooth' })
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
  {{ console.log(back) }}
  <div class="BestCommunityPostDetailView">
    <Header :back="back" :icon="2" :title="categoryName"></Header>
    <div class="uptotop" :class="showToTop && 'dn'" @click="scrollToTop">
      <img :src="uparrow" alt="uparrow" />
    </div>
    <Loading v-if="isLoading" />
    <div
      v-else
      class="BestCommunityPostDetailView__content wrapper__main mt0px"
      style="max-height: calc(100vh - 56px)"
      @scroll="scrolling"
    >
      <div class=" " ref="someElementTop"></div>

      <PostDetail
        :item="dataFetch?.detail"
        @onGetArticleById="onGetArticleById"
        :fromPath="'best-community-post'"
      ></PostDetail>
      <div class="end__box360"></div>
      <div class="next__previous mt10px">
        <div
          class="previous"
          :class="dataFetch?.previous?.title ? '' : 'dn'"
          @click="
            router.push({
              path: 'best-community-post-detail',
              query: {
                id: dataFetch?.previous?.id,
                previousId: getPre(dataArticleIds, dataFetch?.previous?.id),
                nextId: getNext(dataArticleIds, dataFetch?.previous?.id)
              }
            })
          "
        >
          <div class="next__previous__label">이전글</div>
          <div class="next__previous__value">{{ dataFetch?.previous?.title }}</div>
        </div>
        <!--         <PostDetail
          v-if="morePrevious && dataFetch?.previous"
          :item="dataFetch?.previous"
          @onGetArticleById="onGetArticleById"
          :fromPath="'best-community-post'"
        ></PostDetail> -->
        <div
          class="next"
          :class="dataFetch?.next?.title ? '' : 'dn'"
          @click="
            router.push({
              path: 'best-community-post-detail',
              query: {
                id: dataFetch?.next?.id,
                previousId: getPre(dataArticleIds, dataFetch?.next?.id),
                nextId: getNext(dataArticleIds, dataFetch?.next?.id)
              }
            })
          "
        >
          <div class="next__previous__label">다음글</div>
          <div class="next__previous__value">{{ dataFetch?.next?.title }}</div>
        </div>
        <!--         <PostDetail
          v-if="moreNext && dataFetch?.next"
          :item="dataFetch?.next"
          @onGetArticleById="onGetArticleById"
          :fromPath="'best-community-post'"
        ></PostDetail> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.BestCommunityPostDetailView {
  width: 100%;
  min-height: calc(100vh - 10px);
}
.BestCommunityPostDetailView__content {
  // min-height: calc(100vh - 60px);
  background-color: #fff;
  .end__box328 {
    width: 328px;
    margin: 0 auto;
    border-top: 1px solid #cbd2da;
  }
  .end__box326 {
    width: 326px;
    margin: 0 auto;
    border-top: 1px solid #cbd2da;
  }
  .end__box360 {
    width: 359px;
    margin: 0 auto;
    border-top: 10px solid #f1f2f6;
  }
  .end__box360_2 {
    width: 360px;
    margin: 0 auto;
    border-top: 1px solid #cbd2da;
  }

  .post__chat {
    display: flex;
    flex-direction: column;
    padding: 0 16px;
    .post__chat__item {
      display: flex;
      flex-direction: column;
      .item__main {
        display: flex;
        gap: 10px;
        padding: 16px 0;
        position: relative;

        .item__main__action {
          position: absolute;
          top: 14px;
          right: 0;
          cursor: pointer;
        }
        .user__avatar {
          width: 31px;
          height: 31px;
          min-width: 31px;
          min-height: 31px;
          max-width: 31px;
          max-height: 31px;
          border: solid 0.5px #464646;
          border-radius: 50%;
          background-position: center center;
          object-fit: cover;
          background-size: cover;
        }
      }
    }
  }

  .card__top {
    width: 359px;
    padding: 16px;
    background-color: #fff;
    .card__top__title {
      font-family: SpoqaHanSansNeo;
      font-size: 20px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: -0.5px;
      color: #000;
      padding-right: 77px;
    }
    .card__top__zzz {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card__top__info {
      display: flex;
      align-items: center;
      gap: 10px;
      .position__main {
        .position__main__label {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: normal;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #9ba5b1;
        }
        .position__main__value {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: bold;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #52606d;
        }
      }
      .avatar__manager {
        display: flex;
        align-items: center;
        gap: 4px;
        .avatar {
          border-radius: 50%;
          width: 30px;
          height: 30px;
          min-width: 30px;
          min-height: 30px;
        }
        .manager {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: -0.3px;
          text-align: left;
          color: #52606d;
        }
      }
      .createdDate {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #52606d;
      }
      .icon__eye__viewNumber {
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
        .icon__eye {
          width: 16px;
          height: 16px;
        }
        // .viewNumber {
        //   font-family: SpoqaHanSansNeo;
        //   font-size: 12px;
        //   font-weight: 500;
        //   line-height: 16px;
        //   letter-spacing: -0.3px;
        //   color: #52606d;
        // }
      }
    }
  }

  .card__bottom {
    padding: 0 16px;
    background-color: #fff;
    padding-top: 30px;
    padding-bottom: 20px;
    .image {
      width: 328px;
      height: 201px;
      min-width: 328px;
      min-height: 201px;
      border-radius: 10px;
      background-position: center center;
      object-fit: cover;
      background-repeat: no-repeat;
      background-size: cover;
      background-attachment: fixed;
    }
    .content {
      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: normal;
      line-height: 20px;
      letter-spacing: -0.38px;
      color: #242a37;
      white-space: pre-wrap;
    }
  }

  .next__previous {
    //   padding: 0 16px;
    background-color: #fff;
    .next__previous__label {
      min-width: 36px;
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #000;
      cursor: pointer;
    }
    .next__previous__value {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #000;

      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .previous {
      padding: 10px 16px;
      display: flex;
      gap: 14px;
      align-items: center;
      min-height: 34px;
      border-bottom: solid 1px #cbd2da;
      cursor: pointer;
    }
    .next {
      padding: 10px 16px;
      display: flex;
      gap: 14px;
      align-items: center;
      min-height: 34px;
      border-bottom: solid 1px #cbd2da;
      cursor: pointer;
    }
  }
}
</style>
