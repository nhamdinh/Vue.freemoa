<script setup lang="ts">
import Header from '@/components/Header.vue'
import OraServicesList from '@/components/OraServicesList/OraServicesList.vue'
</script>

<template>
  <div class="OrganizationPostsListView">
    <Header :back="'/home'" :icon="2" :title="'기관별 주요 지원서비스'"></Header>
    <OraServicesList
      :pathTo="'/service-detail-organization'"
    ></OraServicesList>
  </div>
</template>

<style lang="scss"></style>
