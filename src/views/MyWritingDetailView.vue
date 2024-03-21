<script setup lang="ts">
import Header from '@/components/Header.vue'
// import eyenau from '@/assets/img/eyenau.png'
import PostDetail from '@/components/PostDetail/PostDetail.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { ref, watch, watchEffect } from 'vue'
import Loading from '@/components/Loading.vue'
import uparrow from '@/assets/svg/uparrow.svg'
import router from '@/router'
import { useRoute } from 'vue-router'
import { dataArticleIds_STORAGE } from '@/common/constance'
import { getPre, getNext } from '@/common/commonFunction'

const route = useRoute()
const articleId = ref<any>(route.query?.id)
const nextId = ref<any>(route.query?.nextId)
const previousId = ref<any>(route.query?.previousId)

watch(route, async (newV, oldV) => {
  articleId.value = route.query?.id ?? ''
  nextId.value = route.query?.nextId ?? ''
  previousId.value = route.query?.previousId ?? ''
})

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
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoading.value = false
}
watchEffect(() => {
  if (articleId.value) onGetArticleById()
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

const dataArticleIds = ref<any>([])

watchEffect(() => {
  const dataArticleIds_temp = localStorage.getItem(dataArticleIds_STORAGE)
  if (dataArticleIds_temp) {
    dataArticleIds.value = dataArticleIds_temp.split(',')
  }
})
</script>

<template>
  <div class="BestCommunityPostDetailView">
    <Header :back="'/my-writing-list'" :icon="2" :title="'내 작성글'"></Header>
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
        :fromPath="'my-writing'"
      ></PostDetail>
      <div class="end__box360"></div>
      <div class="next__previous mt10px">
        <div
          class="previous"
          :class="dataFetch?.previous?.title ? '' : 'dn'"
          @click="
            router.push({
              path: 'my-writing-detail',
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
        <!-- <PostDetail
          v-if="morePrevious && dataFetch?.previous"
          :item="dataFetch?.previous"
          @onGetArticleById="onGetArticleById"
          :fromPath="'my-writing'"
        ></PostDetail> -->
        <div
          class="next"
          :class="dataFetch?.next?.title ? '' : 'dn'"
          @click="
            router.push({
              path: 'my-writing-detail',

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
        <!-- <PostDetail
          v-if="moreNext && dataFetch?.next"
          :item="dataFetch?.next"
          @onGetArticleById="onGetArticleById"
          :fromPath="'my-writing'"
        ></PostDetail> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
