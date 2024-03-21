<script setup lang="ts">
import logomini from '@/assets/img/logomini.png'
import homegif from '@/assets/img/homegif.png'
import rightwhite from '@/assets/svg/rightwhite.svg'
import login from '@/assets/svg/login.svg'
import Footer from '@/components/Footer.vue'
import CardProductReview from '@/components/Home/CardProductReview.vue'
import CardCommunityPosts from '@/components/Home/CardCommunityPosts.vue'
import CardBranches from '@/components/Home/CardBranches.vue'
import CardProductTop from '@/components/Home/CardProductTop.vue'
import { ref, watchEffect, watch } from 'vue'
import CardSupportServices from './CardSupportServices.vue'
import uparrow from '@/assets/svg/uparrow.svg'
import router from '@/router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { SLIDE_5000, AVA } from '@/common/constance'
import { RepositoryFactory } from '@/repository/RepositoryFactory'

const CompanyRepo = RepositoryFactory.get('company')

const onGetListGroupsCompany = async () => {
  await CompanyRepo.getHomeBanner({})
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        if (data?.data?.length > 0) {
          const dataBanner_emp: any = []
          data.data.map((item: any) => {
            dataBanner_emp.push(item?.url)
          })

          dataBanner.value = [...dataBanner_emp]
        }
      } else {
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}

watchEffect(() => {
  onGetListGroupsCompany()
})

const dataBanner = ref<any>([
  // 'https://baoviet-online.vn/wp-content/uploads/2017/02/anh-thuong-hieu-so-1.png',
  // 'https://monkeymedia.vcdn.com.vn/upload/web/storage_web/29-07-2022_17:08:48_day-be-viet-so-2.jpg',
  // 'https://vansu.net/sites/default/files/schritt_3.jpg',
  // 'https://monkeymedia.vcdn.com.vn/upload/web/storage_web/29-07-2022_17:20:02_day-viet-so-4.jpg',
  // 'https://monkeymedia.vcdn.com.vn/upload/web/storage_web/28-07-2022_16:27:22_cach-viet-chu-so-5.jpg'
])
const indexSlide = ref<any>(0)
const lastInd = ref<any>(1)
const touch = ref<any>('')

watch([dataBanner, indexSlide], async (newV, oldV) => {
  const lastIndex = dataBanner.value?.length - 1
  lastInd.value = lastIndex

  if (indexSlide.value < 0) {
    indexSlide.value = lastIndex
  }
  if (indexSlide.value > lastIndex) {
    indexSlide.value = 0
  }
})

// watch(dataBanner, async (newQuestion, oldQuestion) => {
//   let slider = setInterval(() => {
//     indexSlide.value += 1
//   }, SLIDE_5000)
//   return () => clearInterval(slider)
// })
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

const someElementTop = ref<any>()
const scrollToTop = () => {
  if (someElementTop.value) someElementTop.value.scrollIntoView({ behavior: 'smooth' })
}

const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

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
  <div class="top__HomeView6">
    <div class="Header__main__logo" style="justify-content: space-between">
      <div class="logo__a">
        <img class="logomini" :src="logomini" alt="logomini" />
      </div>
      <div
        v-if="profile?.username"
        class="logo__a cursor__pointer"
        @click="router.push({ path: '/my-info' })"
      >
        <img class="avatar__home" :src="profile?.avatar ?? AVA" alt="login" />
      </div>
      <div v-else class="logo__a cursor__pointer" @click="router.push({ path: '/login' })">
        <img :src="login" alt="login" />
      </div>
    </div>
    <div class="uptotop" :class="showToTop && 'dn'" @click="scrollToTop">
      <img :src="uparrow" alt="uparrow" />
    </div>
    <div class="wrapper__main mt0px" @scroll="scrolling">
      <div class=" " ref="someElementTop"></div>

      <div class="home__slide">
        <article
          v-for="(item, personIndex) in dataBanner"
          :key="personIndex"
          :class="
            indexSlide === personIndex
              ? 'activeSlide'
              : personIndex === indexSlide - 1 ||
                (indexSlide === 0 && personIndex === dataBanner?.length - 1)
              ? 'nextSlide'
              : 'lastSlide'
          "
        >
          <img
            class="img__product"
            :src="item"
            alt="product"
            draggable="false"
            v-touch:swipe.left="
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
            v-touch:swipe.right="
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
          />
        </article>

        <div class="num__back"></div>
        <div class="num">{{ indexSlide + 1 }} / {{ dataBanner?.length }}</div>
        <!--       <button className="prev" onClick="{()" ="">
        setIndex(index - 1)}>
        <FiChevronLeft />
      </button>
      <button className="next" onClick="{()" ="">
        setIndex(index + 1)}>
        <FiChevronRight />
      </button> -->
      </div>
      <!-- dataNews 
    <CardNews /> -->
      <!-- dataBanner -->
      <CardProductTop />
      <div class="main__bottom mt40px">
        <!-- dataProductReview -->
        <CardProductReview />

        <!-- dataSupportServices -->
        <CardSupportServices />
        <!-- dataCommunityPosts -->
        <!--         <CardCommunityPosts />
 -->
      </div>
      <div class="gif">
        <img :src="homegif" alt="das" class="gif__img" />
        <div class="gif__text">
          <div class="maketing">한정기간</div>
          <div class="maketing">첫 구매시 추가 컨설팅</div>
          <div class="maketing">무료 이벤트</div>
          <div class="dataBanner_emp mt5px">
            <div class="kkk">메인비즈에서 혜택 받기</div>
            <img :src="rightwhite" alt="rightwhite" />
          </div>
          <div class="line__707 mt23px">
            <div class="line__fff"></div>
          </div>
        </div>
      </div>

      <!-- dataBranches -->
      <CardBranches />
      <div class="infos mt40px mb40px">
        <div class="info">(사)메인비즈 부울경 협회</div>
        <div class="info">회장: 김명진</div>
        <div class="info">주소: 부산광역시 중구 광복로 97번길 11, 5층</div>
        <div class="info">고객센터: 051-747-8630</div>

        <div class="info__Content mt10px cursor__pointer">
          <div @click="router.push({ path: '/introduce', query: { step: 3 } })">이용약관 | 개</div>
          <div @click="router.push({ path: '/introduce', query: { step: 4 } })">
            개인정보처리방침
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<style lang="scss">
.wrapper__main {
  max-height: calc(100vh - 120px);
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
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
  transform: translateX(100%);
}
.top__HomeView6 {
  /*   padding: 40px 16px;
  padding-bottom: 0; */

  .avatar__home {
    width: 24px;
    height: 24px;
    border: solid 1px #f1f2f6;
    border-radius: 50%;
    background-position: center center;
    object-fit: cover;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }
  .df__center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 360px;
    overflow: hidden;
  }

  @keyframes slide {
    0% {
      margin-left: 480px;
    }
    100% {
      margin-left: 16px;
    }
  }

  .infos {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .info {
      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: normal;
      line-height: 18px;
      letter-spacing: -0.38px;
      color: #52606d;
    }
    .info__Content {
      font-family: SpoqaHanSansNeo;
      font-size: 16px;
      font-weight: normal;
      line-height: 18px;
      letter-spacing: -0.4px;
      color: #9ba5b1;
      border-bottom: 1px solid #9ba5b1;
      display: flex;
    }
  }

  .main__bottom {
    padding-top: 40px;
    padding-bottom: 40px;
    border-top-right-radius: 30px;
    border-top-left-radius: 30px;

    background-color: #f1f2f6;
    // overflow: hidden;
  }
}

.home__slide {
  /* have to have a height */
  min-height: 250px;
  overflow: hidden;
  display: flex;
  gap: 5px;
  position: relative;
  .num__back {
    position: absolute;
    bottom: 9px;
    right: 16px;

    width: 45px;
    height: 22px;

    opacity: 0.5;
    border-radius: 11px;
    background-color: #fff;
  }
  .num {
    position: absolute;
    bottom: 9px;
    right: 16px;

    width: 45px;
    height: 22px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: SpoqaHanSansNeo;
    font-size: 15px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: -0.38px;
    color: #fff;
  }

  article.activeSlide {
    opacity: 1;
    transform: translateX(0);
  }
  article.lastSlide {
    opacity: 1;
    transform: translateX(100%);
  }
  article.nextSlide {
    transform: translateX(-100%);
  }

  article {
    width: 360px;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: all 0.1s linear;
    .img__product {
      width: 360px;
      height: 250px;
      min-width: 360px;
      min-height: 250px;
      background-position: center center;
      object-fit: cover;
      background-size: cover;
      object-fit: cover;
    }
  }
}
</style>
