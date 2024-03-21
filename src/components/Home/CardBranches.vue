<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Loading from '@/components/Loading.vue'
import router from '@/router'
import { useCustomDialogStore } from '@/stores/customDialog'
import { CONNECT_FAIL, PAGESIZE_8 } from '@/common/constance'

const CompanyRepo = RepositoryFactory.get('company')

const store = useCustomDialogStore()
const { openDialog } = store
const openDialogProp = (text: any) => {
  openDialog({
    stType: 'info',
    stTitle: text,
    stOkText: '확인'
  })
}

const dataBranches = ref<any>([])
const isLoading = ref<any>(false)

const onGetListCompanyProduct = async () => {
  isLoading.value = true
  await CompanyRepo.getListGroupsCompany({
    pageSize: PAGESIZE_8,
    groupParent: -1
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        console.log(data?.data)
        dataBranches.value = data?.data
      } else {
        openDialogProp(CONNECT_FAIL)
      }
    })
    .catch((err: any) => {
      openDialogProp(CONNECT_FAIL)
      console.log(err)
    })

  isLoading.value = false
}

watchEffect(() => {
  onGetListCompanyProduct()
})
</script>

<template>
  <div class="branches__title mt40px ml16px">연합회·지회 현황</div>
  <Loading v-if="isLoading" />
  <div class="branches start__center">
    <div class="branches__row mt20px">
      <div
        @click="
          () => {
            if (item?.type === 'MEMBER')
              router.push({ path: '/company-list', query: { id: item?.id } })
            if (item?.type === 'FINANCIAL')
              router.push({ path: '/finance-list', query: { id: item?.id } })
            if (item?.type === 'GOVERNMENT')
              router.push({ path: '/government-list', query: { id: item?.id } })
          }
        "
        class="branches__btn"
        v-for="(item, index) in dataBranches"
        :key="index"
      >
        {{ item?.companyGroupName }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.branches__title {
  font-family: SpoqaHanSansNeo;
  font-size: 20px;
  font-weight: bold;
  line-height: 24px;
  letter-spacing: -0.5px;
  color: #000;
}
.start__center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.branches {
  .branches__row {
    max-width: 328px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    flex-wrap: wrap;
    width: unset;
    .branches__btn {
      width: 156px;
      height: 42px;
      border-radius: 16px;
      border: solid 1px #1867b3;
      display: flex;
      align-items: center;
      justify-content: center;

      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: 500;
      line-height: 18px;
      letter-spacing: -0.38px;
      color: #1767b3;
      cursor: pointer;
    }
  }
}
</style>
