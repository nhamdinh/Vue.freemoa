<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from 'vue'
const loading = ref<any>(true)
</script>

<template>
  <div class="skeleton__card ml16px">
    <el-space direction="vertical" alignment="flex-start">
      <el-skeleton style="width: 240px" :loading="loading" animated>
        <template #template>
          <div style="display: flex; gap: 10px; align-items: center; justify-items: space-between">
            <el-skeleton-item
              variant="image"
              style="width: 40px; height: 40px; border-radius: 50%"
            />
            <el-skeleton-item variant="h3" style="width: 50%" />
          </div>
          <div style="margin-top: 16px">
            <div
              style="
                display: flex;
                align-items: center;
                justify-items: space-between;
                gap: 16px;

                margin-top: 16px;
                height: 16px;
              "
            >
              <el-skeleton-item variant="h3" style="width: 50%" />
              <el-skeleton-item variant="text" style="width: 30%" />
            </div>
            <div
              style="
                display: flex;
                align-items: center;
                justify-items: space-between;
                gap: 16px;
                margin-top: 16px;
                height: 16px;
              "
            >
              <el-skeleton-item variant="text" />
              <el-skeleton-item variant="text" style="width: 30%" />
            </div>
            <div
              style="
                display: flex;
                align-items: center;
                justify-items: space-between;
                gap: 16px;
                margin-top: 16px;
                height: 16px;
              "
            >
              <el-skeleton-item variant="text" />
              <el-skeleton-item variant="text" style="width: 40%" />
            </div>
          </div>
        </template>
      </el-skeleton>
    </el-space>
  </div>
</template>

<style lang="scss">
.skeleton__card {
  width: 310px;
  min-width: 310px;
  height: 197px;
  border-radius: 10px;
  box-shadow: 0 0 6px 0 rgba(71, 133, 185, 0.2);
  background-color: #fff;
  padding: 20px;
}
</style>
