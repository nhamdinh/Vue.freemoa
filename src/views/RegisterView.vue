<script setup lang="ts">
import { ref } from 'vue'
import Header from './../components/Header.vue'
import RegisterStep1 from '@/components/Register/RegisterStep1.vue'
import RegisterStep2 from '@/components/Register/RegisterStep2.vue'
import RegisterStep3 from '@/components/Register/RegisterStep3.vue'

const step = ref<any>(1)
</script>

<template>
  <div class="RegisterView">
    <div class="RegisterView__content" :class="step === 3 && 'mt-54px'">
      <Header v-if="step !== 3" :icon="2" :title="'회원가입'"></Header>

      <RegisterStep1 @setStep="step = 2" v-if="step === 1" />
      <RegisterStep2 @setStep="step = 3" v-if="step === 2" />
      <RegisterStep3 v-if="step === 3" />
    </div>
  </div>
</template>

<style lang="scss">
.RegisterView {
  width: 100%;
  .RegisterView__content {
    height: 100%;
    .top__RegisterView {
      padding: 0 16px;
      .title {
        font-family: SpoqaHanSansNeo;
        font-size: 26px;
        font-weight: normal;
        line-height: 30px;
        letter-spacing: -0.65px;
        text-align: left;
        color: #000;
      }
      .line__border {
        border-radius: 10px;
        border: solid 1px #c9d2db;
        background-color: #fff;
      }
      .line {
        padding: 0 14px;
        display: flex;
        height: 48px;
        width: 328px;

        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;
          gap: 6px;
          align-items: center;
        }
      }
      .label {
        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-weight: normal;
        line-height: 18px;
        letter-spacing: -0.38px;
        text-align: left;
        color: #242a37;
      }
    }
  }
}
</style>
