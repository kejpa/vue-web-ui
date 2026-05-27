import {useAuthStore} from '@/stores/auth'

export function registerAuthGuard(router) {
    router.beforeEach((to) => {
        const authStore = useAuthStore()

        if (to.meta.requiresAuth && !authStore.isAuthenticated) {
            return {
                path: '/login',
                query: {redirect: to.fullPath}
            }
        }

        return true
    })
}