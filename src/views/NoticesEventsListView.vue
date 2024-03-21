<script setup lang="ts">
import Header from '@/components/Header.vue'
import Article from '@/components/Article/Article.vue'
import { NOTIFICATION } from '@/common/constance'
</script>

<template>
  <div class="OrganizationPostsListView">
    <Header :back="'/my-info'" :icon="2" :title="'공지 및 이벤트'"></Header>
    <Article :pathTo="'/notices-events-detail'" :articleType="NOTIFICATION"></Article>
  </div>
</template>

<style lang="scss"></style>
