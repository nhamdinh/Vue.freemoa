<script setup lang="ts">
import { handleUpdateFavorite } from '@/common/commonFunction'
import { PAGESIZE_10 } from '@/common/constance'
import BestProductItem from '@/components/InterestsList/BestProductItem.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { ref, watchEffect, watch } from 'vue'
const props = defineProps(['title', 'category', 'params'])

const dataProduct = ref<any>([])

const ProductRepo = RepositoryFactory.get('product')
const isLoading = ref<any>(true)
const params = ref<any>({
  type: 'PRODUCT',
  pageSize: PAGESIZE_10,
  pageNum: 1,
  category: props.category
})

const onGetListProduct = async () => {
  await ProductRepo.getListProduct({ ...params.value })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        dataProduct.value = data?.data
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
watch(props, async (newV, oldV) => {
  if (props.params?.category === props.category) {
    params.value = props.params
  }
})
const someElement = ref<any>()
const scrollToTop = () => {
  if (someElement.value) someElement.value.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="market__title">{{ title }}</div>
  <div class="mb20px" ref="someElement"></div>
  <BestProductItem
    :dataProduct="dataProduct"
    :isLoading="isLoading"
    @onGetDataProduct="
      (id: any) => {
        dataProduct = handleUpdateFavorite(id, dataProduct)
      }
    "
  ></BestProductItem>
</template>

<style lang="scss">
.market__title {
  font-size: 20px;
  font-weight: bold;
  line-height: 24px;
  letter-spacing: -0.5px;
  color: #000;
}
</style>
