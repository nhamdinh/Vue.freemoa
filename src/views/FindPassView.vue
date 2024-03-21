<script setup lang="ts">
import FindPass from '@/components/FindPass/FindPass.vue'
</script>

<template>
  <FindPass />
</template>

<style lang="scss">
.FindAccView {
  width: 100%;
}
.FindPassView__content {

  .err {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: normal;
    line-height: 14px;
    letter-spacing: -0.3px;
    color: #f3485b;
  }
  .top__FindIdView {
    padding: 0 16px;

    .label {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: normal;
      line-height: 14px;
      letter-spacing: -0.6px;
      text-align: left;
      color: #252a36;
    }
    .line {
      display: flex;
      justify-content: space-between;
      .relative {
        position: relative;
      }
      .clock {
        position: absolute;
        right: 15px;
        top: 13px;
        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: -0.75px;
        color: #f3485b;
      }
      .btn {
        width: 120px;
        height: 46px;
        border-radius: 10px;
        background-color: #1767b3;
        display: flex;
        align-items: center;
        justify-content: center;

        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #fff;
        cursor: pointer;
      }
    }
  }

  .el-input {
    width: 198px;
    height: 46px;
  }
}
</style>
