<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from 'vue'
const loading = ref<any>(true)
</script>

<template>
  <div class="SkeletonProductTop ml16px">
    <el-space direction="vertical" alignment="flex-start">
      <el-skeleton style="width: 240px" :loading="loading" animated>
        <template #template>
          <el-skeleton-item
            variant="image"
            style="width: 164px; height: 100px; border-radius: 10px"
          />
          <div
            style="
              display: flex;
              align-items: center;
              justify-items: space-between;
              gap: 16px;
              margin-top: 8px;
              height: 16px;
            "
          >
            <el-skeleton-item variant="h3" style="width: 30%" />
            <el-skeleton-item variant="text" style="width: 20%" />
          </div>
          <el-skeleton-item variant="h3" style="width: 50%; margin-top: 8px" />
        </template>
      </el-skeleton>
    </el-space>
  </div>
</template>

<style lang="scss">
.SkeletonProductTop {
  border-radius: 10px;
  background-color: #fff;
  width: 164px;
  height: 180px;
  min-width: 164px;
}
</style>
