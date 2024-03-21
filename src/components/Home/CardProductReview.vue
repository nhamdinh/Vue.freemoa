<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from 'vue'
import router from '@/router'
import Loading from '@/components/Loading.vue'
import star from '@/assets/svg/star.svg'
import starborder from '@/assets/svg/starborder.svg'
import right from '@/assets/svg/right.svg'
import Skeleton from '@/components/skeleton/Skeleton.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { AVA, PRODUCT_REVIEW, SLIDE_5000 } from '@/common/constance'

const dataProductReview = ref<any>([
  //   {
  //     stars: 1,
  //     role: '컨설팅 지원',
  //     category: '**기업/중소기업',
  //     createdBy: 'Joel',
  //     content: '메인비즈로부터 받은 컨설팅은 친절하고 구체적인'
  //   }
])

const ArticleRepo = RepositoryFactory.get('article')
const isLoading = ref<any>(false)

const onGetArticleList = async () => {
  let payload: any = {
    articleType: PRODUCT_REVIEW
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
        let dataFetch: any = data?.data ?? []
        let arrEmpty: any = []
        dataFetch.map((item: any) => {
          arrEmpty.push({ ...item, role: '컨설팅 지원' })
        })
        dataProductReview.value = arrEmpty
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoading.value = false
}

const indexSlide = ref<any>(0)
const lastInd = ref<any>(1)
const touch = ref<any>('')

watch([dataProductReview, indexSlide], async (newV, oldV) => {
  const lastIndex = dataProductReview.value.length - 1
  lastInd.value = lastIndex

  if (indexSlide.value < 0) {
    indexSlide.value = lastIndex
  }
  if (indexSlide.value > lastIndex) {
    indexSlide.value = 0
  }
})

let slider: any = null

watchEffect(() => {
  slider = setInterval(() => {
    indexSlide.value += 1
  }, SLIDE_5000)
  return () => clearInterval(slider)
})

watch(touch, async (newQuestion, oldQuestion) => {
  clearInterval(slider)
  slider = setInterval(() => {
    indexSlide.value += 1
  }, SLIDE_5000)
  return () => clearInterval(slider)
})

watchEffect(() => {
  onGetArticleList()
})
</script>

<template>
  <!-- {{ console.log(touch) }} -->
  <div class="home__row mr16px ml16px">
    <div class="title">상생 상품 리뷰</div>
    <div class="see__more cursor__pointer" @click="router.push({ path: '/product-review-list' })">
      <div class="see__more__text">더보기</div>

      <img :src="right" alt="right" />
    </div>
  </div>
  <Loading v-if="isLoading" />
  <Skeleton v-if="isLoading" />
  <div class="best__review mt20px" v-else>
    <article
      @click="router.push({ path: '/product-review-detail', query: { id: item?.id } })"
      v-for="(item, personIndex) in dataProductReview"
      :key="personIndex"
      :class="
        indexSlide === personIndex
          ? 'activeSlide'
          : personIndex === indexSlide - 1 ||
            (indexSlide === 0 && personIndex === dataProductReview.length - 1)
          ? 'nextSlide'
          : 'lastSlide'
      "
      draggable="false"
      v-touch:swipe.left="
        () => {
          touch = Date.now().toString()

          indexSlide = indexSlide - 1
          if (indexSlide < 0) {
            indexSlide = lastInd
          }
          if (indexSlide > lastInd) {
            indexSlide = 0
          }
        }
      "
      v-touch:swipe.right="
        () => {
          touch = Date.now().toString()

          indexSlide = indexSlide + 1
          if (indexSlide < 0) {
            indexSlide = lastInd
          }
          if (indexSlide > lastInd) {
            indexSlide = 0
          }
        }
      "
    >
      <div class="best__review__a">
        <div class="stars">
          <img
            v-for="(ite, index) in Number(item?.point.toFixed()) ?? 0"
            :key="index"
            :src="star"
            alt=""
          />
          <img
            v-for="(ite, index) in 5 - Number(item?.point.toFixed()) ?? 0"
            :key="index"
            :src="starborder"
            alt=""
          />
        </div>
        <div class="type">{{ item?.category }}</div>
      </div>
      <div class="best__review__b mt10px">
        <img class="avatarman" :src="item?.avatarCreatedBy ?? AVA" alt="avatarman" />
        <div class="best__review__desc">
          <div class="name">{{ item?.createdBy }}</div>
          <div class="role">{{ item?.role }}</div>
        </div>
      </div>
      <div class="best mt16px">BEST</div>
      <div class="best__review__c mt6px">
        {{ item?.content }}
      </div>
    </article>
  </div>
</template>

<style lang="scss">
.best__review {
  /* have to have a height */
  height: 197px;
  overflow: hidden;
  display: flex;
  margin-left: 16px;
  position: relative;
  article.activeSlide {
    opacity: 1;
    transform: translateX(0);
  }
  article.lastSlide {
    opacity: 0;
    transform: translateX(-100%);
  }
  article.nextSlide {
    opacity: 1;
    transform: translateX(calc(100% + 10px));
  }
  article {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: all 0.15s linear;

    width: 310px;
    min-width: 310px;
    height: 197px;
    border-radius: 10px;
    box-shadow: 0 0 6px 0 rgba(71, 133, 185, 0.2);
    background-color: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    .best__review__a {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .type {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #52606d;
      }
    }

    .best__review__b {
      height: 44px;
      border-left: 1px solid #9ba5b1;
      display: flex;
      gap: 7px;
      padding-left: 7px;
      .avatarman {
        width: 44px;
        height: 44px;
        min-width: 44px;
        min-height: 44px;
        border-radius: 50%;
        background-position: center center;
        object-fit: cover;
        background-size: cover;
      }
      .best__review__desc {
        display: flex;
        gap: 5px;
        flex-direction: column;
        justify-content: center;
        .name {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: normal;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #9ba5b1;
        }
        .role {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: bold;
          line-height: 16px;
          letter-spacing: -0.3px;
          text-align: left;
          color: #242a37;
        }
      }
    }

    .best {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: bold;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #f58220;
    }
    .best__review__c {
      font-family: SpoqaHanSansNeo;
      font-size: 11px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #242a37;

      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
