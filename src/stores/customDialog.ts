import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCustomDialogStore = defineStore('customDialog', () => {
  const stIsReport = ref<boolean>(false)
  const stIsOpen = ref<boolean>(false)
  const stType = ref<string>('info')
  const stClosable = ref<boolean>(true)
  const stTitle = ref<string>('Title')
  const stContent = ref<string>('Content')
  const stCancelText = ref<string>('Cancel')
  const stOkText = ref<string>('Ok')
  const stData = ref<any>({})
  const actionConfirm = ref<any>(() => { })
  const actionCancel = ref<any>(() => { })
  const actionAfterClose = ref<any>(() => { })

  function openDialog(state: any) {
    stIsOpen.value = true
    stData.value = state?.stData || stData.value
    stType.value = state?.stType || stType.value
    stTitle.value = state?.stTitle || stTitle.value
    stContent.value = state?.stContent || stContent.value
    stCancelText.value = state?.stCancelText || stCancelText.value
    stOkText.value = state?.stOkText || stOkText.value
    stClosable.value = state?.stClosable === false ? false : true
    actionConfirm.value = state?.actionConfirm || actionConfirm.value
    actionCancel.value = state?.actionCancel || actionCancel.value
    actionAfterClose.value = state?.actionAfterClose || actionAfterClose.value
  }

  function closeDialog() {
    stIsOpen.value = false
  }

  function trueReport() {
    stIsReport.value = true
    console.log(stIsReport.value)
  }

  function falseReport() {
    stIsReport.value = false
  }
  return {
    stIsReport,
    stIsOpen,
    stData,
    stType,
    stClosable,
    stTitle,
    stContent,
    stCancelText,
    stOkText,
    actionConfirm,
    actionCancel,
    actionAfterClose,
    openDialog,
    closeDialog,
    trueReport,
    falseReport
  }
})
