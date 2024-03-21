<script setup lang="ts">
import mainlogo from '@/assets/svg/mainhome.svg'
import { ref, watch, watchEffect } from 'vue'
import right from '@/assets/svg/right.svg'

const emits = defineEmits(['setStep'])

const dataSlides = ref<any>([
  'https://baoviet-online.vn/wp-content/uploads/2017/02/anh-thuong-hieu-so-1.png',
  'https://monkeymedia.vcdn.com.vn/upload/web/storage_web/29-07-2022_17:08:48_day-be-viet-so-2.jpg',
  'https://vansu.net/sites/default/files/schritt_3.jpg',
  'https://monkeymedia.vcdn.com.vn/upload/web/storage_web/29-07-2022_17:20:02_day-viet-so-4.jpg'
])
const indexSlide = ref<any>(0)
const lastInd = ref<any>(1)

watch([dataSlides, indexSlide], async (newV, oldV) => {
  const lastIndex = dataSlides.value.length - 1
  lastInd.value = lastIndex
  if (indexSlide.value < 0) {
    indexSlide.value = lastIndex
  }
  if (indexSlide.value > lastIndex) {
    indexSlide.value = 0
  }
})

// watch(dataSlides, async (newQuestion, oldQuestion) => {
//   let slider = setInterval(() => {
//     indexSlide.value += 1
//   }, 5000)
//   return () => clearInterval(slider)
// })
watchEffect(() => {
  let slider = setInterval(() => {
    indexSlide.value += 1
  }, 8000)
  return () => clearInterval(slider)
})
</script>
<template>
  <div class="Intro2 mt-14px">
    <div class="pl16px">
      <div class="title__home" style="position: relative">
        튜토리얼을

        <div class="skip__Intro2 cursor__pointer" @click="emits('setStep')">
          <div class="skip">SKIP</div>
          <img :src="right" alt="right" />
        </div>
      </div>
      <div class="title__home">진행하겠습니다.</div>

      <div class="semi__title mt20px">앱에 대한 튜토리얼을 진행하겠습니다.</div>
      <div class="semi__title">앞으로 진행되는 가이드에 따라주세요.</div>
    </div>

    <div class="home__slide mt43px" style="min-height: 250px">
      <article
        v-for="(item, personIndex) in dataSlides"
        :key="personIndex"
        :class="
          indexSlide === personIndex
            ? 'activeSlide'
            : personIndex === indexSlide - 1 ||
              (indexSlide === 0 && personIndex === dataSlides.length - 1)
            ? 'lastSlide'
            : 'nextSlide'
        "
      >
        <img
          class="img__product"
          :src="item"
          alt="product"
          @click="
            (e) => {
              e.stopPropagation()
              indexSlide = indexSlide + 1
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
    </div>
    <div class="list__dot mt80px mb57px">
      <div
        v-for="(item, index) in dataSlides.length"
        :key="index"
        @click="
          (e) => {
            e.stopPropagation()
            indexSlide = indexSlide + 1
            if (indexSlide < 0) {
              indexSlide = lastInd
            }
            if (indexSlide > lastInd) {
              indexSlide = 0
            }
          }
        "
        :class="indexSlide === index ? 'act' : 'dis'"
      ></div>
    </div>
  </div>
</template>

<style lang="scss">
.Intro2 {
  .skip__Intro2 {
    display: flex;
    gap: 4px;
    align-items: center;
    position: absolute;
    top: 0;
    right: 16px;
  }
  .skip {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: bold;
    line-height: 16px;
    letter-spacing: -0.3px;
    color: #242a37;
  }
  .list__dot {
    display: flex;
    gap: 6px;
    justify-content: center;
    .act {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #3566ae;
      cursor: pointer;
    }
    .dis {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #ccd2d9;
      cursor: pointer;
    }
  }
}
</style>
