<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue'
import { DATE_DOT, SLIDE_5000 } from '@/common/constance'
import moment from 'moment'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'

const props = defineProps(['tagActive'])
const emits = defineEmits(['setNoticesCon'])

const CompanyRepo = RepositoryFactory.get('company')
const noticesCon = ref<any>([])

/*  */
const indexSlide = ref<any>(0)
const lastInd = ref<any>(1)
const touch = ref<any>('')
const isLoading = ref<any>(false)

watch([noticesCon, indexSlide], async (newV, oldV) => {
  const lastIndex = noticesCon.value.length - 1
  lastInd.value = lastIndex

  if (indexSlide.value < 0) {
    indexSlide.value = lastIndex
  }
  if (indexSlide.value > lastIndex) {
    indexSlide.value = 0
  }
})
let sliderCon: any = null

watchEffect(() => {
  sliderCon = setInterval(() => {
    indexSlide.value += 1
  }, SLIDE_5000)
  return () => clearInterval(sliderCon)
})

watch(touch, async (newQuestion, oldQuestion) => {
  clearInterval(sliderCon)
  sliderCon = setInterval(() => {
    indexSlide.value += 1
  }, SLIDE_5000)
  return () => clearInterval(sliderCon)
})

const onGetNotiByGroup = async () => {
  isLoading.value = true
  await CompanyRepo.getNotiByGroup({
    companyGroupId: props.tagActive
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data.data)
        noticesCon.value = data.data
        if (data.data.length !== 0) {
          emits('setNoticesCon', true)
        } else {
          emits('setNoticesCon', false)
        }
      } else {
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  isLoading.value = false
}

watch(props, async (newV, oldV) => {
  if (props.tagActive === 0) {
    noticesCon.value = []
    emits('setNoticesCon', false)

  } else {
    onGetNotiByGroup()
  }
})
</script>

<template>
  <Loading style="background-color: #f1f2f6" v-if="isLoading" />
  <div v-else v-if="noticesCon.length !== 0" style="background-color: #f1f2f6">
    <div style="margin: 0 auto; width: 328px; height: 4px; background-color: #1767b3"></div>

    <div class="__noticesCon">
      <article
        class="notice__lv2"
        v-for="(item, personIndex) in noticesCon"
        :key="personIndex"
        :class="
          indexSlide === personIndex
            ? 'activeSlide'
            : personIndex === indexSlide - 1 ||
              (indexSlide === 0 && personIndex === noticesCon.length - 1)
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
        <div class="notice__lv1__a">
          <label style="color: #3566ae" class="lv1__a__title" for=""
            >[{{ item?.companyGroupName }}]</label
          >
          {{ item?.title }}
        </div>
        <div class="notice__lv1__b mt6px">
          <div>{{ item?.createdBy }}</div>
          <div>|</div>
          <div>
            {{ moment(item?.createdDate).format(DATE_DOT) }}
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
