<script setup lang="ts">
import { ref } from 'vue'
import Footer from '@/components/Footer.vue'
import logomini from '@/assets/img/logomini.png'
import MarketProduct from '@/components/Market/MarketProduct.vue'
import FilterProduct from '@/components/Filter/FilterProduct.vue'
import tune_black_24dp from '@/assets/svg/tune_black_24dp.svg'
import uparrow from '@/assets/svg/uparrow.svg'
import { storeToRefs } from 'pinia'
import { useCompanyStore } from '@/stores/company'

const storeCompany = useCompanyStore()
const { stIsFilter } = storeToRefs(storeCompany)
const { setIsFilter } = storeCompany

const params = ref<any>({
  type: 'PRODUCT',
  pageSize: 10,
  pageNum: 1
})
const someElementTop = ref<any>()
const scrollToTop = () => {
  if (someElementTop.value) someElementTop.value.scrollIntoView({ behavior: 'smooth' })
}

const showToTop = ref<any>(true)
const scrolling = (e: any) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  // console.log(scrollHeight)
  // console.log(clientHeight)
  // console.log(scrollTop)
  if (scrollTop > 200) {
    showToTop.value = false
  } else {
    showToTop.value = true
  }
}
</script>

<template>
  <div class="MarketListView">
    <FilterProduct
      v-if="stIsFilter"
      :isFilter="stIsFilter"
      @closeFilter="setIsFilter({ stIsFilter: false })"
      @setParams="
        (aaa: any) => {
          params = aaa
        }
      "
    ></FilterProduct>
    <div class="Header__main__logo" style="justify-content: space-between">
      <div class="logo__a">
        <img class="logomini" :src="logomini" alt="logomini" />
      </div>
<!--       <img
        @click="setIsFilter({ stIsFilter: false })"
        class="cursor__pointer iconx__right"
        :src="tune_black_24dp"
        width="24"
        alt="iconx"
      /> -->
    </div>

    <div class="uptotop" :class="showToTop && 'dn'" @click="scrollToTop">
      <img :src="uparrow" alt="uparrow" />
    </div>
    <div
      class="MarketListView__mid wrapper__main mt0px"
      style="height: calc(100vh - 120px)"
      @scroll="scrolling"
    >
      <div class=" " ref="someElementTop"></div>
      <div class="Premium__bgc pt20px pb20px" style="background-color: #f0f8ff">
        <div class="Premium">
          <MarketProduct
            :params="params"
            :title="'프리미엄 리스트'"
            :category="'PREMIUM'"
          ></MarketProduct>
        </div>
      </div>
      <div class="Premium__bgc pt20px pb20px mt20px" style="background-color: #ffffff">
        <div class="Premium">
          <MarketProduct
            :params="params"
            :title="'스페셜 리스트'"
            :category="'SPECIAL'"
          ></MarketProduct>
        </div>
      </div>
      <div class="div__space"></div>
      <div class="Premium__bgc pt40px pb40px" style="background-color: #ffffff">
        <div class="Premium">
          <MarketProduct
            :params="params"
            :title="'일반 상품 리스트'"
            :category="'GENERAL'"
          ></MarketProduct>
        </div>
      </div>
    </div>

    <Footer :active="2"></Footer>
  </div>
</template>

<style lang="scss">
.MarketListView {
  width: 100%;
  position: relative;

  .MarketListView__mid {
    // min-height: calc(100vh - 130px);
    background-color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  .Premium__bgc {
    width: 100%;
    display: flex;
    justify-content: center;
    .Premium {
      min-height: 340px;
      width: 329px;
    }
  }

  .div__space {
    height: 10px;
    background-color: #f1f2f6;
    width: 100%;
  }
}
</style>
