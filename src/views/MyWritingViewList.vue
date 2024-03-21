<script setup lang="ts">
import Header from '@/components/Header.vue'
import Article from '@/components/Article/Article.vue'
import { COMMUNITY } from '@/common/constance'
</script>

<template>
  <div class="OrganizationPostsListView">
    <Header :back="'/my-info'" :icon="2" :title="'내 작성글'"></Header>
    <Article
      :pathTo="'/my-writing-detail'"
      :articleType="COMMUNITY"
      :communitySearchType="'LIST_MY_POST'"
    ></Article>
  </div>
</template>

<style lang="scss"></style>
