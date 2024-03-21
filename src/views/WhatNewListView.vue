<script setup lang="ts">
import Header from '@/components/Header.vue'
import Article from '@/components/Article/Article.vue'
import { NEWS } from '@/common/constance'
</script>

<template>
  <!-- XOAAAAAAAAAAA -->

  <div class="OrganizationPostsListView">
    <Header :back="'/home'" :icon="2" :title="'새소식'"></Header>
    <Article :pathTo="'/what-new-detail'" :articleType="NEWS"></Article>
  </div>
</template>

<style lang="scss"></style>
