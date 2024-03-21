<script setup lang="ts">
import mainlogo from '@/assets/img/mainlogo.png'
const emits = defineEmits(['setStep'])
</script>
<template>
  <div class="Intro1 mt-54px" @click="emits('setStep')">
    <div class="top__HomeView3">
      <img :src="mainlogo" alt="" />
    </div>
  </div>
</template>

<style lang="scss">
.Intro1 {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .top__HomeView3 {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
</style>
