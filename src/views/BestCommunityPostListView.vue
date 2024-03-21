<script setup lang="ts">
import Header from '@/components/Header.vue'
import Article from '@/components/Article/Article.vue'
import { COMMUNITY, fromPath_STORAGE } from '@/common/constance'
import { useRoute } from 'vue-router'

const route = useRoute()
localStorage.setItem(fromPath_STORAGE, route.path)
</script>

<template>
  <div class="OrganizationPostsListView">
    <Header :back="'/home'" :icon="2" :title="'베스트 커뮤니티 게시판'"></Header>
    <Article
      :pathTo="'/best-community-post-detail'"
      :articleType="COMMUNITY"
      :communitySearchType="'BEST'"
    ></Article>
  </div>
</template>

<style lang="scss"></style>
