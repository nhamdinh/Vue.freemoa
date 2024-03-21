<script setup lang="ts">
import Header from '@/components/Header.vue'
import Article from '@/components/Article/Article.vue'
import { COMMUNITY } from '@/common/constance'
</script>

<template>
  <div class="OrganizationPostsListView">
    <Header :back="'/home'" :icon="2" :title="'기관별 주요 게시판'"></Header>
    <Article
      :pathTo="'/organization-posts-detail'"
      :articleType="COMMUNITY"
      :communitySearchType="'BY_COMPANY_GROUP'"
    ></Article>
  </div>
</template>

<style lang="scss"></style>
