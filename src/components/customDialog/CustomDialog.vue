<template>
  <el-dialog
    v-if="stType === 'confirm'"
    v-model="stIsOpen"
    destroy-on-close
    @close="closeDialog"
    @closed="onActionAfterClose"
    class="CustomDialog__popup"
    modal-class="CustomDialog__wrap"
  >
    <div class="confirm__body pb20px">
      <div class="confirm__title">{{ stTitle }}</div>
      <div class="btns__confirm mt30px">
        <div class="btns__cancel" @click="onActionCancel">{{ stCancelText }}</div>
        <div class="btns__ok" @click="onActionConfirm">{{ stOkText }}</div>
      </div>
    </div>
  </el-dialog>
  <el-dialog
    v-if="stType === 'info'"
    destroy-on-close
    @close="closeDialog"
    @closed="onActionAfterClose"
    v-model="stIsOpen"
    class="CustomDialog__popup"
    modal-class="CustomDialog__wrap"
  >
    <div class="info__body pb20px">
      <div class="title">{{ stTitle }}</div>
      <div class="btns__info mt30px" @click="onActionConfirm">{{ stOkText }}</div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCustomDialogStore } from '@/stores/customDialog'
import { ref, watch, watchEffect, onMounted } from 'vue'

const store = useCustomDialogStore()

const { stIsOpen } = storeToRefs(store)
const { stClosable } = storeToRefs(store)
const { stType } = storeToRefs(store)
const { actionConfirm } = storeToRefs(store)
const { actionCancel } = storeToRefs(store)
const { actionAfterClose } = storeToRefs(store)
const { stTitle } = storeToRefs(store)
const { stContent } = storeToRefs(store)
const { stCancelText } = storeToRefs(store)
const { stOkText } = storeToRefs(store)

const { closeDialog } = store

const onActionCancel = () => {
  // console.log('onActionCancel')

  actionCancel.value()
  closeDialog()
}

const onActionConfirm = () => {
  // console.log('onActionConfirm')
  actionConfirm.value()
  closeDialog()
}

const onActionAfterClose = () => {
  // actionAfterClose.value()
  closeDialog()
}
</script>

<style lang="scss">
.el-overlay.CustomDialog__wrap {
  .el-overlay-dialog {
    .el-dialog.CustomDialog__popup {
      width: 330px;
      // height: 161px;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.16);
      background-color: #fff;
      border-radius: 20px;
      .el-dialog__header {
        display: none !important;
      }
      .el-dialog__body {
        padding: 0 !important;
        width: 100%;
        height: 100%;
      }
      .info__body {
        width: 100%;
        height: 100%;
        border-radius: 20px;
        background-color: #fff;
        .title {
          padding-top: 40px;
          display: flex;
          justify-content: center;
          align-items: center;

          font-family: SpoqaHanSansNeo;
          font-size: 18px;
          font-weight: 600;
          line-height: 22px;
          letter-spacing: -0.9px;
          text-align: center;
          color: #1f2933;
          white-space: pre-wrap;
        }

        .btns__info {
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;

          width: 298px;
          height: 49px;
          border-radius: 6px;
          background-color: #1767b3;

          font-family: SpoqaHanSansNeo;
          font-size: 16px;
          font-weight: 600;
          line-height: 18px;
          letter-spacing: -0.4px;
          text-align: center;
          color: #fff;
          cursor: pointer;
        }
      }

      // width: 400px  ;
      .confirm__body {
        width: 100%;
        height: 100%;
        border-radius: 20px;
        background-color: #fff;
        padding-top: 40px;
        .confirm__title {
          font-family: SpoqaHanSansNeo;
          font-size: 18px;
          font-weight: 600;
          line-height: 22px;
          letter-spacing: -0.9px;
          text-align: center;
          white-space: pre-wrap;
        }
        .content {
          display: flex;
          justify-content: center;
          align-items: center;

          font-size: 14px;
          font-weight: 600;
        }
        .btns__confirm {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          @mixin btn__confirm {
            width: 144px;
            height: 49px;
            border-radius: 6px;
            cursor: pointer;

            font-family: SpoqaHanSansNeo;
            font-size: 16px;
            font-weight: 500;
            line-height: 20px;
            letter-spacing: -0.4px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .btns__cancel {
            @include btn__confirm;
            background-color: #fff;
            color: #1767b3;
            border: solid 1px #1767b3;
          }
          .btns__ok {
            @include btn__confirm;
            background-color: #1767b3;
            color: #fff;
          }
        }
      }
    }
  }
}

.dialog-border-radius {
}
</style>
