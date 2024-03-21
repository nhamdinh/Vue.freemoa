<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import right from '@/assets/svg/right.svg'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import router from '@/router'
import Loading from '@/components/Loading.vue'
import Skeleton from '@/components/skeleton/Skeleton.vue'
import { COMMUNITY, AVA, SLIDE_5000 } from '@/common/constance'
import eye from '@/assets/img/eye.png'
import comment from '@/assets/img/comment.png'
import likexanh from '@/assets/img/likexanh.png'
import likexanhlike from '@/assets/img/likexanhlike.png'

const dataCommunityPosts = ref<any>([])

const ArticleRepo = RepositoryFactory.get('article')
const isLoading = ref<any>(false)

const onGetArticleList = async () => {
  isLoading.value = true

  let payload: any = {
    pageSize: 10,
    pageNum: 1,
    orderSort: 'DESC',
    articleType: COMMUNITY,
    communitySearchType: 'BEST'
  }

  await ArticleRepo.getArticleList({
    ...payload
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        // let dataFetch: any = data?.data ?? []
        // let arrEmpty: any = []
        // dataFetch.map((item: any) => {
        //   arrEmpty.push({ ...item, stars: 4, role: '컨설팅 지원' })
        // })
        dataCommunityPosts.value = data?.data
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

watch([dataCommunityPosts, indexSlide], async (newV, oldV) => {
  const lastIndex = dataCommunityPosts.value.length - 1
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
  <div class="home__row mt40px mr16px ml16px">
    <div class="title">베스트 커뮤니티 게시글</div>
    <div
      class="see__more cursor__pointer"
      @click="router.push({ path: '/best-community-post-list' })"
    >
      <div class="see__more__text">더보기</div>

      <img :src="right" alt="right" />
    </div>
  </div>

  <Loading v-if="isLoading" />
  <Skeleton v-if="isLoading" />

  <article v-else class="best__posts mt20px">
    <article
      @click="router.push({ path: '/best-community-post-detail', query: { id: item?.id } })"
      v-for="(item, personIndex) in dataCommunityPosts"
      :key="personIndex"
      :class="
        indexSlide === personIndex
          ? 'activeSlide'
          : personIndex === indexSlide - 1 ||
            (indexSlide === 0 && personIndex === dataCommunityPosts.length - 1)
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
      <div class="best__posts__a">컨설팅 지원받았던 경험</div>
      <div class="best__posts__c mt16px">
        <div class="avatar">
          <img class="avatarman" :src="item?.avatarCreatedBy ?? AVA" alt="avatarman" />
          <div class="avatar__name">{{ item?.createdBy.slice(0, 4) }}**</div>
        </div>
        <div class="best__posts__desc" v-html="item?.content"></div>
      </div>
      <div class="content__ProductReview__c mt10px">
        <div>
          <img class="icon_img" :src="eye" alt="eye" />
          <div>{{ item?.viewNumber ?? 0 }}</div>
        </div>

        <div class="totalLikes">
          <img
            class="icon_img cursor__pointer"
            :src="item?.isLike ? likexanhlike : likexanh"
            alt="likexanh"
          />
          <div>{{ item?.totalLikes ?? 0 }}</div>
        </div>

        <div>
          <img class="icon_img" :src="comment" alt="comment" />
          <div>{{ item?.totalComments ?? 0 }}</div>
        </div>
      </div>
    </article>
  </article>
</template>

<style lang="scss">
.best__posts {
  /* have to have a height */
  height: 170px;
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
    border-radius: 10px;
    box-shadow: 0 0 6px 0 rgba(71, 133, 185, 0.2);
    background-color: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    .content__ProductReview__c {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #52606d;
      div {
        display: flex;
        align-items: center;
        gap: 2px;
      }
    }
    .best__posts__a {
      font-family: SpoqaHanSansNeo;
      font-size: 16px;
      font-weight: bold;
      line-height: 20px;
      letter-spacing: -0.4px;
      color: #242a37;
    }
    .best__posts__b {
      display: flex;
      gap: 4px;
      @mixin btn {
        border-radius: 13.5px;
        border: solid 1px #cbd2da;
        background-color: #fff;

        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #52606d;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .consulting {
        @include btn;
        width: 57px;
        height: 27px;
      }
      .management {
        @include btn;
        width: 67px;
        height: 27px;
      }
    }

    .best__posts__c {
      display: flex;
      gap: 10px;
      .avatar {
        display: flex;
        gap: 4px;
        flex-direction: column;
        align-items: center;
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
        .avatar__name {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #52606d;
        }
      }

      .best__posts__desc {
        font-size: 11px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #242a37;

        height: 64px;
        max-height: 64px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }
    }

    .best__posts__d {
      display: flex;
      gap: 6px;
      .action {
        display: flex;
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #52606d;
        .das {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style>
