<script setup lang="ts">
import Header from '@/components/Header.vue'
import Article from '@/components/Article/Article.vue'
import { PRODUCT_REVIEW } from '@/common/constance'
</script>

<template>
  <div class="OrganizationPostsListView">
    <Header :back="'/home'" :icon="2" :title="'상생상품 리뷰'"></Header>
    <Article :pathTo="'/product-review-detail'" :articleType="PRODUCT_REVIEW"></Article>
  </div>
</template>

<style lang="scss"></style>
