import { d as defineStore } from './server.mjs';
import { ref } from 'vue';

const usePlayerStore = defineStore("player", () => {
  const player = ref(null);
  const resources = ref([]);
  const companions = ref([]);
  const achievements = ref([]);
  const quests = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const getResourceByName = (name) => {
    return resources.value.find((r) => r.resource.name === name);
  };
  const getActiveCompanions = () => {
    return companions.value.filter((c) => c.isActive);
  };
  const getCompletedQuests = () => {
    return quests.value.filter((q) => q.status === "completed");
  };
  const fetchPlayer = async (playerId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch(`/api/player/${playerId}`);
      const { data } = response;
      player.value = data;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching player:", err);
    } finally {
      loading.value = false;
    }
  };
  const fetchResources = async (playerId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch(`/api/player/resources?playerId=${playerId}`);
      const { data } = response;
      resources.value = data;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching resources:", err);
    } finally {
      loading.value = false;
    }
  };
  const fetchCompanions = async (playerId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch(`/api/player/companions?playerId=${playerId}`);
      const { data } = response;
      companions.value = data;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching companions:", err);
    } finally {
      loading.value = false;
    }
  };
  const updateResource = async (playerId, resourceId, amount, locked = 0) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/player/resources/update", {
        method: "POST",
        body: {
          playerId,
          resourceId,
          amount,
          locked
        }
      });
      const index = resources.value.findIndex((r) => r.resourceId === resourceId);
      if (index !== -1) {
        resources.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error updating resource:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const updatePlayer = async (playerId, updates) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/player/update", {
        method: "POST",
        body: {
          playerId,
          ...updates
        }
      });
      if (player.value) {
        Object.assign(player.value, response.data);
      }
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error updating player:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const addResource = async (playerId, resourceName, amount) => {
    const resource = getResourceByName(resourceName);
    if (!resource) {
      throw new Error(`Resource ${resourceName} not found`);
    }
    const newAmount = Number(resource.amount) + amount;
    return await updateResource(playerId, resource.resourceId, newAmount, resource.locked);
  };
  const spendResource = async (playerId, resourceName, amount) => {
    const resource = getResourceByName(resourceName);
    if (!resource) {
      throw new Error(`Resource ${resourceName} not found`);
    }
    if (Number(resource.amount) < amount) {
      throw new Error(`Kh\xF4ng \u0111\u1EE7 ${resourceName}`);
    }
    const newAmount = Number(resource.amount) - amount;
    return await updateResource(playerId, resource.resourceId, newAmount, resource.locked);
  };
  const initializePlayer = async (playerId) => {
    await Promise.all([
      fetchPlayer(playerId),
      fetchResources(playerId),
      fetchCompanions(playerId)
    ]);
  };
  const reset = () => {
    player.value = null;
    resources.value = [];
    companions.value = [];
    achievements.value = [];
    quests.value = [];
    loading.value = false;
    error.value = null;
  };
  return {
    // State
    player,
    resources,
    companions,
    achievements,
    quests,
    loading,
    error,
    // Getters
    getResourceByName,
    getActiveCompanions,
    getCompletedQuests,
    // Actions
    fetchPlayer,
    fetchResources,
    fetchCompanions,
    updateResource,
    updatePlayer,
    addResource,
    spendResource,
    initializePlayer,
    reset
  };
});

export { usePlayerStore as u };
//# sourceMappingURL=player-B72JDVVQ.mjs.map
