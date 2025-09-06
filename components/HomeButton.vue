<template>
  <NuxtLink 
    to="/" 
    :class="[
      'inline-flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105',
      variant === 'primary' 
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg' 
        : variant === 'secondary'
        ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-600 hover:border-gray-500'
        : 'bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 hover:border-white/30'
    ]"
  >
    <span class="text-lg mr-2">🏠</span>
    <span>{{ text }}</span>
  </NuxtLink>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'Trang Chủ'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'glass'].includes(value)
  }
})
</script>
