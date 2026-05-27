import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useAuthStore = defineStore('auth', () => {
    /**
     * En enda källa till sanning för autentisering.
     */
    const isAuthenticated = ref(false)

    /**
     * Sätt auth-status.
     * Används av App-init (refresh) och Login-vyn.
     */
    function setAuthenticated(value) {
        isAuthenticated.value = value
    }

    /**
     * Logout hook.
     * Appen kan bygga vidare (API-call etc.) ovanpå detta.
     */
    function logout() {
        isAuthenticated.value = false
    }

    return {
        isAuthenticated,
        setAuthenticated,
        logout
    }
})