<script setup lang="ts">
import Article from '@/components/Article/Article.vue'
import { COMMUNITY } from '@/common/constance'
</script>

<template>
  <Article
    :pathTo="'/best-community-post-detail'"
    :articleType="COMMUNITY"
    :communitySearchType="'ALL'"
    :communityCategory="'FREE'"
  ></Article>
</template>
<style lang="scss"></style>
