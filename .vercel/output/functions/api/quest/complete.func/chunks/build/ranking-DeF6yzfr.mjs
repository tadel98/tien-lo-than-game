import { d as defineStore } from './server.mjs';
import { ref, computed } from 'vue';

const useRankingStore = defineStore("ranking", () => {
  const ranking = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const currentType = ref("level");
  const lastUpdated = ref(null);
  const topPlayers = computed(() => ranking.value);
  const topByLevel = computed(() => {
    return ranking.value.filter((_, index) => index < 10);
  });
  const topByCombatPower = computed(() => {
    return [...ranking.value].sort((a, b) => b.combatPower - a.combatPower).slice(0, 10);
  });
  const topByExperience = computed(() => {
    return [...ranking.value].sort((a, b) => b.experience - a.experience).slice(0, 10);
  });
  const playerRank = computed(() => {
    return (playerId) => {
      return ranking.value.findIndex((player) => player.id === playerId) + 1;
    };
  });
  const fetchRanking = async (type = "level", limit = 20) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch(`/api/ranking/top-players?type=${type}&limit=${limit}`);
      ranking.value = response.data.ranking;
      currentType.value = response.data.type;
      lastUpdated.value = response.data.lastUpdated;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching ranking:", err);
    } finally {
      loading.value = false;
    }
  };
  const refreshRanking = async () => {
    await fetchRanking(currentType.value);
  };
  const getPlayerStats = (playerId) => {
    return ranking.value.find((player) => player.id === playerId);
  };
  const getTopPlayersByType = (type, limit = 10) => {
    switch (type) {
      case "combat_power":
        return topByCombatPower.value.slice(0, limit);
      case "experience":
        return topByExperience.value.slice(0, limit);
      case "level":
      default:
        return topByLevel.value.slice(0, limit);
    }
  };
  const reset = () => {
    ranking.value = [];
    loading.value = false;
    error.value = null;
    currentType.value = "level";
    lastUpdated.value = null;
  };
  return {
    // State
    ranking,
    loading,
    error,
    currentType,
    lastUpdated,
    // Getters
    topPlayers,
    topByLevel,
    topByCombatPower,
    topByExperience,
    playerRank,
    // Actions
    fetchRanking,
    refreshRanking,
    getPlayerStats,
    getTopPlayersByType,
    reset
  };
});

export { useRankingStore as u };
//# sourceMappingURL=ranking-DeF6yzfr.mjs.map
