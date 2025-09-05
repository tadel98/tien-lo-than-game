import { d as defineStore } from "../server.mjs";
import { ref, computed } from "vue";
const useCharacterStore = defineStore("character", () => {
  const characterData = ref(null);
  const stats = ref(null);
  const equipment = ref([]);
  const skills = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const combatPower = computed(() => {
    return stats.value?.combatPower || 0;
  });
  const totalStats = computed(() => {
    return stats.value?.total || {};
  });
  const baseStats = computed(() => {
    return stats.value?.base || {};
  });
  const equippedItems = computed(() => {
    return equipment.value.filter((item) => item.isEquipped);
  });
  const learnedSkills = computed(() => {
    return skills.value.filter((skill) => skill.isLearned);
  });
  const fetchCharacterData = async (playerId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch(`/api/character/stats?playerId=${playerId}`);
      characterData.value = response.data.player;
      stats.value = response.data.stats;
      equipment.value = response.data.equipment;
      skills.value = response.data.skills;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching character data:", err);
    } finally {
      loading.value = false;
    }
  };
  const updateStats = async (playerId, newStats) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/character/stats/update", {
        method: "POST",
        body: {
          playerId,
          stats: newStats
        }
      });
      if (stats.value) {
        Object.assign(stats.value.base, newStats);
      }
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error updating stats:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const equipItem = async (playerId, equipmentId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/character/equipment/equip", {
        method: "POST",
        body: {
          playerId,
          equipmentId
        }
      });
      await fetchCharacterData(playerId);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error equipping item:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const unequipItem = async (playerId, equipmentId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/character/equipment/unequip", {
        method: "POST",
        body: {
          playerId,
          equipmentId
        }
      });
      await fetchCharacterData(playerId);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error unequipping item:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const learnSkill = async (playerId, skillId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/character/skills/learn", {
        method: "POST",
        body: {
          playerId,
          skillId
        }
      });
      await fetchCharacterData(playerId);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error learning skill:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const getStatColor = (stat) => {
    const colors = {
      hp: "#ef4444",
      mp: "#3b82f6",
      attack: "#f59e0b",
      defense: "#10b981",
      speed: "#8b5cf6",
      luck: "#f97316",
      wisdom: "#06b6d4",
      strength: "#84cc16",
      agility: "#ec4899",
      vitality: "#14b8a6",
      spirit: "#6366f1"
    };
    return colors[stat] || "#6b7280";
  };
  const getRarityColor = (rarity) => {
    const colors = {
      common: "#6b7280",
      uncommon: "#10b981",
      rare: "#3b82f6",
      epic: "#8b5cf6",
      legendary: "#f59e0b"
    };
    return colors[rarity] || "#6b7280";
  };
  const getSkillCategoryColor = (category) => {
    const colors = {
      combat: "#ef4444",
      cultivation: "#8b5cf6",
      crafting: "#f59e0b",
      passive: "#10b981",
      buff: "#06b6d4",
      debuff: "#f97316"
    };
    return colors[category] || "#6b7280";
  };
  const reset = () => {
    characterData.value = null;
    stats.value = null;
    equipment.value = [];
    skills.value = [];
    loading.value = false;
    error.value = null;
  };
  return {
    // State
    characterData,
    stats,
    equipment,
    skills,
    loading,
    error,
    // Getters
    combatPower,
    totalStats,
    baseStats,
    equippedItems,
    learnedSkills,
    // Actions
    fetchCharacterData,
    updateStats,
    equipItem,
    unequipItem,
    learnSkill,
    getStatColor,
    getRarityColor,
    getSkillCategoryColor,
    reset
  };
});
export {
  useCharacterStore as u
};
//# sourceMappingURL=character-BBuP_n1i.js.map
