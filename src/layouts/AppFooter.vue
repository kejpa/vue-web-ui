<script setup>
import { APP_VERSION } from '@/services/appVersion'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <span class="app-footer__copyright">
      © Kjell Hansen 2026 {{ year !== 2026 ? ` -- ${ year}` : `` }}
    </span>

    <span class="app-footer__version">
      version: {{ APP_VERSION }}
    </span>
  </footer>
</template>
<style scoped>
.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 2.5rem;
  padding: 0 1rem;

  font-size: 0.75rem;
}

.app-footer__version {
  font-family: monospace;
}
</style>