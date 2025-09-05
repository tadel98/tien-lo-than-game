import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFurnaceStore = defineStore('furnace', () => {
  // State
  const furnaces = ref<any[]>([])
  const recipes = ref<any[]>([])
  const recentCrafting = ref<any[]>([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getRecipesByCategory = (category: string) => {
    return recipes.value.filter(recipe => recipe.category === category)
  }

  const getRecipeById = (id: string) => {
    return recipes.value.find(recipe => recipe.id === id)
  }

  const getFurnaceById = (id: string) => {
    return furnaces.value.find(furnace => furnace.furnace.id === id)
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      alchemy: '🧪',
      forging: '🔨',
      crafting: '⚒️'
    }
    return icons[category] || '🔧'
  }

  const getCategoryName = (category: string) => {
    const names = {
      alchemy: 'Luyện Đan',
      forging: 'Luyện Khí',
      crafting: 'Chế Tạo'
    }
    return names[category] || category
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 0.8) return '#10b981' // green
    if (rate >= 0.6) return '#f59e0b' // yellow
    if (rate >= 0.4) return '#f97316' // orange
    return '#ef4444' // red
  }

  // Actions
  const fetchFurnaceStatus = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch(`/api/furnace/status?playerId=${playerId}`)
      furnaces.value = response.data.furnaces
      recipes.value = response.data.recipes
      recentCrafting.value = response.data.recentCrafting
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching furnace status:', err)
    } finally {
      loading.value = false
    }
  }

  const craftItem = async (playerId: string, recipeId: string, quantity: number = 1) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/furnace/craft', {
        method: 'POST',
        body: {
          playerId,
          recipeId,
          quantity
        }
      })

      // Refresh furnace status after crafting
      await fetchFurnaceStatus(playerId)

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error crafting item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const canCraft = (recipe: any, inventory: any[]) => {
    if (!recipe) return false
    
    try {
      const materials = JSON.parse(recipe.materials)
      
      for (const [materialName, requiredAmount] of Object.entries(materials)) {
        const inventoryItem = inventory.find((item: any) => item.name === materialName)
        if (!inventoryItem || inventoryItem.quantity < (requiredAmount as number)) {
          return false
        }
      }
      
      return true
    } catch (e) {
      return false
    }
  }

  const getRequiredMaterials = (recipe: any) => {
    if (!recipe) return []
    
    try {
      const materials = JSON.parse(recipe.materials)
      return Object.entries(materials).map(([name, amount]) => ({
        name,
        amount: Number(amount)
      }))
    } catch (e) {
      return []
    }
  }

  const getCraftResult = (recipe: any) => {
    if (!recipe) return []
    
    try {
      const result = JSON.parse(recipe.result)
      return Object.entries(result).map(([name, amount]) => ({
        name,
        amount: Number(amount)
      }))
    } catch (e) {
      return []
    }
  }

  // Reset store
  const reset = () => {
    furnaces.value = []
    recipes.value = []
    recentCrafting.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    furnaces,
    recipes,
    recentCrafting,
    loading,
    error,

    // Getters
    getRecipesByCategory,
    getRecipeById,
    getFurnaceById,
    getCategoryIcon,
    getCategoryName,
    getSuccessRateColor,

    // Actions
    fetchFurnaceStatus,
    craftItem,
    canCraft,
    getRequiredMaterials,
    getCraftResult,
    reset
  }
})
