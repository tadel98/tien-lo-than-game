<template>
  <div class="character-panel game-card p-6 rounded-lg">
    <h2 class="text-2xl font-bold text-center mb-6 text-white">
      👤 Thông Tin Nhân Vật
    </h2>

    <!-- Combat Power -->
    <div class="text-center mb-6">
      <div class="text-sm text-game-text-secondary mb-1">Sức Mạnh Chiến Đấu</div>
      <div class="text-3xl font-bold text-yellow-400">
        {{ combatPower.toLocaleString() }}
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div 
        v-for="(value, stat) in totalStats" 
        :key="stat"
        class="bg-game-light/50 p-3 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm text-game-text-secondary capitalize">
            {{ getStatDisplayName(stat) }}
          </span>
          <span 
            class="text-lg font-semibold"
            :style="{ color: getStatColor(stat) }"
          >
            {{ value }}
          </span>
        </div>
        <div v-if="baseStats[stat] !== value" class="text-xs text-game-text-secondary mt-1">
          Base: {{ baseStats[stat] }} +{{ value - baseStats[stat] }}
        </div>
      </div>
    </div>

    <!-- Equipment Section -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-white mb-4">Trang Bị</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div 
          v-for="slot in equipmentSlots" 
          :key="slot.name"
          class="bg-game-light/30 p-3 rounded-lg text-center"
        >
          <div class="text-2xl mb-2">{{ slot.icon }}</div>
          <div class="text-xs text-game-text-secondary mb-1">{{ slot.displayName }}</div>
          <div 
            v-if="getEquippedItem(slot.slot)"
            class="text-sm font-semibold"
            :style="{ color: getRarityColor(getEquippedItem(slot.slot).equipment.rarity) }"
          >
            {{ getEquippedItem(slot.slot).equipment.displayName }}
          </div>
          <div v-else class="text-xs text-game-text-secondary">Trống</div>
        </div>
      </div>
    </div>

    <!-- Skills Section -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-white mb-4">Kỹ Năng</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div 
          v-for="skill in learnedSkills" 
          :key="skill.id"
          class="bg-game-light/30 p-3 rounded-lg"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-white">{{ skill.skill.displayName }}</span>
            <span 
              class="text-xs px-2 py-1 rounded"
              :style="{ 
                backgroundColor: getSkillCategoryColor(skill.skill.category) + '20',
                color: getSkillCategoryColor(skill.skill.category)
              }"
            >
              {{ skill.skill.category }}
            </span>
          </div>
          <div class="text-sm text-game-text-secondary mb-2">
            {{ skill.skill.description }}
          </div>
          <div class="flex items-center justify-between text-xs">
            <span>Cấp {{ skill.level }}/{{ skill.skill.maxLevel }}</span>
            <span v-if="skill.skill.cooldown > 0">
              CD: {{ skill.skill.cooldown }}s
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Character Info -->
    <div class="bg-game-light/30 p-4 rounded-lg">
      <h3 class="text-lg font-semibold text-white mb-3">Thông Tin Cơ Bản</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="flex justify-between">
          <span class="text-game-text-secondary">Tên:</span>
          <span class="text-white">{{ characterData?.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-game-text-secondary">Cấp:</span>
          <span class="text-white">{{ characterData?.level }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-game-text-secondary">Cảnh giới:</span>
          <span class="text-white">{{ characterData?.realm }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-game-text-secondary">Kinh nghiệm:</span>
          <span class="text-white">{{ Number(characterData?.experience || 0).toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
      <p class="text-red-400 text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
const characterStore = useCharacterStore()

// Props
const props = defineProps({
  playerId: {
    type: String,
    required: true
  }
})

// Computed
const characterData = computed(() => characterStore.characterData)
const stats = computed(() => characterStore.stats)
const equipment = computed(() => characterStore.equipment)
const skills = computed(() => characterStore.skills)
const loading = computed(() => characterStore.loading)
const error = computed(() => characterStore.error)
const combatPower = computed(() => characterStore.combatPower)
const totalStats = computed(() => characterStore.totalStats)
const baseStats = computed(() => characterStore.baseStats)
const equippedItems = computed(() => characterStore.equippedItems)
const learnedSkills = computed(() => characterStore.learnedSkills)

// Equipment slots
const equipmentSlots = [
  { name: 'weapon', displayName: 'Vũ Khí', icon: '⚔️' },
  { name: 'armor', displayName: 'Giáp', icon: '🛡️' },
  { name: 'helmet', displayName: 'Mũ', icon: '⛑️' },
  { name: 'accessory', displayName: 'Trang Sức', icon: '💍' }
]

// Methods
const getStatDisplayName = (stat) => {
  const names = {
    hp: 'Máu',
    mp: 'Pháp Lực',
    attack: 'Tấn Công',
    defense: 'Phòng Thủ',
    speed: 'Tốc Độ',
    luck: 'May Mắn',
    wisdom: 'Trí Tuệ',
    strength: 'Sức Mạnh',
    agility: 'Nhanh Nhẹn',
    vitality: 'Sinh Lực',
    spirit: 'Tinh Thần'
  }
  return names[stat] || stat
}

const getEquippedItem = (slot) => {
  return equippedItems.value.find(item => item.equipment.type.slot === slot)
}

const getStatColor = (stat) => characterStore.getStatColor(stat)
const getRarityColor = (rarity) => characterStore.getRarityColor(rarity)
const getSkillCategoryColor = (category) => characterStore.getSkillCategoryColor(category)

// Initialize
onMounted(async () => {
  await characterStore.fetchCharacterData(props.playerId)
})
</script>
