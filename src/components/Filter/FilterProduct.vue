<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import right18 from '@/assets/svg/right18.svg'
import find from '@/assets/svg/find.svg'
import { RepositoryFactory } from '@/repository/RepositoryFactory'

defineProps(['isFilter'])
const emits = defineEmits(['closeFilter', 'setParams'])

const CompanyRepo = RepositoryFactory.get('company')

// const queryString = window.location.search
// const urlParams = new URLSearchParams(queryString)
// const companyGroupId = urlParams.get('id')

// const dataTags = ref<any>([])

const isLoading = ref<any>(true)

const someElement = ref<any>()
const scrollToTop = () => {
  if (someElement.value) someElement.value.scrollIntoView({ behavior: 'smooth' })
}

const value1 = ref<any>('NEW')
const value2 = ref<any>('DESC')
const value3 = ref<any>('PREMIUM')
const value4 = ref<any>('productName')
const searchVal = ref<any>('')

const options = [
  {
    value: 'NEW',
    label: '신상품'
  },
  {
    value: 'BEST',
    label: '베스트'
  },
  {
    value: 'PRICE',
    label: '가격'
  }
]

const options2 = [
  {
    value: 'DESC',
    label: '내림차순'
  },
  {
    value: 'ASC',
    label: '오름차순'
  }
]

const options3 = ref<any>([
  {
    value: 'PREMIUM',
    label: '전체'
  },
  {
    value: 'SPECIAL',
    label: '전체'
  },
  {
    value: 'GENERAL',
    label: '전체'
  }
])

const options4 = [
  {
    value: 'productName',
    label: '상품명'
  },
  {
    value: 'companyName',
    label: '기업명'
  }
]

const onFilter = () => {
  let params: any = {
    // type: 'MEMBER',
    type: 'PRODUCT',
    pageSize: 10,
    pageNum: 1,
    orderType: value1.value + '_' + value2.value,
    category: value3.value
  }

  if (value4.value === 'productName') {
    params = {
      ...params,
      productName: searchVal.value
    }
  } else {
    params = {
      ...params,
      companyName: searchVal.value
    }
  }
  console.log(params)

  emits('setParams', params)
}
// const chooseTag = (id: any) => {
//   let dataFetch: any = dataTags.value
//   let arrEmpty: any = []
//   dataFetch.map((item: any) => {
//     if (id === item?.id) {
//       arrEmpty.push({ ...item, choose: !item?.choose })
//     } else {
//       arrEmpty.push({ ...item, choose: item?.choose })
//     }
//   })
//   dataTags.value = arrEmpty
// }
</script>

<template>
  <div v-if="isFilter" class="filter__popup">
    <div class="filter__popup__CompanyListView">
      <div class="filter__sort">
        <div class="filter__title">정렬</div>
        <div class="list__drop mt20px mb20px">
          <el-select v-model="value1" class="w118px" placeholder="Select" size="large">
            <el-option
              v-for="item in options"
              :key="item?.value"
              :label="item?.label"
              :value="item?.value"
            />
          </el-select>
          <el-select v-model="value2" class="w118px" placeholder="Select" size="large">
            <el-option
              v-for="item in options2"
              :key="item?.value"
              :label="item?.label"
              :value="item?.value"
            />
          </el-select>
        </div>
      </div>
      <div class="space10"></div>
      <div class="filter__filter">
        <div class="filter__title mt20px">필터</div>
        <div class="filter__semi__title mt20px">라벨</div>

        <el-select v-model="value3" class="w244px mt10px" placeholder="Select" size="large">
          <el-option
            v-for="item in options3"
            :key="item?.value"
            :label="item?.label"
            :value="item?.value"
          />
        </el-select>

        <div class="filter__semi__title mt20px">검색</div>

        <el-select v-model="value4" class="w244px mt10px" placeholder="Select" size="large">
          <el-option
            v-for="item in options4"
            :key="item?.value"
            :label="item?.label"
            :value="item?.value"
          />
        </el-select>
        <div class="find__relative">
          <el-input class="mt10px w244px" v-model="searchVal" @keyup.enter="onFilter" />
          <img class="find__icon" :src="find" alt="find" />
        </div>

        <div class="filter__semi__title mt20px">키워드</div>

        <!-- <div class="keyword__list mt10px">
          <div
            @click="chooseTag(item.id)"
            :class="item?.choose ? 'keyword__item__active' : 'keyword__item__passive'"
            v-for="(item, index) in dataTags"
            :key="index"
          >
            {{ item?.code }}
          </div>
        </div> -->
        <div class="list__btn mt22px">
          <div class="btn__reset">초기화</div>
          <div class="btn__apply" @click="onFilter">적용</div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isFilter" @click="emits('closeFilter')" class="hidden__btn">
    <img :src="right18" alt="right18" />
  </div>
</template>
