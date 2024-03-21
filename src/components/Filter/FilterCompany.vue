<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import right18 from '@/assets/svg/right18.svg'
import find from '@/assets/svg/find.svg'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { PAGESIZE_100, PAGESIZE_5 } from '@/common/constance'

defineProps(['isFilter'])
const emits = defineEmits(['closeFilter', 'setParams', 'setSearchTrue'])

const CompanyRepo = RepositoryFactory.get('company')

// const queryString = window.location.search
// const urlParams = new URLSearchParams(queryString)
// const companyGroupId = urlParams.get('id')

const dataTags = ref<any>([])

const isLoading = ref<any>(true)
const onGetListGroupsCompany = async () => {
  await CompanyRepo.getListGroupsCompany({
    pageSize: 30,
    groupParent: -1
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        dataBranchesOrigin.value = data?.data

        let dataFetch: any = data?.data ?? []
        let arrEmpty: any = [
          {
            value: -1,
            label: '전체'
          }
        ]
        dataFetch.map((item: any) => {
          arrEmpty.push({
            value: item?.id,
            label: item?.companyGroupName
          })
        })

        dataBranches.value = arrEmpty
      }
    })
    .catch((err: any) => {
      console.log(err)
    })

  isLoading.value = false
}

const onGetListTags = async () => {
  await CompanyRepo.getListTags({
    type: 'TAG',
    code: '',
    name: ''
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        console.log(data?.data)
        let dataFetch: any = data?.data ?? []
        let arrEmpty: any = []
        dataFetch.map((item: any) => {
          arrEmpty.push({ ...item, choose: false })
        })
        dataTags.value = arrEmpty
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}

watchEffect(() => {
  onGetListGroupsCompany()
  onGetListTags()
})

const someElement = ref<any>()
const scrollToTop = () => {
  if (someElement.value) someElement.value.scrollIntoView({ behavior: 'smooth' })
}

const value1 = ref<any>('company_name')
const value2 = ref<any>('DESC')
const value3 = ref<any>(-1)
const searchVal = ref<any>('')

const options = [
  {
    value: 'company_name',
    label: '기업명'
  },
  {
    value: 'representative_name',
    label: '대표자명'
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
const dataBranches = ref<any>([
  {
    value: -1,
    label: '전체'
  }
])
const dataBranchesOrigin = ref<any>([])

const chooseTag = (id: any) => {
  let dataFetch: any = dataTags.value
  let arrEmpty: any = []
  dataFetch.map((item: any) => {
    if (id === item?.id) {
      arrEmpty.push({ ...item, choose: !item?.choose })
    } else {
      arrEmpty.push({ ...item, choose: item?.choose })
    }
  })
  dataTags.value = arrEmpty
}
</script>

<template>
  <div v-if="isFilter" class="filter__popup">
    <div class="filter__popup__CompanyListView filter__CompanyListView__scroll">
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
        <div class="filter__semi__title mt20px">연합회/지회</div>

        <el-select v-model="value3" class="w244px mt10px" placeholder="Select" size="large">
          <el-option
            v-for="item in dataBranches"
            :key="item?.value"
            :label="item?.label"
            :value="item?.value"
          />
        </el-select>

        <div class="filter__semi__title mt20px">검색</div>

        <el-select v-model="value1" class="w244px mt10px" placeholder="Select" size="large">
          <el-option
            v-for="item in options"
            :key="item?.value"
            :label="item?.label"
            :value="item?.value"
          />
        </el-select>
        <div class="find__relative">
          <el-input class="mt10px w244px" v-model="searchVal" />
          <img
            class="find__icon"
            :src="find"
            alt="find"
            @click="
              () => {
                let tagArr: any = []
                dataTags.map((tag: any) => {
                  if (tag?.choose) {
                    tagArr.push(tag?.code)
                  }
                })

                let params: any = {
                  // type: 'MEMBER',
                  pageSize: PAGESIZE_100,
                  pageNum: 1,
                  companyGroupId: value3,
                  orderSort: value2,
                  tags: tagArr
                }
                if (value3 !== -1) {
                  dataBranchesOrigin.map((bra: any) => {
                    if (bra?.id === value3) {
                      params = {
                        ...params,
                        type: bra?.type
                      }
                    }
                  })
                }
                if (value1 === 'company_name') {
                  params = {
                    ...params,
                    companyName: searchVal
                  }
                } else {
                  params = {
                    ...params,
                    representationUserFullName: searchVal
                  }
                }
                // console.log(params)

                emits('setParams', params)
                emits('setSearchTrue')
              }
            "
          />
        </div>

        <div class="filter__semi__title mt20px">키워드</div>

        <div class="keyword__list mt10px">
          <div
            @click="chooseTag(item.id)"
            :class="item?.choose ? 'keyword__item__active' : 'keyword__item__passive'"
            v-for="(item, index) in dataTags"
            :key="index"
          >
            {{ item?.code }}
          </div>
        </div>
        <div class="list__btn mt22px">
          <div class="btn__reset">초기화</div>
          <div
            class="btn__apply"
            @click="
              () => {
                let tagArr: any = []
                dataTags.map((tag: any) => {
                  if (tag?.choose) {
                    tagArr.push(tag?.code)
                  }
                })

                let params: any = {
                  // type: 'MEMBER',
                  pageSize: 40,
                  pageNum: 1,
                  companyGroupId: value3,
                  orderSort: value2,
                  tags: tagArr
                }
                if (value3 !== -1) {
                  dataBranchesOrigin.map((bra: any) => {
                    if (bra?.id === value3) {
                      params = {
                        ...params,
                        type: bra?.type
                      }
                    }
                  })
                }
                if (value1 === 'company_name') {
                  params = {
                    ...params,
                    companyName: searchVal
                  }
                } else {
                  params = {
                    ...params,
                    representationUserFullName: searchVal
                  }
                }
                // console.log(params)

                emits('setParams', params)
                emits('setSearchTrue')
              }
            "
          >
            적용
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isFilter" @click="emits('closeFilter')" class="hidden__btn">
    <img :src="right18" alt="right18" />
  </div>
</template>

<style lang="scss">
.hidden__btn {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  position: absolute;
  z-index: 99;
  width: 280px;
  background-color: #fff;
  width: 26px;
  height: 60px;

  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;

  top: 50%;
  right: 280px;
  transform: translate(0%, -50%);
  animation: hidden__filter__btn 0.2s linear forwards;

  @keyframes hidden__filter__btn {
    0% {
      right: 80px;
    }
    50% {
      right: 180px;
    }
    100% {
      right: 280px;
    }
  }
}
</style>
