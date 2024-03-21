<script setup lang="ts">
import LoginIntro2 from '@/components/login/LoginIntro2.vue'
import LoginIntro from '@/components/login/LoginIntro.vue'
import { ref, watch, watchEffect, onMounted } from 'vue'

const step = ref<any>(2)
</script>

<template>
  <div class="LoginView">
    <LoginIntro @setStep="step = 2" v-if="step === 1" />

    <LoginIntro2 @setStep="step = 1" v-else />
  </div>
</template>

<style lang="scss">
.LoginView {
  width: 100%;
  .LoginView__content {
    display: flex;
    flex-direction: column;
    .err {
    font-family: SpoqaHanSansNeo;
    font-size: 12px;
    font-weight: normal;
    line-height: 14px;
    letter-spacing: -0.3px;
    color: #f3485b;
    padding-left: 16px;
  }
    .big__title {
      font-family: SpoqaHanSansNeo;
      font-size: 40px;
      font-weight: bold;
      line-height: 50px;
      letter-spacing: -1px;
      text-align: center;
      color: #000;
    }
    @mixin btn {
      width: 328px;
      height: 49px;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;

      font-family: SpoqaHanSansNeo;
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
      letter-spacing: -0.4px;
      margin: 0 auto;
      cursor: pointer;
      position: relative;
    }
    .btn__kakao {
      @include btn;
      background-color: #fee500;
      color: #242a37;
      .kakao {
        position: absolute;
        left: 12px;
      }
    }
    .btn__keyfill {
      @include btn;
      background-color: #f58220;
      color: #fff;
      .keyfill {
        position: absolute;
        left: 15px;
      }
    }

    .login__other {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: bold;
      line-height: 28px;
      letter-spacing: -0.3px;
      color: #242a37;
      display: flex;
      gap: 4px;
      justify-content: center;
      align-items: center;
    }
    .how {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: 500;
      line-height: 28px;
      letter-spacing: -0.3px;
      text-align: center;
      color: #9ba5b1;
      text-decoration: underline;
      cursor: pointer;
    }

    /* dsa */
    .btn__login__enabled {
      @include btn;
      background-color: #1767b3;
      color: #fff;
      cursor: pointer;
    }
    .btn__login__disabled {
      @include btn;
      background-color: #cbd2da;
      color: #52606d;
      cursor: not-allowed;
    }

    .find__id {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: 500;
      line-height: 14px;
      letter-spacing: -0.3px;
      color: #9ba5b1;
    }

    .btn__bae {
      @include btn;
      border: solid 1px #1767b3;
      background-color: #fff;
      flex-direction: column;
      .acc__temp {
        font-family: SpoqaHanSansNeo;
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: -0.4px;
        color: #1767b3;
      }
      .did__acc__temp {
        font-family: SpoqaHanSansNeo;
        font-size: 10px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 10px;
        letter-spacing: -0.25px;
        color: #55606c;
      }
    }
    .did__member {
      font-family: SpoqaHanSansNeo;
      font-size: 13px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: -0.65px;
      color: #9ba5b1;
      text-align: center;
    }
    .member {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #9ba5b1;
      text-align: center;
      text-decoration: underline;
    }
    .el-input {
      margin: 0 auto;
      width: 328px;
      height: 46px;
    }
  }
}
</style>
