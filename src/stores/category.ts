import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', () => {
    const stCategoryLabel = ref<any>('')
    const stCategoryValue = ref<any>('')
    // console.log(stCategory)
    function setCategoryLabel(state: any) {
        stCategoryLabel.value = state?.stCategoryLabel || stCategoryLabel.value
    }
    function setCategoryValue(state: any) {
        stCategoryValue.value = state?.stCategoryValue || stCategoryValue.value
    }

    return {
        setCategoryLabel,
        setCategoryValue,
        stCategoryLabel,
        stCategoryValue,
    }
})
