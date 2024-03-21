<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import Header from '@/components/Header.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import PostDetail from '@/components/PostDetail/PostDetail.vue'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const articleId = urlParams.get('id')

const ArticleRepo = RepositoryFactory.get('article')
const isLoading = ref<any>(true)
const dataFetch = ref<any>({})

const onGetArticleById = async () => {
  isLoading.value = true
  await ArticleRepo.getArticleById({
    articleId
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
  onGetArticleById()
})
const morePrevious = ref<any>(false)
const moreNext = ref<any>(false)
</script>

<template>
  <!-- XOAAAAAAAAAAA -->

  <div class="WhatNewDetailView">
    <Header :back="'/what-new-list'" :icon="2" :title="'새소식'"></Header>
    <Loading v-if="isLoading" />
    <div v-else class="BestCommunityPostDetailView__content">
      <PostDetail
        :item="dataFetch?.detail"
        @onGetArticleById="onGetArticleById"
        :fromPath="'what-new'"
      ></PostDetail>
      <div class="end__box360"></div>
      <div class="next__previous mt10px">
        <div class="previous" @click="morePrevious = !morePrevious">
          <div class="next__previous__label">이전글</div>
          <div class="next__previous__value">{{ dataFetch?.previous?.title }}</div>
        </div>
        <PostDetail
          v-if="morePrevious && dataFetch?.previous"
          :item="dataFetch?.previous"
          @onGetArticleById="onGetArticleById"
          :fromPath="'what-new'"
        ></PostDetail>
        <div class="next" @click="moreNext = !moreNext">
          <div class="next__previous__label">다음글</div>
          <div class="next__previous__value">{{ dataFetch?.next?.title }}</div>
        </div>
        <PostDetail
          v-if="moreNext && dataFetch?.next"
          :item="dataFetch?.next"
          @onGetArticleById="onGetArticleById"
          :fromPath="'what-new'"
        ></PostDetail>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.WhatNewDetailView {
  width: 100%;
  min-height: calc(100vh - 10px);
}
</style>
