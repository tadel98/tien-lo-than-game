<template>
  <div class="game-container mystical-bg">
    <NuxtPage />
    <AutoSaveStatus />
  </div>
</template>

<script setup>
// Global setup for the game
import { useAutoSave } from '~/composables/useAutoSave'

// Initialize auto-save
useAutoSave()
</script>
