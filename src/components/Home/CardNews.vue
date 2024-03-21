<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import right from '@/assets/svg/right.svg'
import news from '@/assets/img/news.png'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import router from '@/router'
import Loading from '@/components/Loading.vue'
import Skeleton from '@/components/skeleton/Skeleton.vue'

import { NEWS } from '@/common/constance'

const dataNews = ref<any>([])

const ArticleRepo = RepositoryFactory.get('article')
const isLoading = ref<any>(false)

const onGetArticleList = async () => {
  let payload: any = {
    articleType: NEWS
  }
  isLoading.value = true

  await ArticleRepo.getArticleList({
    ...payload,
    pageSize: 10,
    pageNum: 1,
    orderSort: 'DESC'
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        console.log(data?.data)
        // let dataFetch: any = data?.data ?? []
        // let arrEmpty: any = []
        // dataFetch.map((item: any) => {
        //   arrEmpty.push({ ...item, stars: 4, role: '컨설팅 지원' })
        // })
        dataNews.value = data?.data
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoading.value = false
}

watchEffect(() => {
  onGetArticleList()
})
</script>

<template>
  <div class="home__row mt40px mr16px ml16px">
    <div class="title">오늘의 NEWS</div>
    <div class="see__more cursor__pointer" @click="router.push({ path: '/what-new-list' })">
      <div class="see__more__text">더보기</div>

      <img :src="right" alt="right" />
    </div>
  </div>

  <Loading v-if="isLoading" />
  <Skeleton v-if="isLoading" />

  <div class="df__center mt20px">
    <div class="img__text" v-for="(item, index) in 1" :key="index">
      <img class="news" :src="news" alt="news" />
      <div class="qwe">
        <div class="text__a">
          <div class="text__a__a">7월 말까지</div>
          <div class="text__a__b">얼리버드 할인!</div>
        </div>
        <div class="text__b mt5px">
          <div class="text__b__c">굿모닝 CEO 오아시스</div>
          <div class="text__b__d">9기 대모집</div>
        </div>
        <div class="text__b mt17px">
          <div class="text__b__e">
            <div class="bold__176">2</div>
            월
            <div class="bold__176">23</div>
            일까지 모집
          </div>
          <div class="text__b__f">고려대학교 총장명의 수료증</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.img__text {
  position: relative;
  cursor: pointer;
  .news {
    position: absolute;
    width: 328px;
  }
  .qwe {
    width: 328px;
    position: relative;
    padding: 20px;
    .text__a {
      display: flex;
      .text__a__a {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #242a37;
      }
      .text__a__b {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #1867b3;
      }
    }
    .text__b {
      .text__b__c {
        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-weight: normal;
        line-height: 18px;
        letter-spacing: -0.38px;
        color: #242a37;
      }
      .text__b__d {
        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-weight: bold;
        line-height: 18px;
        letter-spacing: -0.38px;
        color: #006ed6;
      }
      .text__b__e {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #242a37;
        display: flex;
        .bold__176 {
          font-weight: bold;
          color: #1767b3;
        }
      }
      .text__b__f {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #242a37;
      }
    }
  }
}
</style>
