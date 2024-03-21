<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'

const props = defineProps(['member'])

const productOnMember = ref<any>(props.member?.productListByCompany)
</script>

<template>
  <p
    v-for="(zzz, index) in productOnMember.filter((prod: any, ind: number) => ind === 0)"
    :key="index"
    @click="router.push({ path: '/product-detail', query: { id: zzz?.id } })"
  >
    {{ zzz?.name }}
  </p>
</template>

<style lang="scss"></style>
