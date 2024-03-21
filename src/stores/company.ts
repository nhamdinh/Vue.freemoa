import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCompanyStore = defineStore('company', () => {
    const stCompany = ref<any>({})
    const stRoomChat = ref<any>({})
    const stIsFilter = ref<any>(false)


    function setIsFilter(state: any) {
        stIsFilter.value = state?.stIsFilter ?? stIsFilter.value
    }
    function setCompany(state: any) {
        stCompany.value = state?.stCompany ?? stCompany.value
    }

    function setRoomChat(state: any) {
        stRoomChat.value = state?.stRoomChat ?? stRoomChat.value
    }

    return {
        stCompany,
        setCompany,
        stRoomChat,
        setRoomChat,
        stIsFilter,
        setIsFilter
    }
})
