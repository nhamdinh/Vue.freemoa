<script setup lang="ts">
import Header from './../components/Header.vue'
import InquiryCreate from '@/components/Inquiry/InquiryCreate.vue'
import { ref, watch, watchEffect, onMounted } from 'vue'

const step = ref<any>(1)
</script>

<template>
  <div class="InquiryView">
    <div class="InquiryView__content">
      <Header :back="'/inquiry-list'" :icon="2" :title="'1:1 문의'"></Header>
      <InquiryCreate />
    </div>
  </div>
</template>

<style lang="scss">
.InquiryView {
  width: 100%;
  .InquiryView__content {
  }
}
</style>
