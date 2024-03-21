<script setup lang="ts">
import { getFileName } from '@/common/commonFunction'
defineProps(['prStData'])

let module = 'src="'
</script>

<template>
  <div class="ViewImage">
    <img class="img__chat" :src="getFileName(prStData.content, module)" alt="" />
  </div>
</template>

<style lang="scss">
.ViewImage {
  .img__chat {
    width: 360px;
    max-width: 360px;
    height: auto;
  }
}
</style>
