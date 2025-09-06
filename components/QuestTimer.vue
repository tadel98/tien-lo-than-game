<template>
  <div class="quest-timer">
    <div v-if="cooldownRemaining > 0" class="cooldown-display">
      <div class="timer-icon">⏰</div>
      <div class="timer-text">
        <div class="time-remaining">{{ formattedTime }}</div>
        <div class="time-label">Cooldown</div>
      </div>
      <div class="progress-ring">
        <svg class="progress-ring-svg" width="40" height="40">
          <circle
            class="progress-ring-circle-bg"
            stroke="#374151"
            stroke-width="3"
            fill="transparent"
            r="16"
            cx="20"
            cy="20"
          />
          <circle
            class="progress-ring-circle"
            :stroke="progressColor"
            stroke-width="3"
            fill="transparent"
            r="16"
            cx="20"
            cy="20"
            :style="circleStyle"
          />
        </svg>
      </div>
    </div>
    <div v-else class="available-display">
      <div class="available-icon">✅</div>
      <div class="available-text">Sẵn sàng</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  cooldownRemaining: {
    type: Number,
    default: 0
  },
  totalCooldown: {
    type: Number,
    default: 0
  }
})

const currentCooldown = ref(props.cooldownRemaining)
let interval = null

const formattedTime = computed(() => {
  const minutes = Math.floor(currentCooldown.value / 60)
  const seconds = currentCooldown.value % 60
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${seconds}s`
  }
})

const progressPercentage = computed(() => {
  if (props.totalCooldown === 0) return 0
  return ((props.totalCooldown - currentCooldown.value) / props.totalCooldown) * 100
})

const progressColor = computed(() => {
  const percentage = progressPercentage.value
  if (percentage < 30) return '#ef4444' // red
  if (percentage < 60) return '#f59e0b' // yellow
  return '#10b981' // green
})

const circleStyle = computed(() => {
  const circumference = 2 * Math.PI * 16
  const offset = circumference - (progressPercentage.value / 100) * circumference
  return {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: offset,
    transition: 'stroke-dashoffset 1s ease-in-out'
  }
})

onMounted(() => {
  if (currentCooldown.value > 0) {
    interval = setInterval(() => {
      if (currentCooldown.value > 0) {
        currentCooldown.value--
      } else {
        clearInterval(interval)
      }
    }, 1000)
  }
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style scoped>
.quest-timer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cooldown-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(55, 65, 81, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(55, 65, 81, 0.2);
}

.available-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.timer-icon {
  font-size: 16px;
  color: #f59e0b;
}

.available-icon {
  font-size: 16px;
  color: #10b981;
}

.timer-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-remaining {
  font-size: 14px;
  font-weight: bold;
  color: #f59e0b;
  font-family: 'Courier New', monospace;
}

.time-label {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
}

.available-text {
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
}

.progress-ring {
  position: relative;
}

.progress-ring-svg {
  transform: rotate(-90deg);
}

.progress-ring-circle {
  transition: stroke-dashoffset 1s ease-in-out;
}

.progress-ring-circle-bg {
  opacity: 0.3;
}
</style>
