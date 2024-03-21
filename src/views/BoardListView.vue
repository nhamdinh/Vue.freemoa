<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import Footer from '@/components/Footer.vue'
import logomini from '@/assets/img/logomini.png'
import BoardFreeList from '@/components/BoardList/BoardFreeList.vue'
import BoardInfoList from '@/components/BoardList/BoardInfoList.vue'
import BoardRequestList from '@/components/BoardList/BoardRequestList.vue'
import BoardTogetherList from '@/components/BoardList/BoardTogetherList.vue'
import { useRoute } from 'vue-router'
import { fromPath_STORAGE } from '@/common/constance'

const route = useRoute()
localStorage.setItem(fromPath_STORAGE, route.path)

const tags = ref<any>([
  {
    id: 1,
    label: '자유 게시판'
  },
  {
    id: 2,
    label: '정보 게시판'
  },
  {
    id: 3,
    label: '요청하기'
  },
  {
    id: 4,
    label: '함께해요'
  }
])
const indexSlide = ref<any>(0)
const lastInd = ref<any>(3)
const tagActive = ref<any>(1)

const tagsRender = ref<any>([...tags.value].slice(0, lastInd.value + 1))
watch(indexSlide, async (newV, oldV) => {
  if (indexSlide.value !== 1)
    tagsRender.value = [...tags.value].slice(indexSlide.value, lastInd.value + 1)
})
</script>

<template>
  <div class="BestProductListView">
    <div class="Header__main__logo" style="justify-content: space-between">
      <div class="logo__a">
        <img class="logomini" :src="logomini" alt="logomini" />
      </div>
    </div>
    <div
      class="tag__list mb20px"
      :class="indexSlide === 1 ? 'flex__end pr16px' : indexSlide === 0 ? 'pl16px' : ''"
      draggable="false"
      v-touch:swipe.left="
        () => {
          indexSlide = indexSlide + 1
          if (indexSlide < 0) {
            indexSlide = 0
          }
          if (indexSlide > 1) {
            indexSlide = 1
          }
        }
      "
      v-touch:swipe.right="
        () => {
          indexSlide = indexSlide - 1
          if (indexSlide < 0) {
            indexSlide = 0
          }
          if (indexSlide > 1) {
            indexSlide = 1
          }
        }
      "
    >
      <div
        :class="tagActive === item.id ? 'tag__item__active' : 'tag__item__passive'"
        v-for="(item, index) in tagsRender"
        :key="index"
        @click="
          () => {
            tagActive = item.id
          }
        "
      >
        {{ item.label }}
      </div>
    </div>

    <BoardFreeList v-if="tagActive === 1"></BoardFreeList>
    <BoardInfoList v-if="tagActive === 2"></BoardInfoList>
    <BoardRequestList v-if="tagActive === 3"></BoardRequestList>
    <BoardTogetherList v-if="tagActive === 4"></BoardTogetherList>
    <!--  <InterestsServicesList v-if="tagActive === 2"></InterestsServicesList>
    <InterestsCompanysList v-if="tagActive === 3"></InterestsCompanysList>
    <InterestsFinancialsList v-if="tagActive === 4"></InterestsFinancialsList>
    <InterestsSupportsList v-if="tagActive === 5"></InterestsSupportsList>  -->

    <Footer :active="5"></Footer>
  </div>
</template>

<style lang="scss"></style>
