import { d as defineStore } from "../server.mjs";
import { ref, computed } from "vue";
const useShopStore = defineStore("shop", () => {
  const shops = ref([]);
  const currentShop = ref(null);
  const inventory = ref([]);
  const groupedInventory = ref({});
  const loading = ref(false);
  const error = ref(null);
  const getShopByCategory = (category) => {
    return shops.value.filter((shop) => shop.category === category);
  };
  const getInventoryByType = (itemType) => {
    return groupedInventory.value[itemType] || [];
  };
  const getTotalItems = computed(() => {
    return inventory.value.reduce((total, item) => total + item.quantity, 0);
  });
  const fetchShops = async (category) => {
    try {
      loading.value = true;
      error.value = null;
      const params = category ? `?category=${category}` : "";
      const response = await $fetch(`/api/shop/list${params}`);
      shops.value = response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching shops:", err);
    } finally {
      loading.value = false;
    }
  };
  const fetchInventory = async (playerId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch(`/api/inventory/list?playerId=${playerId}`);
      inventory.value = response.data.inventory;
      groupedInventory.value = response.data.grouped;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching inventory:", err);
    } finally {
      loading.value = false;
    }
  };
  const purchaseItem = async (playerId, shopId, itemId, quantity = 1) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/shop/purchase", {
        method: "POST",
        body: {
          playerId,
          shopId,
          itemId,
          quantity
        }
      });
      await fetchInventory(playerId);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error purchasing item:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const setCurrentShop = (shop) => {
    currentShop.value = shop;
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
  const getItemTypeIcon = (itemType) => {
    const icons = {
      equipment: "⚔️",
      consumable: "🧪",
      material: "💎",
      skill: "📜",
      talent: "⭐"
    };
    return icons[itemType] || "📦";
  };
  const reset = () => {
    shops.value = [];
    currentShop.value = null;
    inventory.value = [];
    groupedInventory.value = {};
    loading.value = false;
    error.value = null;
  };
  return {
    // State
    shops,
    currentShop,
    inventory,
    groupedInventory,
    loading,
    error,
    // Getters
    getShopByCategory,
    getInventoryByType,
    getTotalItems,
    // Actions
    fetchShops,
    fetchInventory,
    purchaseItem,
    setCurrentShop,
    getRarityColor,
    getItemTypeIcon,
    reset
  };
});
export {
  useShopStore as u
};
//# sourceMappingURL=shop-DYNcnUVr.js.map
