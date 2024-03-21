<script setup lang="ts">
import Header from './../components/Header.vue'
import InterestsProductList from '@/components/InterestsList/InterestsProductList.vue'
import InterestsServicesList from '@/components/InterestsList/InterestsServicesList.vue'
import InterestsCompanysList from '@/components/InterestsList/InterestsCompanysList.vue'
import InterestsFinancialsList from '@/components/InterestsList/InterestsFinancialsList.vue'
import InterestsSupportsList from '@/components/InterestsList/InterestsSupportsList.vue'
import { ref, watch } from 'vue'

const tags = ref<any>([
  {
    id: 1,
    label: '상생상품'
  },
  {
    id: 2,
    label: '지원서비스'
  },
  {
    id: 3,
    label: '회원사'
  },
  {
    id: 4,
    label: '금융기관'
  },
  {
    id: 5,
    label: '지원기관'
  }
])
const indexSlide = ref<any>(0)
const lastInd = ref<any>(4)

const tagActive = ref<any>(1)
const tagsRender = ref<any>([...tags.value].slice(0, lastInd.value + 1))

watch(indexSlide, async (newV, oldV) => {
  if (indexSlide.value !== 2)
    tagsRender.value = [...tags.value].slice(indexSlide.value, lastInd.value + 1)
})
</script>

<template>
  <div class="BestProductListView">
    <Header :back="'/my-info'" :icon="2" :title="'내 관심사'" :iconRight="2"></Header>
    <div
      class="tag__list mt16px mb0px"
      :class="indexSlide === 2 ? 'flex__end pr16px' : indexSlide === 0 ? 'pl16px' : ''"
      draggable="false"
      v-touch:swipe.left="
        () => {
          indexSlide = indexSlide + 1
          if (indexSlide < 0) {
            indexSlide = 0
          }
          if (indexSlide > 2) {
            indexSlide = 2
          }
        }
      "
      v-touch:swipe.right="
        () => {
          indexSlide = indexSlide - 1
          if (indexSlide < 0) {
            indexSlide = 0
          }
          if (indexSlide > 2) {
            indexSlide = 2
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
    <InterestsProductList v-if="tagActive === 1"></InterestsProductList>
    <InterestsServicesList v-if="tagActive === 2"></InterestsServicesList>
    <InterestsCompanysList v-if="tagActive === 3"></InterestsCompanysList>
    <InterestsFinancialsList v-if="tagActive === 4"></InterestsFinancialsList>
    <InterestsSupportsList v-if="tagActive === 5"></InterestsSupportsList>
  </div>
</template>
<style lang="scss">
.flex__end {
  justify-content: flex-end;
}
</style>
