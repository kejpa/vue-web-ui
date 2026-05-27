<script setup>

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['navigate'])

function navigate(route) {
  emit('navigate', route)
}

</script>

<template>
  <header class="app-header">
    <span class="app-header__title">
      App
    </span>

    <nav class="app-header__nav">
      <button
          v-for="item in items"
          :key="item.route"
          class="app-header__link"
          type="button"
          @click="navigate(item.route)"
      >
        {{ item.label }}
      </button>
    </nav>
  </header>
</template>