<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 scale-50 translate-y-8"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-50 translate-y-8"
  >
    <div 
      v-if="show"
      class="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-2xl border-2 border-yellow-400/50 max-w-sm"
    >
      <div class="flex items-center space-x-3">
        <div class="text-4xl animate-bounce">🎉</div>
        <div>
          <div class="text-xl font-bold">Level Up!</div>
          <div class="text-sm opacity-90">
            +{{ levelGain }} level{{ levelGain > 1 ? 's' : '' }}
          </div>
          <div class="text-xs opacity-75 mt-1">
            Level {{ newLevel }}
          </div>
        </div>
      </div>
      
      <div class="mt-3 text-xs opacity-90">
        Chúc mừng! Bạn đã trở nên mạnh mẽ hơn!
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  levelGain: {
    type: Number,
    default: 0
  },
  newLevel: {
    type: Number,
    default: 0
  }
})

// Auto hide after 3 seconds
watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      // Emit event to parent to hide notification
      emit('hide')
    }, 3000)
  }
})

// Emits
const emit = defineEmits(['hide'])
</script>
