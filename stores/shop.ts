import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useShopStore = defineStore('shop', () => {
  // State
  const shops = ref<any[]>([])
  const currentShop = ref<any>(null)
  const inventory = ref<any[]>([])
  const groupedInventory = ref<any>({})
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getShopByCategory = (category: string) => {
    return shops.value.filter(shop => shop.category === category)
  }

  const getInventoryByType = (itemType: string) => {
    return groupedInventory.value[itemType] || []
  }

  const getTotalItems = computed(() => {
    return inventory.value.reduce((total, item) => total + item.quantity, 0)
  })

  // Actions
  const fetchShops = async (category?: string) => {
    try {
      loading.value = true
      error.value = null

      const params = category ? `?category=${category}` : ''
      const response: any = await $fetch(`/api/shop/list${params}`)
      shops.value = response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching shops:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchInventory = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch(`/api/inventory/list?playerId=${playerId}`)
      inventory.value = response.data.inventory
      groupedInventory.value = response.data.grouped
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching inventory:', err)
    } finally {
      loading.value = false
    }
  }

  const purchaseItem = async (playerId: string, shopId: string, itemId: string, quantity: number = 1) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/shop/purchase', {
        method: 'POST',
        body: {
          playerId,
          shopId,
          itemId,
          quantity
        }
      })

      // Refresh inventory after purchase
      await fetchInventory(playerId)

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error purchasing item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentShop = (shop: any) => {
    currentShop.value = shop
  }

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#6b7280',
      uncommon: '#10b981',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b'
    }
    return colors[rarity] || '#6b7280'
  }

  const getItemTypeIcon = (itemType: string) => {
    const icons = {
      equipment: '⚔️',
      consumable: '🧪',
      material: '💎',
      skill: '📜',
      talent: '⭐'
    }
    return icons[itemType] || '📦'
  }

  // Reset store
  const reset = () => {
    shops.value = []
    currentShop.value = null
    inventory.value = []
    groupedInventory.value = {}
    loading.value = false
    error.value = null
  }

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
  }
})
