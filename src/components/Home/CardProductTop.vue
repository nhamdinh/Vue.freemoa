<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue'
import right from '@/assets/svg/right.svg'
import xehang from '@/assets/img/xehang.png'
import Skeleton from '@/components/skeleton/SkeletonProductTop.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import { formatMoney } from '@/common/commonFunction'
import router from '@/router'
import { ACCESSTOKEN_STORAGE, PAGESIZE_10, SLIDE_5000 } from '@/common/constance'

const dataProductTop = ref<any>([])
const indexSlide = ref<any>(0)
const lastInd = ref<any>(1)
const touch = ref<any>('')

watch([dataProductTop, indexSlide], async (newV, oldV) => {
  const lastIndex = dataProductTop.value.length - 1
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

const ProductRepo = RepositoryFactory.get('product')
const isLoading = ref<any>(false)

const params = ref<any>({
  type: 'PRODUCT',
  pageSize: PAGESIZE_10,
  pageNum: 1,
  category: 'PREMIUM'
})
const onGetListProduct = async () => {
  isLoading.value = true

  await ProductRepo.getListProduct({ ...params.value })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        dataProductTop.value = data?.data
      }
    })
    .catch((err: any) => {
      if (err?.response?.status === 401) {
        localStorage.removeItem(ACCESSTOKEN_STORAGE)
        location.reload()
      }
    })
  isLoading.value = false
}
watchEffect(() => {
  onGetListProduct()
})

// const onGetListProductTop = async () => {
//   isLoading.value = true

//   await ProductRepo.getListProductTop()
//     .then((res: any) => {
//       const data = res?.data
//       if (data?.status === 'OK') {
//         console.log(data?.data)
//         // let dataProductTop: any = data?.data ?? []
//         // let arrEmpty: any = []
//         // dataProductTop.map((item: any) => {
//         //   arrEmpty.push(item)
//         // })
//         dataProductTop.value = data?.data
//       }
//     })
//     .catch((err: any) => {
//       if (err?.response?.status === 401) {
//         localStorage.removeItem(ACCESSTOKEN_STORAGE)
//         location.reload()
//       }
//       console.log(err)
//     })

//   isLoading.value = false
// }

// watchEffect(() => {
//   onGetListProductTop()
// })
</script>

<template>
  <div class="home__row mt40px mr16px ml16px">
    <div class="title">베스트 상생 상품</div>
    <div class="see__more cursor__pointer" @click="router.push({ path: '/best-product-list' })">
      <div class="see__more__text">더보기</div>

      <img :src="right" alt="right" />
    </div>
  </div>
  <Loading v-if="isLoading" />
  <div style="display: flex" v-if="isLoading">
    <Skeleton />
    <Skeleton />
  </div>

  <div v-else class="best__win mt20px">
    <article
      @click="router.push({ path: '/product-detail', query: { id: item?.id, name: item?.name } })"
      v-for="(item, personIndex) in dataProductTop"
      :key="personIndex"
      :class="
        indexSlide === personIndex
          ? 'activeSlide'
          : personIndex === indexSlide - 1 ||
            (indexSlide === 0 && personIndex === dataProductTop.length - 1)
          ? 'nextSlide'
          : personIndex === indexSlide - 2 ||
            (indexSlide === 0 && personIndex === dataProductTop.length - 2) ||
            (indexSlide === 1 && personIndex === dataProductTop.length - 1)
          ? 'nextSlideNext'
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
      <div class="best__win__img">
        <img class="img__product" :src="item?.productImage" alt="product" draggable="false" />
      </div>

      <div class="company__name mt8px company__name">
        <label class="company" for="">{{ item?.companyName }}</label>
        {{ item?.name }}
      </div>
      <div class="best__win__amount mt8px">{{ formatMoney(item?.price) }}원</div>
    </article>
  </div>
</template>

<style lang="scss">
.best__win {
  /* have to have a height */
  min-height: 212px;
  overflow: hidden;
  display: flex;
  margin-left: 16px;
  gap: 6px;
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
    transform: translateX(calc(100% + 12px));
  }
  article.nextSlideNext {
    opacity: 1;
    transform: translateX(calc(200% + 24px));
  }
  article {
    position: absolute;
    top: 0;
    left: 0;
    width: 140px;
    opacity: 0;
    transition: all 0.1s linear;
    cursor: pointer;
    .company__name {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

      font-family: SpoqaHanSansNeo;
      font-size: 13px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: -0.38px;
      color: #242a37;
      .company {
        font-weight: 700;
      }
    }
    .best__win__img {
      width: 140px;
      height: 140px;
      position: relative;
      .img__product {
        border-radius: 10px;
        width: 140px;
        height: 140px;
        min-width: 140px;
        min-height: 140px;
        background-position: center center;
        object-fit: cover;
        background-size: cover;
        object-fit: cover;
        border: 1px solid #f0f0f0;
      }
      .img__xehang {
        position: absolute;
        right: 5px;
        bottom: 5px;
        width: 22px;
        height: 22px;
        background-color: #f58220;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }

    .best__win__desc {
      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: -0.38px;
      color: #52606d;
      width: 90%;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .best__win__amount {
      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: bold;
      line-height: 20px;
      letter-spacing: -0.38px;
      color: #242a37;
    }
  }
}
</style>
