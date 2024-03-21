import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const stProfile = ref<any>({})
    // console.log(stProfile)
    function setProfile(state: any) {
        stProfile.value = state?.stProfile || stProfile.value
    }

    return {
        setProfile,
        stProfile,
    }
})
