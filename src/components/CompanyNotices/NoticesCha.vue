<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue'
import { DATE_DOT, SLIDE_5000 } from '@/common/constance'
import moment from 'moment'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'

const props = defineProps(['companyGroupId'])
const emits = defineEmits(['setNoticesCha'])

const CompanyRepo = RepositoryFactory.get('company')

const noticesCha = ref<any>([])
const indexSlide = ref<any>(0)
const lastInd = ref<any>(1)
const touch = ref<any>('')
const isLoading = ref<any>(false)

watch([noticesCha, indexSlide], async (newV, oldV) => {
  const lastIndex = noticesCha.value.length - 1
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
const onGetNotiByGroup = async () => {
  isLoading.value = true

  await CompanyRepo.getNotiByGroup({
    companyGroupId: props.companyGroupId
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data.data)
        noticesCha.value = data.data
        if (data.data.length !== 0) {
          emits('setNoticesCha', true)
        } else {
          emits('setNoticesCha', false)
        }
      } else {
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  isLoading.value = false
}

watchEffect(() => {
  onGetNotiByGroup()
})
</script>

<template>
  <!--   <Loading style="background-color: #f1f2f6" v-if="isLoading" />
 -->
  <div v-if="noticesCha.length !== 0" style="background-color: #f1f2f6">
    <div style="height: 4px; background-color: #f58220"></div>
    <div class="__noticesCha">
      <article
        v-for="(item, personIndex) in noticesCha"
        :key="personIndex"
        class="notice__lv1"
        :class="
          indexSlide === personIndex
            ? 'activeSlide'
            : personIndex === indexSlide - 1 ||
              (indexSlide === 0 && personIndex === noticesCha.length - 1)
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
          <label class="lv1__a__title" for="">[{{ item?.companyGroupName }}]</label>
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
