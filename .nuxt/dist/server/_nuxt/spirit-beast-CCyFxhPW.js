import { _ as __nuxt_component_0 } from "./nuxt-link-CnYqct-M.js";
import { ref, computed, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderAttr } from "vue/server-renderer";
import { u as useAuthStore } from "./auth-EzXceMbr.js";
import { u as usePlayerStore } from "./player-B72JDVVQ.js";
import { d as defineStore } from "../server.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/ufo/dist/index.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/hookable/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/unctx/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/radix3/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/defu/dist/defu.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/klona/dist/index.mjs";
const useSpiritBeastStore = defineStore("spiritBeast", () => {
  const spiritBeasts = ref([]);
  const beastTypes = ref([]);
  const foods = ref([]);
  const huntingGrounds = ref([]);
  const recentHunting = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const getBeastsByType = (typeId) => {
    return spiritBeasts.value.filter((beast) => beast.typeId === typeId);
  };
  const getActiveBeasts = () => {
    return spiritBeasts.value.filter((beast) => beast.isActive);
  };
  const getFightingBeasts = () => {
    return spiritBeasts.value.filter((beast) => beast.isFighting);
  };
  const getBeastTypeById = (id) => {
    return beastTypes.value.find((type) => type.id === id);
  };
  const getFoodById = (id) => {
    return foods.value.find((food) => food.id === id);
  };
  const getHuntingGroundById = (id) => {
    return huntingGrounds.value.find((ground) => ground.id === id);
  };
  const getCategoryColor = (category) => {
    const colors = {
      common: "#6b7280",
      rare: "#3b82f6",
      epic: "#8b5cf6",
      legendary: "#f59e0b",
      mythical: "#ef4444"
    };
    return colors[category] || "#6b7280";
  };
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "#10b981",
      normal: "#f59e0b",
      hard: "#f97316",
      extreme: "#ef4444"
    };
    return colors[difficulty] || "#6b7280";
  };
  const getBeastStatusColor = (beast) => {
    if (beast.health < 30) return "#ef4444";
    if (beast.happiness < 30) return "#f97316";
    if (beast.hunger < 30) return "#f59e0b";
    return "#10b981";
  };
  const getBeastStatusText = (beast) => {
    if (beast.health < 30) return "Bị thương";
    if (beast.happiness < 30) return "Buồn bã";
    if (beast.hunger < 30) return "Đói";
    return "Khỏe mạnh";
  };
  const fetchSpiritBeastStatus = async (playerId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch(`/api/spirit-beast/status?playerId=${playerId}`);
      spiritBeasts.value = response.data.spiritBeasts;
      beastTypes.value = response.data.beastTypes;
      foods.value = response.data.foods;
      huntingGrounds.value = response.data.huntingGrounds;
      recentHunting.value = response.data.recentHunting;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching spirit beast status:", err);
    } finally {
      loading.value = false;
    }
  };
  const huntBeast = async (playerId, groundId) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch("/api/spirit-beast/hunt", {
        method: "POST",
        body: {
          playerId,
          groundId
        }
      });
      await fetchSpiritBeastStatus(playerId);
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("Error hunting beast:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const feedBeast = async (playerId, beastId, foodId, quantity = 1) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch("/api/spirit-beast/feed", {
        method: "POST",
        body: {
          playerId,
          beastId,
          foodId,
          quantity
        }
      });
      await fetchSpiritBeastStatus(playerId);
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("Error feeding beast:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const canHuntAtGround = (ground, playerLevel) => {
    return playerLevel >= ground.level;
  };
  const getBeastStats = (beast) => {
    try {
      return JSON.parse(beast.stats);
    } catch (e) {
      return {};
    }
  };
  const getBeastSkills = (beast) => {
    try {
      return beast.skills ? JSON.parse(beast.skills) : [];
    } catch (e) {
      return [];
    }
  };
  const getFoodEffects = (food) => {
    try {
      return JSON.parse(food.effects);
    } catch (e) {
      return {};
    }
  };
  const getGroundBeastTypes = (ground) => {
    try {
      return JSON.parse(ground.beastTypes);
    } catch (e) {
      return {};
    }
  };
  const getGroundDropRates = (ground) => {
    try {
      return JSON.parse(ground.dropRates);
    } catch (e) {
      return {};
    }
  };
  const reset = () => {
    spiritBeasts.value = [];
    beastTypes.value = [];
    foods.value = [];
    huntingGrounds.value = [];
    recentHunting.value = [];
    loading.value = false;
    error.value = null;
  };
  return {
    // State
    spiritBeasts,
    beastTypes,
    foods,
    huntingGrounds,
    recentHunting,
    loading,
    error,
    // Getters
    getBeastsByType,
    getActiveBeasts,
    getFightingBeasts,
    getBeastTypeById,
    getFoodById,
    getHuntingGroundById,
    getCategoryColor,
    getDifficultyColor,
    getBeastStatusColor,
    getBeastStatusText,
    // Actions
    fetchSpiritBeastStatus,
    huntBeast,
    feedBeast,
    canHuntAtGround,
    getBeastStats,
    getBeastSkills,
    getFoodEffects,
    getGroundBeastTypes,
    getGroundDropRates,
    reset
  };
});
const _sfc_main = {
  __name: "spirit-beast",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const playerStore = usePlayerStore();
    const spiritBeastStore = useSpiritBeastStore();
    const isAuthenticated = computed(() => authStore.isLoggedIn);
    const player = computed(() => playerStore.player);
    computed(() => playerStore.resources);
    const spiritBeasts = computed(() => spiritBeastStore.spiritBeasts);
    computed(() => spiritBeastStore.beastTypes);
    const foods = computed(() => spiritBeastStore.foods);
    const huntingGrounds = computed(() => spiritBeastStore.huntingGrounds);
    computed(() => spiritBeastStore.recentHunting);
    const loading = computed(() => spiritBeastStore.loading);
    computed(() => spiritBeastStore.error);
    const activeTab = ref("beasts");
    const showFeedModal = ref(false);
    const selectedBeast = ref(null);
    const selectedFood = ref(null);
    const feedQuantity = ref(1);
    const tabs = [
      { name: "beasts", displayName: "Linh Thú", icon: "🐾" },
      { name: "hunting", displayName: "Săn Bắt", icon: "🏹" },
      { name: "feeding", displayName: "Cho Ăn", icon: "🍖" }
    ];
    const getActiveBeasts = computed(() => spiritBeastStore.getActiveBeasts());
    const getFightingBeasts = computed(() => spiritBeastStore.getFightingBeasts());
    const getAverageLevel = computed(() => {
      if (spiritBeasts.value.length === 0) return 0;
      const totalLevel = spiritBeasts.value.reduce((sum, beast) => sum + beast.level, 0);
      return Math.round(totalLevel / spiritBeasts.value.length);
    });
    const getResourceAmount = (resourceName) => {
      const resource = playerStore.getResourceByName(resourceName);
      return resource ? Number(resource.amount).toLocaleString() : "0";
    };
    const getCategoryColor = (category) => spiritBeastStore.getCategoryColor(category);
    const getDifficultyColor = (difficulty) => spiritBeastStore.getDifficultyColor(difficulty);
    const canHuntAtGround = (ground, playerLevel) => spiritBeastStore.canHuntAtGround(ground, playerLevel);
    const getBeastStats = (beast) => spiritBeastStore.getBeastStats(beast);
    const getCurrencyName = (currency) => {
      const currencies = {
        tien_ngoc: "Tiên Ngọc",
        linh_thach: "Linh Thạch",
        nguyen_thach: "Nguyên Thạch"
      };
      return currencies[currency] || currency;
    };
    watch(isAuthenticated, async (newValue) => {
      if (newValue && authStore.user?.player) {
        await playerStore.initializePlayer(authStore.user.player.id);
        await spiritBeastStore.fetchSpiritBeastStatus(authStore.user.player.id);
      } else {
        spiritBeastStore.reset();
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
            _push2(` 🐾 Linh Thú `);
          } else {
            return [
              createTextVNode(" 🐾 Linh Thú ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center space-x-6"><div class="text-center"><p class="text-sm text-game-text-secondary">Tiên Ngọc</p><p class="text-lg font-semibold text-yellow-400">${ssrInterpolate(getResourceAmount("tien_ngoc"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Linh Thạch</p><p class="text-lg font-semibold text-blue-400">${ssrInterpolate(getResourceAmount("linh_thach"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Nguyên Thạch</p><p class="text-lg font-semibold text-green-400">${ssrInterpolate(getResourceAmount("nguyen_thach"))}</p></div></div><div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "game-button px-6 py-2 rounded-lg text-white font-semibold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 🏠 Trang Chủ `);
          } else {
            return [
              createTextVNode(" 🏠 Trang Chủ ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="game-button px-6 py-2 rounded-lg text-white font-semibold"> 🚪 Đăng Xuất </button></div></div></div></header><main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="mb-8"><div class="flex space-x-1 bg-gray-800/50 p-1 rounded-lg"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([
          "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
          unref(activeTab) === tab.name ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-700"
        ])}"><div class="flex items-center justify-center space-x-2"><span class="text-lg">${ssrInterpolate(tab.icon)}</span><span>${ssrInterpolate(tab.displayName)}</span></div></button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(activeTab) === "beasts") {
        _push(`<div class="space-y-8"><div class="game-card p-6 rounded-lg"><h2 class="text-2xl font-bold text-white mb-4">Thống Kê Linh Thú</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-4"><div class="text-center"><div class="text-2xl font-bold text-blue-400">${ssrInterpolate(unref(spiritBeasts).length)}</div><div class="text-sm text-game-text-secondary">Tổng Linh Thú</div></div><div class="text-center"><div class="text-2xl font-bold text-green-400">${ssrInterpolate(unref(getActiveBeasts).length)}</div><div class="text-sm text-game-text-secondary">Đang Hoạt Động</div></div><div class="text-center"><div class="text-2xl font-bold text-purple-400">${ssrInterpolate(unref(getFightingBeasts).length)}</div><div class="text-sm text-game-text-secondary">Đang Chiến Đấu</div></div><div class="text-center"><div class="text-2xl font-bold text-yellow-400">${ssrInterpolate(unref(getAverageLevel))}</div><div class="text-sm text-game-text-secondary">Cấp Trung Bình</div></div></div></div>`);
        if (unref(spiritBeasts).length === 0) {
          _push(`<div class="text-center py-12"><div class="text-6xl mb-4">🐾</div><div class="text-xl text-white mb-2">Chưa có linh thú nào</div><div class="text-game-text-secondary">Hãy đi săn để thu thập linh thú!</div></div>`);
        } else {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
          ssrRenderList(unref(spiritBeasts), (beast) => {
            _push(`<div class="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300"><div class="flex items-center justify-between mb-4"><div class="flex items-center space-x-3"><span class="text-3xl">${ssrInterpolate(beast.type.icon)}</span><div><h3 class="text-lg font-semibold text-white">${ssrInterpolate(beast.name)}</h3><div class="flex items-center space-x-2"><span class="px-2 py-1 rounded text-xs font-semibold" style="${ssrRenderStyle({
              backgroundColor: getCategoryColor(beast.type.category) + "20",
              color: getCategoryColor(beast.type.category)
            })}">${ssrInterpolate(beast.type.category.toUpperCase())}</span><span class="text-xs text-game-text-secondary">Cấp ${ssrInterpolate(beast.level)}</span></div></div></div></div><div class="mb-4 space-y-2"><div class="flex justify-between"><span class="text-sm text-game-text-secondary">Sức khỏe:</span><div class="flex items-center space-x-2"><div class="w-16 bg-gray-700 rounded-full h-2"><div class="bg-red-500 h-2 rounded-full transition-all duration-300" style="${ssrRenderStyle({ width: `${beast.health}%` })}"></div></div><span class="text-sm text-white">${ssrInterpolate(beast.health)}%</span></div></div><div class="flex justify-between"><span class="text-sm text-game-text-secondary">Hạnh phúc:</span><div class="flex items-center space-x-2"><div class="w-16 bg-gray-700 rounded-full h-2"><div class="bg-yellow-500 h-2 rounded-full transition-all duration-300" style="${ssrRenderStyle({ width: `${beast.happiness}%` })}"></div></div><span class="text-sm text-white">${ssrInterpolate(beast.happiness)}%</span></div></div><div class="flex justify-between"><span class="text-sm text-game-text-secondary">Độ no:</span><div class="flex items-center space-x-2"><div class="w-16 bg-gray-700 rounded-full h-2"><div class="bg-green-500 h-2 rounded-full transition-all duration-300" style="${ssrRenderStyle({ width: `${beast.hunger}%` })}"></div></div><span class="text-sm text-white">${ssrInterpolate(beast.hunger)}%</span></div></div></div><div class="mb-4"><h4 class="text-sm font-semibold text-white mb-2">Thống kê:</h4><div class="grid grid-cols-2 gap-2 text-xs"><!--[-->`);
            ssrRenderList(getBeastStats(beast), (value, stat) => {
              _push(`<div class="flex justify-between"><span class="text-game-text-secondary">${ssrInterpolate(stat)}:</span><span class="text-white">${ssrInterpolate(value)}</span></div>`);
            });
            _push(`<!--]--></div></div><div class="flex space-x-2"><button${ssrIncludeBooleanAttr(beast.hunger >= 100) ? " disabled" : ""} class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white"> Cho Ăn </button><button${ssrIncludeBooleanAttr(beast.happiness >= 100) ? " disabled" : ""} class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white"> Chơi </button></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "hunting") {
        _push(`<div class="space-y-8"><div class="game-card p-6 rounded-lg"><h2 class="text-2xl font-bold text-white mb-4">Khu Vực Săn</h2>`);
        if (unref(huntingGrounds).length === 0) {
          _push(`<div class="text-center py-8"><div class="text-game-text-secondary">Chưa có khu vực săn nào</div></div>`);
        } else {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
          ssrRenderList(unref(huntingGrounds), (ground) => {
            _push(`<div class="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300"><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white">${ssrInterpolate(ground.displayName)}</h3><span class="text-2xl">${ssrInterpolate(ground.icon)}</span></div><p class="text-sm text-game-text-secondary mb-4">${ssrInterpolate(ground.description)}</p><div class="mb-4 space-y-2"><div class="flex justify-between"><span class="text-sm text-game-text-secondary">Cấp độ yêu cầu:</span><span class="text-sm text-white">${ssrInterpolate(ground.level)}</span></div><div class="flex justify-between"><span class="text-sm text-game-text-secondary">Độ khó:</span><span class="text-sm font-semibold" style="${ssrRenderStyle({ color: getDifficultyColor(ground.difficulty) })}">${ssrInterpolate(ground.difficulty.toUpperCase())}</span></div></div><button${ssrIncludeBooleanAttr(!canHuntAtGround(ground, unref(player)?.level || 0) || unref(loading)) ? " disabled" : ""} class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white">${ssrInterpolate(canHuntAtGround(ground, unref(player)?.level || 0) ? "Đi Săn" : `Cần cấp ${ground.level}`)}</button></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "feeding") {
        _push(`<div class="space-y-8"><div class="game-card p-6 rounded-lg"><h2 class="text-2xl font-bold text-white mb-4">Thức Ăn Linh Thú</h2>`);
        if (unref(foods).length === 0) {
          _push(`<div class="text-center py-8"><div class="text-game-text-secondary">Chưa có thức ăn nào</div></div>`);
        } else {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
          ssrRenderList(unref(foods), (food) => {
            _push(`<div class="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300"><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white">${ssrInterpolate(food.displayName)}</h3><span class="text-2xl">${ssrInterpolate(food.icon)}</span></div><p class="text-sm text-game-text-secondary mb-4">${ssrInterpolate(food.description)}</p><div class="mb-4"><div class="flex justify-between mb-2"><span class="text-sm text-game-text-secondary">Giá:</span><span class="text-sm text-white">${ssrInterpolate(food.price.toLocaleString())} ${ssrInterpolate(getCurrencyName(food.currency))}</span></div><div class="flex justify-between"><span class="text-sm text-game-text-secondary">Loại:</span><span class="text-sm text-white">${ssrInterpolate(food.category)}</span></div></div><button class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-semibold text-white"> Mua &amp; Cho Ăn </button></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showFeedModal)) {
        _push(`<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div class="bg-gray-900 rounded-lg max-w-md w-full"><div class="flex items-center justify-between p-6 border-b border-gray-700"><h2 class="text-xl font-bold text-white">Cho Ăn Linh Thú</h2><button class="text-gray-400 hover:text-white text-2xl"> ✕ </button></div><div class="p-6">`);
        if (unref(selectedBeast)) {
          _push(`<div class="mb-4"><div class="flex items-center space-x-3 mb-4"><span class="text-2xl">${ssrInterpolate(unref(selectedBeast).type.icon)}</span><div><div class="text-white font-semibold">${ssrInterpolate(unref(selectedBeast).name)}</div><div class="text-sm text-game-text-secondary">${ssrInterpolate(unref(selectedBeast).type.displayName)}</div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(selectedFood)) {
          _push(`<div class="mb-4"><div class="flex items-center space-x-3 mb-4"><span class="text-2xl">${ssrInterpolate(unref(selectedFood).icon)}</span><div><div class="text-white font-semibold">${ssrInterpolate(unref(selectedFood).displayName)}</div><div class="text-sm text-game-text-secondary">${ssrInterpolate(unref(selectedFood).description)}</div></div></div><div class="mb-4"><label class="block text-sm text-game-text-secondary mb-2">Số lượng:</label><input${ssrRenderAttr("value", unref(feedQuantity))} type="number" min="1" max="10" class="w-full px-3 py-2 bg-gray-700 text-white rounded"></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex space-x-2"><button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white">${ssrInterpolate(unref(loading) ? "Đang xử lý..." : "Xác nhận")}</button><button class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm font-semibold text-white"> Hủy </button></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/spirit-beast.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=spirit-beast-CCyFxhPW.js.map
