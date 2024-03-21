<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCategoryStore } from '@/stores/category'
import { storeToRefs } from 'pinia'

const props = defineProps(['prStData'])
const emits = defineEmits(['onCloseDialog'])

const storeCategory = useCategoryStore()
const { setCategoryLabel, setCategoryValue } = storeCategory

const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)

const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

const categoryList = ref<any>(props.prStData?.CategoryList ?? [])

watch(props, async (newV, oldV) => {
  categoryList.value = props.prStData?.CategoryList ?? []
})
</script>

<template>
  <div class="CategoryList">
    <div
      @click="
        () => {
          setCategoryLabel({ stCategoryLabel: item?.label })
          setCategoryValue({ stCategoryValue: item?.value })
          emits('onCloseDialog')
        }
      "
      class="cate__item"
      v-for="(item, index) in categoryList"
      :key="index"
    >
      {{ item?.label }}
    </div>
  </div>
</template>

<style lang="scss">
.CategoryList {
  padding: 0 10px;
  padding-top: 20px;
  .cate__item {
    width: 308px;
    height: 39px;
    display: flex;
    align-items: center;
    padding-left: 14px;

    font-family: SpoqaHanSansNeo;
    font-size: 15px;
    font-weight: normal;
    line-height: 18px;
    letter-spacing: -0.38px;
    color: #242a37;
    cursor: pointer;
  }
}
</style>
