<script setup lang="ts">
import { NOTIFICATION } from '@/common/constance'
import Header from '@/components/Header.vue'
import Inquiry from '@/components/Inquiry/Inquiry.vue'
</script>

<template>
  <div class="OrganizationPostsListView">
    <Header :back="'/my-info'" :icon="2" :title="'1:1 문의'"></Header>
    <Inquiry></Inquiry>
  </div>
</template>

<style lang="scss"></style>
