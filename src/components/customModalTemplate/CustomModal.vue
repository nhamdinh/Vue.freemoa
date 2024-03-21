<template>
  <el-dialog
    destroy-on-close
    @close="cancelDialogProp"
    @closed="afterCloseDialogProp"
    v-if="stType !== 'info' && stType !== 'confirm'"
    v-model="stIsOpen"
    modal-class="CustomModal__wrap"
    :class="checkClassType(stType)"
  >
    <ChangePassword v-if="stType === 'ChangePassword'"></ChangePassword>
    <ChangePhone v-if="stType === 'ChangePhone'"></ChangePhone>
    <Report :prStData="stData" v-if="stType === 'Report'"></Report>
    <ViewImage :prStData="stData" v-if="stType === 'ViewImage'"></ViewImage>
    <DeliveryMenu :prStData="stData" v-if="stType === 'DeliveryMenu'"></DeliveryMenu>
    <DeliveryFriends :prStData="stData" v-if="stType === 'DeliveryFriends'"></DeliveryFriends>
    <CategoryList
      @onCloseDialog="closeDialog"
      :prStData="stData"
      v-if="stType === 'CategoryList'"
    ></CategoryList>
  </el-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCustomDialogStore } from '@/stores/customDialog'
import ChangePassword from './ChangePassword.vue'
import Report from './Report.vue'
import DeliveryFriends from './DeliveryFriends/DeliveryFriends.vue'
import DeliveryMenu from './DeliveryMenu.vue'
import ChangePhone from './ChangePhone.vue'
import CategoryList from './CategoryList.vue'
import ViewImage from './ViewImage.vue'

const store = useCustomDialogStore()

const { stIsOpen } = storeToRefs(store)
const { stData } = storeToRefs(store)
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

const cancelDialogProp = () => {
  actionCancel.value()
  closeDialog()
}

const confirmDialogProp = () => {
  actionConfirm.value()
  closeDialog()
}

const afterCloseDialogProp = () => {
  actionAfterClose.value()
  closeDialog()
}

const checkClassType = (stType: any) => {
  switch (stType) {
    case 'ChangePassword':
      return 'CustomModal__popup__ChangePassword'
    case 'Report':
      return 'CustomModal__popup__Report'
    case 'DeliveryFriends':
      return 'CustomModal__popup__DeliveryFriends'
    case 'DeliveryMenu':
      return 'CustomModal__popup__DeliveryMenu'
    case 'ChangePhone':
      return 'CustomModal__popup__ChangePhone'
    case 'CategoryList':
      return 'CustomModal__popup__CategoryList'
    case 'ViewImage':
      return 'CustomModal__popup__ViewImage'
    default:
      return ''
  }
}
</script>

<style lang="scss">
.el-overlay.CustomModal__wrap {
  .el-overlay-dialog {
    .el-dialog.CustomModal__popup__ChangePassword {
      width: 328px;
      height: 404px;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.16);
      background-color: #fff;
      border-radius: 10px;
      .el-dialog__header {
        display: none !important;
      }
      .el-dialog__body {
        padding: 0 !important;
        width: 100%;
        height: 100%;
      }
    }
    .el-dialog.CustomModal__popup__Report {
      width: 328px;
      height: 278px;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.16);
      background-color: #fff;
      border-radius: 10px;

      .el-dialog__header {
        display: none !important;
      }
      .el-dialog__body {
        padding: 0 !important;
        width: 100%;
        height: 100%;
      }
    }
    .el-dialog.CustomModal__popup__DeliveryFriends {
      width: 328px;
      height: 466px;
      min-width: 328px;
      min-height: 466px;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.16);
      background-color: #fff;
      border-radius: 10px;

      .el-dialog__header {
        display: none !important;
      }
      .el-dialog__body {
        padding: 0 !important;
        width: 100%;
        height: 100%;
      }
    }
    .el-dialog.CustomModal__popup__DeliveryMenu {
      width: 328px;
      height: 157px;
      min-width: 328px;
      min-height: 157px;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.16);
      background-color: #fff;
      border-radius: 10px;

      .el-dialog__header {
        display: none !important;
      }
      .el-dialog__body {
        padding: 0 !important;
        width: 100%;
        height: 100%;
      }
    }

    .el-dialog.CustomModal__popup__ChangePhone {
      width: 328px;
      height: 281px;
      min-width: 328px;
      min-height: 281px;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.16);
      background-color: #fff;
      border-radius: 10px;

      .el-dialog__header {
        display: none !important;
      }
      .el-dialog__body {
        padding: 0 !important;
        width: 100%;
        height: 100%;
      }
    }

    .el-dialog.CustomModal__popup__CategoryList {
      width: 328px;
      min-width: 328px;
      min-height: 196px;
      border-radius: 4px;
      box-shadow: 0 0 10px 0 rgba(4, 67, 126, 0.16);
      background-color: #fff;

      .el-dialog__header {
        display: none !important;
      }
      .el-dialog__body {
        padding: 0 !important;
        width: 100%;
        height: 100%;
      }
    }

    .el-dialog.CustomModal__popup__ViewImage {
      width: 360px;
      min-width: 360px;
      height: 180px;
      // border-radius: 4px;
      box-shadow: 0 0 10px 0 rgba(4, 67, 126, 0.16);
      background-color: transparent;

      .el-dialog__header {
        display: none !important;
      }
      .el-dialog__body {
        padding: 0 !important;
        width: 100%;
        height: 100%;
      }
    }
  }
}

.dialog-border-radius {
}
</style>
