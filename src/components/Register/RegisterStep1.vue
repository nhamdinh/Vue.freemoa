<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import right from './../../assets/svg/right.svg'
import { ref, watch, watchEffect } from 'vue'
const emits = defineEmits(['setStep'])

const id = ref<any>('')
const id1 = ref<any>('')
const id2 = ref<any>('전체약관 동의')
const user = ref<any>('')
const pass = ref<any>('')

const tab = ref<any>(1)
const countLocal = ref<any>(0)
const timer = ref<any>(0)
const isStart = ref<any>(false)

const dataFetch = ['abcd', 'abcdd', 'abcdzs']

const store = useCustomDialogStore()
const { openDialog } = store

const openDialogProp = () => {
  openDialog({
    stType: 'info',
    stTitle: '인증번호를 발송하였습니다.',
    stCancelText: 'THOII',
    stOkText: '확인',
    stClosable: false,
    actionConfirm: () => {
      countLocal.value = countLocal.value + 100
    },
    actionCancel: () => {},
    actionAfterClose: () => {
      countLocal.value = countLocal.value + 120
    }
  })
}
let countdown: any = null
watch(isStart, async (newQuestion, oldQuestion) => {
  if (isStart.value) {
    countdown = setInterval(() => {
      timer.value -= 1
    }, 1000)
  }

  return () => {
    clearInterval(countdown)
  }
})

watch(timer, async (newQuestion, oldQuestion) => {
  if (timer.value === 0) {
    clearInterval(countdown)
    isStart.value = false
  }
})

watchEffect(() => {
  // console.log(itemRefs.value.map(i => i.textContent))
  // setInterval(() => { startTimer() }, 1000);
})

const line1 = ref<any>(false)
const line2 = ref<any>(false)
const line3 = ref<any>(false)
const line4 = ref<any>(false)
const line5 = ref<any>(false)

const isNotValid = () => {
  return !line2.value || !line3.value || !line4.value || !line5.value
}
</script>

<template>
  <div class="top__RegisterView">
    <div class="title mt20px">서비스 이용을 위한 약관에</div>
    <div class="title">동의해주시기 바랍니다.</div>

    <div class="line line__border mt20px">
      <div
        class="left"
        @click="
          () => {
            if (line1) {
              line2 = false
              line3 = false
              line4 = false
              line5 = false
            } else {
              line2 = true
              line3 = true
              line4 = true
              line5 = true
            }
            line1 = !line1
          }
        "
      >
        <div :class="line2 && line3 && line4 && line5 ? 'check1' : 'uncheck'">
          <div
            class="uncheck__inside"
            :class="line2 && line3 && line4 && line5 ? 'check__inside' : 'uncheck__inside'"
          ></div>
        </div>

        <div class="label">전체약관 동의</div>
      </div>
    </div>
    <div class="line mt10px">
      <div class="left" @click="line2 = !line2">
        <div :class="line2 ? 'check1' : 'uncheck'">
          <div class="uncheck__inside" :class="line2 ? 'check__inside' : 'uncheck__inside'"></div>
        </div>

        <div class="label">메인비즈 이용약관 동의</div>
      </div>

      <img class="cursor__pointer" :src="right" alt="right" />
    </div>
    <div class="line">
      <div class="left" @click="line3 = !line3">
        <div :class="line3 ? 'check1' : 'uncheck'">
          <div class="uncheck__inside" :class="line3 ? 'check__inside' : 'uncheck__inside'"></div>
        </div>

        <div class="label">개인정보 수집이용 동의</div>
      </div>

      <img class="cursor__pointer" :src="right" alt="right" />
    </div>
    <div class="line">
      <div class="left" @click="line4 = !line4">
        <div :class="line4 ? 'check1' : 'uncheck'">
          <div class="uncheck__inside" :class="line4 ? 'check__inside' : 'uncheck__inside'"></div>
        </div>

        <div class="label">만 14세 이상 고객 확인</div>
      </div>

      <img class="cursor__pointer" :src="right" alt="right" />
    </div>
    <div class="line">
      <div class="left" @click="line5 = !line5">
        <div :class="line5 ? 'check1' : 'uncheck'">
          <div class="uncheck__inside" :class="line5 ? 'check__inside' : 'uncheck__inside'"></div>
        </div>

        <div class="label">마케팅 활용 동의</div>
      </div>

      <img class="cursor__pointer" :src="right" alt="right" />
    </div>
  </div>
  <div
    :class="isNotValid() ? 'check__disabled' : 'check__enabled'"
    class="mt154px mb29px"
    @click="
      () => {
        !isNotValid() && emits('setStep')
      }
    "
  >
    다음
  </div>
</template>

<style lang="scss"></style>
