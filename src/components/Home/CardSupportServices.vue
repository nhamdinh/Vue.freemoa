<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from 'vue'
import right from '@/assets/svg/right.svg'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import router from '@/router'
import Loading from '@/components/Loading.vue'
import Skeleton from '@/components/skeleton/Skeleton.vue'
import moment from 'moment'

import { DATE_DOT, PAGESIZE_10, SLIDE_5000, UPTEM } from '@/common/constance'

const dataSupportServices = ref<any>([])

const ProductRepo = RepositoryFactory.get('product')
const isLoading = ref<any>(false)

const onGetListProduct = async () => {
  isLoading.value = true

  await ProductRepo.getListProduct({
    category: 'ALL',
    type: 'SERVICE',
    pageSize: PAGESIZE_10,
    pageNum: 1
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        dataSupportServices.value = data?.data
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  isLoading.value = false
}
watchEffect(() => {
  onGetListProduct()
})

const indexSlide = ref<any>(0)
const lastInd = ref<any>(1)
const touch = ref<any>('')

watch([dataSupportServices, indexSlide], async (newV, oldV) => {
  const lastIndex = dataSupportServices.value.length - 1
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
</script>

<template>
  <div class="home__row mt40px mr16px ml16px">
    <div class="title">기관별 주요 지원서비스</div>
    <div
      class="see__more cursor__pointer"
      @click="router.push({ path: '/organization-service-list' })"
    >
      <div class="see__more__text">더보기</div>

      <img :src="right" alt="right" />
    </div>
  </div>
  <Loading v-if="isLoading" />
  <Skeleton v-if="isLoading" />

  <div v-else class="by__institution mt20px">
    <article
      @click="
        router.push({
          path: '/service-detail-organization',
          query: { id: item?.id, name: item?.name }
        })
      "
      v-for="(item, personIndex) in dataSupportServices"
      :key="personIndex"
      :class="
        indexSlide === personIndex
          ? 'activeSlide'
          : personIndex === indexSlide - 1 ||
            (indexSlide === 0 && personIndex === dataSupportServices.length - 1)
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
      <div class="by__institution__a">
        <img :src="item?.companyLogo ?? UPTEM" alt="bankicon" class="bankicon" />
        <div class="bankicon__name">{{ item?.companyName }}</div>
      </div>
      <img class="mt10px image" :src="item?.productImage" alt="bankimg" draggable="false" />
      <div>
        <div class="by__institution__title mt16px">{{ item?.name }}</div>
        <div class="title__a mt10px">지원기간</div>
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

        <div class="title__a mt10px">지원대상 및 자격</div>
        <div class="service__list__c mt4px">
          {{ item?.targetService }}
        </div>
        <div class="title__a mt10px">지원 서비스 내용</div>
        <div class="service__list__c mt4px">
          {{ item?.description }}
        </div>
      </div>
    </article>
  </div>
</template>

<style lang="scss">
.by__institution {
  /* have to have a height */
  height: 430px;
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
    height: 426px;
    border-radius: 10px;
    box-shadow: 0 0 6px 0 rgba(71, 133, 185, 0.2);
    background-color: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    .by__institution__a {
      display: flex;
      gap: 4px;
      align-items: center;
      .bankicon {
        width: 30px;
        height: 30px;
        min-width: 30px;
        min-height: 30px;
        border-radius: 50%;
      }
      .bankicon__name {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: bold;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #242a37;
      }
    }
    .image {
      width: 270px;
      height: 180px;
      min-width: 270px;
      min-height: 180px;

      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: center center;
      object-fit: cover;
    }
    .by__institution__title {
      font-family: SpoqaHanSansNeo;
      font-size: 16px;
      font-weight: bold;
      line-height: 22px;
      letter-spacing: -0.4px;
      color: #242a37;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .title__a {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: bold;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #242a37;
    }
    .service__list__c {
      font-size: 12px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #52606d;

      font-family: SpoqaHanSansNeo;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .by__institution__b {
      font-family: SpoqaHanSansNeo;
      font-size: 11px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #242a37;

      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }
    .by__institution__c {
      font-family: SpoqaHanSansNeo;
      font-size: 11px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #242a37;
    }
  }
}
</style>
