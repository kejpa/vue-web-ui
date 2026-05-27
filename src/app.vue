<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import SplashScreen from '@/components/SplashScreen.vue'
import { api } from '@/services/apiService'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

/**
 * True under initial bootstrap (cold start).
 * Splash visas så länge detta är true.
 */
const isInitializing = ref(true)

/**
 * Tom init-hook som appar kan fylla på.
 * Körs varje gång isAuthenticated går från false -> true.
 */
async function initializeApp() {
  // Medvetet tom i mallen
}

/**
 * Cold start:
 * Försök återställa session via /refresh.
 */
onMounted(async () => {
  try {
    await api.post('/refresh')
    authStore.setAuthenticated(true)
  } catch (err) {
    if (err?.status === 401) {
      authStore.setAuthenticated(false)
      router.replace('/login')
    } else {
      console.error('Unexpected initialization error', err)
    }
  } finally {
    isInitializing.value = false
  }
})

/**
 * Kör app-initiering varje gång användaren blir autentiserad.
 */
watch(
    () => authStore.isAuthenticated,
    async (isAuth, wasAuth) => {
      if (!wasAuth && isAuth) {
        await initializeApp()
      }
    }
)
</script>

<template>
  <SplashScreen v-if="isInitializing" />
  <router-view v-else />
</template>