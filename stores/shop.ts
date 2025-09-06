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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerId,
          shopId,
          itemId,
          quantity
        })
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

  // Kiểm tra có thể mua item không
  const canPurchaseItem = (item: any, playerLevel: number, playerResources: any[]) => {
    // Kiểm tra cấp độ
    if (playerLevel < item.level) {
      return { canPurchase: false, reason: `Cần cấp độ ${item.level}` }
    }

    // Kiểm tra tài nguyên
    const currencyResource = playerResources.find(r => r.name === item.currency)
    if (!currencyResource || Number(currencyResource.amount) < item.price) {
      return { canPurchase: false, reason: `Không đủ ${getCurrencyName(item.currency)}` }
    }

    // Kiểm tra stock
    if (item.stock !== -1 && item.stock <= 0) {
      return { canPurchase: false, reason: 'Hết hàng' }
    }

    return { canPurchase: true, reason: '' }
  }

  // Lấy tên tiền tệ
  const getCurrencyName = (currency: string) => {
    const currencies = {
      tien_ngoc: 'Tiên Ngọc',
      linh_thach: 'Linh Thạch',
      nguyen_thach: 'Nguyên Thạch'
    }
    return currencies[currency] || currency
  }

  // Tính toán giá với giảm giá
  const calculatePrice = (item: any, quantity: number = 1) => {
    let totalPrice = item.price * quantity
    
    // Giảm giá theo số lượng
    if (quantity >= 10) {
      totalPrice *= 0.9 // Giảm 10%
    } else if (quantity >= 5) {
      totalPrice *= 0.95 // Giảm 5%
    }
    
    return Math.floor(totalPrice)
  }

  // Lấy thông tin chi tiết trang bị
  const getEquipmentStats = (item: any) => {
    if (item.itemType !== 'equipment') return null
    
    return {
      slot: item.equipmentSlot || 'unknown',
      stats: item.stats || {},
      durability: item.durability || 100,
      maxDurability: item.maxDurability || 100,
      enhancement: item.enhancement || 0,
      maxEnhancement: item.maxEnhancement || 10
    }
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
    canPurchaseItem,
    getCurrencyName,
    calculatePrice,
    getEquipmentStats,
    reset
  }
})
