<script setup lang="ts">
import Loading from '@/components/Loading.vue'
import { formatMoney, getDurationBetween } from '@/common/commonFunction'
import router from '@/router'
import LikeButton from '@/components/InterestsList/LikeButton.vue'

defineProps(['dataProduct', 'isLoading'])
const emits = defineEmits(['onGetDataProduct'])
</script>

<template>
  <div class="dataProduct__list">
    <div
      v-for="(item, index) in dataProduct"
      @click="router.push({ path: '/product-detail', query: { id: item?.id, name: item?.name } })"
      class="dataProduct__item"
      :key="index"
    >
      <img class="productImage" :src="item?.productImage" alt="productImage" />
      <div class="tags">
        <div class="tag__a" v-if="getDurationBetween(Date.now(), item?.createdDate) <= 31">
          신규
        </div>
        <div class="tag__b" v-if="item?.favoriteNumber >= 3 || item?.countChatNumber >= 30">
          인기
        </div>
      </div>

      <LikeButton
        :item="item"
        @onGetDataProduct="
          (id: any) => {
            emits('onGetDataProduct', id)
          }
        "
      ></LikeButton>

      <div class="company__name mt8px">
        <label class="company" for="">{{ item?.companyName }}</label> {{ item?.name }}
      </div>
      <div class="price mt8px">{{ formatMoney(item?.price) }}원</div>
      <div class="quantity__Order mt8px">주문수량협상</div>
    </div>
  </div>
  <div class="mt20px mb20px" v-if="isLoading">
    <Loading />
  </div>
</template>
<style lang="scss">
.dataProduct__list {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  flex-direction: row;

  .dataProduct__item {
    cursor: pointer;
    width: 160px;
    max-width: 160px;
    position: relative;
  }
  .productImage {
    width: 160px;
    height: 160px;
    min-width: 160px;
    min-height: 160px;
    border-radius: 10px;

    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center center;
    object-fit: cover;
  }
  .tags {
    display: flex;
    gap: 4px;
    position: absolute;
    top: 10px;
    left: 10px;
    @mixin tag {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #fff;

      width: 34px;
      height: 19px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .tag__a {
      @include tag;

      background-color: #006ed6;
    }
    .tag__b {
      @include tag;

      background-color: #f3485b;
    }
  }

  .btn__like {
    cursor: pointer;
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: center;

    width: 160px;
    height: 32px;
    border-radius: 4px;
    border: solid 1px #cbd2da;
    background-color: #fff;
    p {
      font-family: SpoqaHanSansNeo;
      font-size: 13px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.33px;
      color: #242a37;
    }
  }
  .company__name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    font-family: SpoqaHanSansNeo;
    font-size: 13px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: -0.38px;
    color: #242a37;
    .company {
      font-weight: 700;
    }
  }

  .price {
    font-family: SpoqaHanSansNeo;
    font-size: 15px;
    font-weight: bold;
    line-height: 18px;
    letter-spacing: -0.38px;
    color: #242a37;
  }

  .quantity__Order {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: -0.3px;
    color: #52606d;
  }
}
</style>
