<script setup>
import {useRouter} from 'vue-router'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const router = useRouter()

const menuItems = [
  {label: 'Home', route: '/'},
  {label: 'Admin', route: '/admin'}
]

function navigateTo(route) {
  router.push(route)
}
</script>

<template>
  <div class="app-layout">
    <AppHeader
        :items="menuItems"
        @navigate="navigateTo"
    />
    <main class="app-main">
      <router-view/>
    </main>

    <AppFooter/>
  </div>
</template>