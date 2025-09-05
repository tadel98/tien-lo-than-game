import { _ as __nuxt_component_0 } from './nuxt-link-CnYqct-M.mjs';
import { computed, ref, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-EzXceMbr.mjs';
import { u as usePlayerStore } from './player-B72JDVVQ.mjs';
import { u as useShopStore } from './shop-DYNcnUVr.mjs';
import { d as defineStore } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const useFurnaceStore = defineStore("furnace", () => {
  const furnaces = ref([]);
  const recipes = ref([]);
  const recentCrafting = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const getRecipesByCategory = (category) => {
    return recipes.value.filter((recipe) => recipe.category === category);
  };
  const getRecipeById = (id) => {
    return recipes.value.find((recipe) => recipe.id === id);
  };
  const getFurnaceById = (id) => {
    return furnaces.value.find((furnace) => furnace.furnace.id === id);
  };
  const getCategoryIcon = (category) => {
    const icons = {
      alchemy: "\u{1F9EA}",
      forging: "\u{1F528}",
      crafting: "\u2692\uFE0F"
    };
    return icons[category] || "\u{1F527}";
  };
  const getCategoryName = (category) => {
    const names = {
      alchemy: "Luy\u1EC7n \u0110an",
      forging: "Luy\u1EC7n Kh\xED",
      crafting: "Ch\u1EBF T\u1EA1o"
    };
    return names[category] || category;
  };
  const getSuccessRateColor = (rate) => {
    if (rate >= 0.8) return "#10b981";
    if (rate >= 0.6) return "#f59e0b";
    if (rate >= 0.4) return "#f97316";
    return "#ef4444";
  };
  const fetchFurnaceStatus = async (playerId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch(`/api/furnace/status?playerId=${playerId}`);
      furnaces.value = response.data.furnaces;
      recipes.value = response.data.recipes;
      recentCrafting.value = response.data.recentCrafting;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching furnace status:", err);
    } finally {
      loading.value = false;
    }
  };
  const craftItem = async (playerId, recipeId, quantity = 1) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/furnace/craft", {
        method: "POST",
        body: {
          playerId,
          recipeId,
          quantity
        }
      });
      await fetchFurnaceStatus(playerId);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error crafting item:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const canCraft = (recipe, inventory) => {
    if (!recipe) return false;
    try {
      const materials = JSON.parse(recipe.materials);
      for (const [materialName, requiredAmount] of Object.entries(materials)) {
        const inventoryItem = inventory.find((item) => item.name === materialName);
        if (!inventoryItem || inventoryItem.quantity < requiredAmount) {
          return false;
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  };
  const getRequiredMaterials = (recipe) => {
    if (!recipe) return [];
    try {
      const materials = JSON.parse(recipe.materials);
      return Object.entries(materials).map(([name, amount]) => ({
        name,
        amount: Number(amount)
      }));
    } catch (e) {
      return [];
    }
  };
  const getCraftResult = (recipe) => {
    if (!recipe) return [];
    try {
      const result = JSON.parse(recipe.result);
      return Object.entries(result).map(([name, amount]) => ({
        name,
        amount: Number(amount)
      }));
    } catch (e) {
      return [];
    }
  };
  const reset = () => {
    furnaces.value = [];
    recipes.value = [];
    recentCrafting.value = [];
    loading.value = false;
    error.value = null;
  };
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
  };
});
const _sfc_main = {
  __name: "furnace",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const playerStore = usePlayerStore();
    const shopStore = useShopStore();
    const furnaceStore = useFurnaceStore();
    const isAuthenticated = computed(() => authStore.isLoggedIn);
    const player = computed(() => playerStore.player);
    computed(() => playerStore.resources);
    const furnaces = computed(() => furnaceStore.furnaces);
    const recipes = computed(() => furnaceStore.recipes);
    const recentCrafting = computed(() => furnaceStore.recentCrafting);
    const loading = computed(() => furnaceStore.loading);
    const error = computed(() => furnaceStore.error);
    const selectedCategory = ref("all");
    const recipeCategories = [
      { name: "all", displayName: "T\u1EA5t C\u1EA3", icon: "\u{1F527}" },
      { name: "alchemy", displayName: "Luy\u1EC7n \u0110an", icon: "\u{1F9EA}" },
      { name: "forging", displayName: "Luy\u1EC7n Kh\xED", icon: "\u{1F528}" },
      { name: "crafting", displayName: "Ch\u1EBF T\u1EA1o", icon: "\u2692\uFE0F" }
    ];
    const filteredRecipes = computed(() => {
      if (selectedCategory.value === "all") {
        return recipes.value;
      }
      return recipes.value.filter((recipe) => recipe.category === selectedCategory.value);
    });
    const getResourceAmount = (resourceName) => {
      const resource = playerStore.getResourceByName(resourceName);
      return resource ? Number(resource.amount).toLocaleString() : "0";
    };
    const getCategoryIcon = (category) => furnaceStore.getCategoryIcon(category);
    const getCategoryName = (category) => furnaceStore.getCategoryName(category);
    const getSuccessRateColor = (rate) => furnaceStore.getSuccessRateColor(rate);
    const getRequiredMaterials = (recipe) => furnaceStore.getRequiredMaterials(recipe);
    const getCraftResult = (recipe) => furnaceStore.getCraftResult(recipe);
    const getRecipeCount = (category) => {
      if (category === "all") {
        return recipes.value.length;
      }
      return recipes.value.filter((recipe) => recipe.category === category).length;
    };
    const canCraftRecipe = (recipe) => {
      if (!player.value || player.value.level < recipe.level) return false;
      return furnaceStore.canCraft(recipe, shopStore.inventory);
    };
    watch(isAuthenticated, async (newValue) => {
      if (newValue && authStore.user?.player) {
        await playerStore.initializePlayer(authStore.user.player.id);
        await shopStore.fetchInventory(authStore.user.player.id);
        await furnaceStore.fetchFurnaceStatus(authStore.user.player.id);
      } else {
        furnaceStore.reset();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" }, _attrs))}><header class="bg-black/50 backdrop-blur-sm border-b border-purple-500/30"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-16"><div class="flex items-center space-x-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-2xl font-bold text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u{1F525} \u0110\u1EA1o L\xF4 `);
          } else {
            return [
              createTextVNode(" \u{1F525} \u0110\u1EA1o L\xF4 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center space-x-6"><div class="text-center"><p class="text-sm text-game-text-secondary">Ti\xEAn Ng\u1ECDc</p><p class="text-lg font-semibold text-yellow-400">${ssrInterpolate(getResourceAmount("tien_ngoc"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Linh Th\u1EA1ch</p><p class="text-lg font-semibold text-blue-400">${ssrInterpolate(getResourceAmount("linh_thach"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Nguy\xEAn Th\u1EA1ch</p><p class="text-lg font-semibold text-green-400">${ssrInterpolate(getResourceAmount("nguyen_thach"))}</p></div></div><div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "game-button px-6 py-2 rounded-lg text-white font-semibold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u{1F3E0} Trang Ch\u1EE7 `);
          } else {
            return [
              createTextVNode(" \u{1F3E0} Trang Ch\u1EE7 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="game-button px-6 py-2 rounded-lg text-white font-semibold"> \u{1F6AA} \u0110\u0103ng Xu\u1EA5t </button></div></div></div></header><main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="mb-8"><div class="game-card p-6 rounded-lg"><h2 class="text-2xl font-bold text-white mb-4">Tr\u1EA1ng Th\xE1i L\xF2 \u0110\u1EA1o</h2>`);
      if (unref(furnaces).length === 0) {
        _push(`<div class="text-center py-8"><div class="text-6xl mb-4">\u{1F525}</div><div class="text-xl text-white mb-2">Ch\u01B0a c\xF3 l\xF2 \u0111\u1EA1o</div><div class="text-game-text-secondary">H\xE3y mua l\xF2 \u0111\u1EA1o t\u1EA1i c\u1EEDa h\xE0ng!</div></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
        ssrRenderList(unref(furnaces), (playerFurnace) => {
          _push(`<div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700"><div class="flex items-center justify-between mb-3"><h3 class="text-lg font-semibold text-white">${ssrInterpolate(playerFurnace.furnace.displayName)}</h3><span class="text-2xl">${ssrInterpolate(playerFurnace.furnace.icon)}</span></div><div class="space-y-2"><div class="flex justify-between"><span class="text-sm text-game-text-secondary">C\u1EA5p \u0111\u1ED9:</span><span class="text-sm text-white">${ssrInterpolate(playerFurnace.level)}/${ssrInterpolate(playerFurnace.furnace.maxLevel)}</span></div><div class="flex justify-between"><span class="text-sm text-game-text-secondary">Kinh nghi\u1EC7m:</span><span class="text-sm text-white">${ssrInterpolate(playerFurnace.experience)}</span></div><div class="flex justify-between"><span class="text-sm text-game-text-secondary">Hi\u1EC7u su\u1EA5t:</span><span class="text-sm text-green-400">${ssrInterpolate((playerFurnace.furnace.efficiency * 100).toFixed(1))}%</span></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div><div class="mb-8"><h2 class="text-2xl font-bold text-white mb-4">C\xF4ng Th\u1EE9c Ch\u1EBF T\u1EA1o</h2><div class="grid grid-cols-2 md:grid-cols-3 gap-4"><!--[-->`);
      ssrRenderList(recipeCategories, (category) => {
        _push(`<button class="${ssrRenderClass([
          "p-4 rounded-lg border-2 transition-all duration-300",
          unref(selectedCategory) === category.name ? "border-purple-500 bg-purple-500/20" : "border-gray-600 bg-gray-800/50 hover:border-purple-400"
        ])}"><div class="text-center"><div class="text-3xl mb-2">${ssrInterpolate(category.icon)}</div><div class="text-sm font-semibold text-white">${ssrInterpolate(category.displayName)}</div><div class="text-xs text-game-text-secondary">${ssrInterpolate(getRecipeCount(category.name))} c\xF4ng th\u1EE9c</div></div></button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-8"><div class="text-white">\u0110ang t\u1EA3i c\xF4ng th\u1EE9c...</div></div>`);
      } else if (unref(error)) {
        _push(`<div class="text-center py-8"><div class="text-red-400">L\u1ED7i: ${ssrInterpolate(unref(error))}</div></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(filteredRecipes), (recipe) => {
          _push(`<div class="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300"><div class="flex items-center justify-between mb-4"><div class="flex items-center space-x-3"><span class="text-2xl">${ssrInterpolate(getCategoryIcon(recipe.category))}</span><div><h3 class="text-lg font-semibold text-white">${ssrInterpolate(recipe.displayName)}</h3><div class="text-xs text-game-text-secondary">${ssrInterpolate(getCategoryName(recipe.category))}</div></div></div></div><p class="text-sm text-game-text-secondary mb-4">${ssrInterpolate(recipe.description)}</p><div class="mb-4"><h4 class="text-sm font-semibold text-white mb-2">Nguy\xEAn li\u1EC7u c\u1EA7n:</h4><div class="space-y-1"><!--[-->`);
          ssrRenderList(getRequiredMaterials(recipe), (material) => {
            _push(`<div class="flex justify-between text-xs"><span class="text-game-text-secondary">${ssrInterpolate(material.name)}</span><span class="text-white">${ssrInterpolate(material.amount)}</span></div>`);
          });
          _push(`<!--]--></div></div><div class="mb-4"><h4 class="text-sm font-semibold text-white mb-2">K\u1EBFt qu\u1EA3:</h4><div class="space-y-1"><!--[-->`);
          ssrRenderList(getCraftResult(recipe), (result) => {
            _push(`<div class="flex justify-between text-xs"><span class="text-game-text-secondary">${ssrInterpolate(result.name)}</span><span class="text-green-400">${ssrInterpolate(result.amount)}</span></div>`);
          });
          _push(`<!--]--></div></div><div class="mb-4 space-y-2"><div class="flex justify-between"><span class="text-xs text-game-text-secondary">C\u1EA5p \u0111\u1ED9 y\xEAu c\u1EA7u:</span><span class="text-xs text-white">${ssrInterpolate(recipe.level)}</span></div><div class="flex justify-between"><span class="text-xs text-game-text-secondary">T\u1EF7 l\u1EC7 th\xE0nh c\xF4ng:</span><span class="text-xs font-semibold" style="${ssrRenderStyle({ color: getSuccessRateColor(recipe.successRate) })}">${ssrInterpolate((recipe.successRate * 100).toFixed(1))}% </span></div><div class="flex justify-between"><span class="text-xs text-game-text-secondary">Kinh nghi\u1EC7m:</span><span class="text-xs text-blue-400">${ssrInterpolate(recipe.experience)}</span></div></div><button${ssrIncludeBooleanAttr(!canCraftRecipe(recipe) || unref(loading)) ? " disabled" : ""} class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white transition-all duration-300">${ssrInterpolate(canCraftRecipe(recipe) ? "Ch\u1EBF T\u1EA1o" : "Thi\u1EBFu nguy\xEAn li\u1EC7u")}</button></div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (unref(recentCrafting).length > 0) {
        _push(`<div class="mt-12"><h2 class="text-2xl font-bold text-white mb-4">L\u1ECBch S\u1EED Ch\u1EBF T\u1EA1o</h2><div class="game-card p-6 rounded-lg"><div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(recentCrafting), (craft) => {
          _push(`<div class="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"><div class="flex items-center space-x-3"><span class="text-lg">${ssrInterpolate(getCategoryIcon(craft.recipe.category))}</span><div><div class="text-white font-semibold">${ssrInterpolate(craft.recipe.displayName)}</div><div class="text-xs text-game-text-secondary">${ssrInterpolate(new Date(craft.createdAt).toLocaleString())}</div></div></div><div class="text-right"><div class="${ssrRenderClass([craft.success ? "text-green-400" : "text-red-400", "text-sm font-semibold"])}">${ssrInterpolate(craft.success ? "Th\xE0nh c\xF4ng" : "Th\u1EA5t b\u1EA1i")}</div><div class="text-xs text-game-text-secondary">x${ssrInterpolate(craft.quantity)}</div></div></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/furnace.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=furnace-BSCg30a9.mjs.map
