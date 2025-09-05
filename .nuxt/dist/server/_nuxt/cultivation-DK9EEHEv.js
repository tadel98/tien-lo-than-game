import { _ as _sfc_main$2 } from "./LoginForm-B1tZwOQp.js";
import { watch, mergeProps, useSSRContext, ref, computed, unref, withCtx, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as __nuxt_component_0 } from "./nuxt-link-CnYqct-M.js";
import { u as useAuthStore } from "./auth-EzXceMbr.js";
import { u as usePlayerStore } from "./player-B72JDVVQ.js";
import { d as defineStore } from "../server.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/hookable/dist/index.mjs";
import { u as useCharacterStore } from "./character-BBuP_n1i.js";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/ufo/dist/index.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/unctx/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/radix3/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/defu/dist/defu.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/klona/dist/index.mjs";
const _sfc_main$1 = {
  __name: "LevelUpNotification",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false
    },
    levelGain: {
      type: Number,
      default: 0
    },
    newLevel: {
      type: Number,
      default: 0
    }
  },
  emits: ["hide"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    watch(() => props.show, (newVal) => {
      if (newVal) {
        setTimeout(() => {
          emit("hide");
        }, 3e3);
      }
    });
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-2xl border-2 border-yellow-400/50 max-w-sm" }, _attrs))}><div class="flex items-center space-x-3"><div class="text-4xl animate-bounce">🎉</div><div><div class="text-xl font-bold">Level Up!</div><div class="text-sm opacity-90"> +${ssrInterpolate(__props.levelGain)} level${ssrInterpolate(__props.levelGain > 1 ? "s" : "")}</div><div class="text-xs opacity-75 mt-1"> Level ${ssrInterpolate(__props.newLevel)}</div></div></div><div class="mt-3 text-xs opacity-90"> Chúc mừng! Bạn đã trở nên mạnh mẽ hơn! </div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LevelUpNotification.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = () => {
  console.error(intervalError);
};
const useCultivationStore = defineStore("cultivation", () => {
  const cultivationStatus = ref(null);
  const isCultivating = ref(false);
  const loading = ref(false);
  const error = ref(null);
  const autoCultivation = ref(false);
  const autoCultivationInterval = ref(null);
  const canCultivate = computed(() => {
    return cultivationStatus.value?.canCultivate || false;
  });
  const canBreakthrough = computed(() => {
    if (!cultivationStatus.value) return false;
    const { currentExp, nextLevelExp } = cultivationStatus.value.cultivation;
    return currentExp >= nextLevelExp;
  });
  const progressPercentage = computed(() => {
    return cultivationStatus.value?.cultivation?.progressPercentage || 0;
  });
  const currentRealm = computed(() => {
    return cultivationStatus.value?.cultivation?.realm || "Phàm cảnh";
  });
  const fetchCultivationStatus = async (playerId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch(`/api/cultivation/status?playerId=${playerId}`);
      cultivationStatus.value = response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching cultivation status:", err);
    } finally {
      loading.value = false;
    }
  };
  const startCultivation = async (playerId, cultivationType = "basic") => {
    try {
      loading.value = true;
      error.value = null;
      isCultivating.value = true;
      const response = await $fetch("/api/cultivation/start", {
        method: "POST",
        body: {
          playerId,
          cultivationType
        }
      });
      await fetchCultivationStatus(playerId);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error starting cultivation:", err);
      throw err;
    } finally {
      loading.value = false;
      isCultivating.value = false;
    }
  };
  const breakthrough = async (playerId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/cultivation/breakthrough", {
        method: "POST",
        body: {
          playerId
        }
      });
      await fetchCultivationStatus(playerId);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error breakthrough:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const getCultivationInfo = (level) => {
    const realms = [
      { name: "Phàm cảnh", min: 1, max: 9, color: "#6b7280" },
      { name: "Luyện Khí cảnh", min: 10, max: 49, color: "#3b82f6" },
      { name: "Trúc Cơ cảnh", min: 50, max: 99, color: "#10b981" },
      { name: "Kim Đan cảnh", min: 100, max: 199, color: "#f59e0b" },
      { name: "Nguyên Anh cảnh", min: 200, max: 499, color: "#ef4444" },
      { name: "Hóa Thần cảnh", min: 500, max: 999, color: "#8b5cf6" },
      { name: "Hợp Thể cảnh", min: 1e3, max: 1e3, color: "#f97316" }
      // Cảnh giới cao nhất
    ];
    const currentRealm2 = realms.find((realm) => level >= realm.min && level <= realm.max) || realms[0];
    const nextRealm = realms.find((realm) => realm.min > level) || realms[realms.length - 1];
    return {
      currentRealm: currentRealm2,
      nextRealm,
      isMaxLevel: level >= 1e3
      // Cảnh giới cao nhất là level 1000
    };
  };
  const getRealmColor = (realm) => {
    const realmColors = {
      "Phàm cảnh": "#6b7280",
      "Luyện Khí cảnh": "#3b82f6",
      "Trúc Cơ cảnh": "#10b981",
      "Kim Đan cảnh": "#f59e0b",
      "Nguyên Anh cảnh": "#ef4444",
      "Hóa Thần cảnh": "#8b5cf6",
      "Hợp Thể cảnh": "#f97316"
    };
    return realmColors[realm] || "#6b7280";
  };
  const startAutoCultivation = (playerId, cultivationType = "basic") => {
    if (autoCultivationInterval.value) {
      clearInterval(autoCultivationInterval.value);
    }
    autoCultivation.value = true;
    autoCultivationInterval.value = setInterval();
  };
  const stopAutoCultivation = () => {
    autoCultivation.value = false;
    if (autoCultivationInterval.value) {
      clearInterval(autoCultivationInterval.value);
      autoCultivationInterval.value = null;
    }
  };
  const toggleAutoCultivation = (playerId, cultivationType = "basic") => {
    if (autoCultivation.value) {
      stopAutoCultivation();
    } else {
      startAutoCultivation(playerId, cultivationType);
    }
  };
  const reset = () => {
    stopAutoCultivation();
    cultivationStatus.value = null;
    isCultivating.value = false;
    loading.value = false;
    error.value = null;
  };
  return {
    // State
    cultivationStatus,
    isCultivating,
    loading,
    error,
    autoCultivation,
    // Getters
    canCultivate,
    canBreakthrough,
    progressPercentage,
    currentRealm,
    // Actions
    fetchCultivationStatus,
    startCultivation,
    breakthrough,
    getCultivationInfo,
    getRealmColor,
    startAutoCultivation,
    stopAutoCultivation,
    toggleAutoCultivation,
    reset
  };
});
const _sfc_main = {
  __name: "cultivation",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const playerStore = usePlayerStore();
    const cultivationStore = useCultivationStore();
    const characterStore = useCharacterStore();
    const isAuthenticated = computed(() => authStore.isLoggedIn);
    const player = computed(() => playerStore.player);
    computed(() => playerStore.resources);
    const cultivationStatus = computed(() => cultivationStore.cultivationStatus);
    const loading = computed(() => cultivationStore.loading);
    const canCultivate = computed(() => cultivationStore.canCultivate);
    const canBreakthrough = computed(() => cultivationStore.canBreakthrough);
    const autoCultivation = computed(() => cultivationStore.autoCultivation);
    const showLevelUpNotification = ref(false);
    const levelUpData = ref({
      levelGain: 0,
      newLevel: 0
    });
    const getResourceAmount = (resourceName) => {
      const resource = playerStore.getResourceByName(resourceName);
      return resource ? Number(resource.amount).toLocaleString() : "0";
    };
    const realmColor = computed(() => {
      const realm = cultivationStatus.value?.cultivation?.realm || player.value?.realm || "Phàm cảnh";
      return cultivationStore.getRealmColor(realm);
    });
    const realmProgress = computed(() => {
      return cultivationStatus.value?.cultivation?.realmProgress;
    });
    const cultivationInfo = computed(() => {
      const level = cultivationStatus.value?.cultivation?.currentLevel || player.value?.level || 1;
      return cultivationStore.getCultivationInfo(level);
    });
    const nextRealm = computed(() => cultivationInfo.value.nextRealm.name);
    const nextRealmColor = computed(() => cultivationInfo.value.nextRealm.color);
    const nextRealmLevel = computed(() => cultivationInfo.value.nextRealm.min);
    const hideLevelUpNotification = () => {
      showLevelUpNotification.value = false;
    };
    const menuItems = [
      { name: "Nhân vật", icon: "👤", active: false, route: "/character" },
      { name: "Thiên Phú", icon: "⭐", active: false, route: "/talent" },
      { name: "Cửa Hàng", icon: "🏠", active: false, route: "/shop" },
      { name: "Túi", icon: "🎒", active: false, route: "/inventory" },
      { name: "Tu Luyện", icon: "🧘", active: true },
      { name: "Đạo Lô", icon: "🔥", active: false, route: "/furnace" },
      { name: "Linh Thú", icon: "🐾", active: false, route: "/spirit-beast" },
      { name: "Đạo Lữ", icon: "👥", active: false },
      { name: "Pháp Bảo", icon: "⚔️", active: false },
      { name: "Luyện Đan", icon: "⚗️", active: false },
      { name: "Luyện Khí", icon: "🔨", active: false },
      { name: "Trận pháp", icon: "🔮", active: false },
      { name: "Xếp Hạng", icon: "🏆", active: false, route: "/ranking" },
      { name: "Danh hiệu", icon: "👑", active: false },
      { name: "Nhiệm Vụ", icon: "📋", active: false, route: "/quest" },
      { name: "Nạp Thẻ", icon: "🏛️", active: false }
    ];
    watch(isAuthenticated, async (newValue) => {
      if (newValue && authStore.user?.player) {
        await playerStore.initializePlayer(authStore.user.player.id);
        await cultivationStore.fetchCultivationStatus(authStore.user.player.id);
        if (canCultivate.value) {
          cultivationStore.startAutoCultivation(authStore.user.player.id, "basic");
        }
      } else {
        cultivationStore.reset();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoginForm = _sfc_main$2;
      const _component_LevelUpNotification = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0;
      if (!unref(isAuthenticated)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_LoginForm, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen text-white" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_LevelUpNotification, {
          show: unref(showLevelUpNotification),
          "level-gain": unref(levelUpData).levelGain,
          "new-level": unref(levelUpData).newLevel,
          onHide: hideLevelUpNotification
        }, null, _parent));
        _push(`<header class="bg-game-gray/80 backdrop-blur-sm border-b border-white/10"><div class="container mx-auto px-4 py-3"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center"><span class="text-lg font-bold">${ssrInterpolate(unref(player)?.name?.charAt(0) || "V")}</span></div><div><h2 class="text-lg font-semibold">${ssrInterpolate(unref(player)?.name || "Viễn Cổ Đại Năng")}</h2><p class="text-sm text-game-text-secondary">Cấp ${ssrInterpolate(unref(player)?.level || 138)} | Chuyển: ${ssrInterpolate(unref(player)?.realm || "Phàm cảnh")}</p></div></div><div class="flex items-center space-x-6"><div class="text-center"><p class="text-sm text-game-text-secondary">Tiên Ngọc</p><p class="text-lg font-semibold text-yellow-400">${ssrInterpolate(getResourceAmount("tien_ngoc"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Linh Thạch</p><p class="text-lg font-semibold text-blue-400">${ssrInterpolate(getResourceAmount("linh_thach"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Nguyên Thạch</p><p class="text-lg font-semibold text-green-400">${ssrInterpolate(getResourceAmount("nguyen_thach"))}</p></div></div><div class="flex items-center space-x-2">`);
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
        _push(`<button class="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"> Đăng xuất </button></div></div></div></header><nav class="bg-game-gray/60 backdrop-blur-sm border-b border-white/10"><div class="container mx-auto px-4 py-2"><div class="flex space-x-1 mb-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/character",
          class: "px-4 py-2 text-game-text-secondary hover:text-white transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Nhân vật `);
            } else {
              return [
                createTextVNode(" Nhân vật ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button class="px-4 py-2 bg-game-light rounded-lg text-white font-medium"> Tu Luyện </button></div><div class="grid grid-cols-7 gap-4"><!--[-->`);
        ssrRenderList(menuItems, (menuItem) => {
          _push(`<div class="${ssrRenderClass([{ "bg-game-accent/20 border border-game-accent": menuItem.active }, "flex flex-col items-center p-3 rounded-lg hover:bg-game-light/50 transition-colors cursor-pointer"])}"><div class="w-12 h-12 rounded-full bg-game-light flex items-center justify-center mb-2"><span class="text-2xl">${ssrInterpolate(menuItem.icon)}</span></div><span class="text-xs text-center">${ssrInterpolate(menuItem.name)}</span></div>`);
        });
        _push(`<!--]--></div></div></nav><main class="container mx-auto px-4 py-8"><div class="text-center mb-8"><h1 class="text-4xl font-bold mb-4">🧘 Tu Luyện</h1><p class="text-game-text-secondary">Nâng cao cấp độ và cảnh giới của bạn</p></div><div class="flex items-center justify-center space-x-8 mb-8"><div class="text-center"><div class="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center mb-2 mx-auto"><span class="text-2xl">🌸</span></div><p class="text-sm">Thiên Hoa Tiên Cơ</p><span class="text-xs text-game-accent">+60</span></div><div class="text-center"><div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center mb-4 mx-auto"><div class="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center"><span class="text-4xl">☯</span></div></div></div><div class="text-center"><div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center mb-2 mx-auto"><span class="text-2xl">🐉</span></div><p class="text-sm">Ngân Long</p><span class="text-xs text-game-accent">+100</span></div></div><div class="max-w-2xl mx-auto mb-6"><div class="flex justify-between items-center mb-2"><span class="text-sm text-game-text-secondary">Kinh Nghiệm</span><span class="text-sm text-game-text-secondary">${ssrInterpolate(Math.round(unref(cultivationStore).progressPercentage))}% </span></div><div class="w-full bg-game-light rounded-full h-4"><div class="progress-bar h-4 rounded-full transition-all duration-500" style="${ssrRenderStyle({ width: `${unref(cultivationStore).progressPercentage}%` })}"></div></div><div class="flex justify-between items-center mt-1"><span class="text-sm">${ssrInterpolate(unref(cultivationStore).cultivationStatus?.cultivation?.currentExp?.toLocaleString() || "0")}</span><span class="text-sm">${ssrInterpolate(unref(cultivationStore).cultivationStatus?.cultivation?.nextLevelExp?.toLocaleString() || "0")}</span></div></div><div class="max-w-2xl mx-auto mb-8"><p class="text-lg font-semibold text-orange-400 mb-2">${ssrInterpolate(unref(autoCultivation) ? "Tự động tu luyện đang chạy..." : unref(cultivationStatus)?.isCultivating ? "Đang tu luyện..." : "Đang nhập định, vận chuyển huyền công theo chu thiên...")}</p><p class="text-sm text-game-text-secondary italic"> &quot;Linh khí hội tụ, nguyên thần an định, thiên địa cảm ứng, đạo vận luân hồi.&quot; </p>`);
        if (unref(autoCultivation)) {
          _push(`<div class="mt-2 text-xs text-green-400"> ⚡ Tự động tu luyện mỗi 3 giây - Nhấn nút để dừng </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="max-w-2xl mx-auto mb-8"><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><button${ssrIncludeBooleanAttr(!unref(canCultivate) || unref(loading)) ? " disabled" : ""} class="game-button py-3 px-6 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"><div class="flex items-center justify-center space-x-2"><span class="text-xl">🧘</span><div class="text-left"><div class="text-sm">Tu Luyện Cơ Bản</div><div class="text-xs opacity-80">100 Sức Mạnh Chiến Đấu</div></div></div></button><button${ssrIncludeBooleanAttr(!unref(canCultivate) || unref(loading)) ? " disabled" : ""} class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 px-6 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"><div class="flex items-center justify-center space-x-2"><span class="text-xl">⚡</span><div class="text-left"><div class="text-sm">Tu Luyện Nâng Cao</div><div class="text-xs opacity-80">500 Sức Mạnh Chiến Đấu</div></div></div></button><button${ssrIncludeBooleanAttr(!unref(canBreakthrough) || unref(loading)) ? " disabled" : ""} class="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 py-3 px-6 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"><div class="flex items-center justify-center space-x-2"><span class="text-xl">💥</span><div class="text-left"><div class="text-sm">Đột Phá</div><div class="text-xs opacity-80">1000+ Sức Mạnh Chiến Đấu</div></div></div></button></div><div class="mt-6 p-4 bg-game-light/30 rounded-lg"><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white">Tự Động Tu Luyện</h3><div class="flex items-center space-x-2"><span class="text-sm text-game-text-secondary">Trạng thái:</span><span class="${ssrRenderClass([unref(autoCultivation) ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400", "px-3 py-1 rounded-full text-xs font-semibold"])}">${ssrInterpolate(unref(autoCultivation) ? "Đang chạy" : "Tạm dừng")}</span></div></div><div class="flex items-center space-x-4"><button${ssrIncludeBooleanAttr(!unref(canCultivate) || unref(loading)) ? " disabled" : ""} class="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-2 px-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"><div class="flex items-center justify-center space-x-2"><span class="text-lg">${ssrInterpolate(unref(autoCultivation) ? "⏸️" : "▶️")}</span><span>${ssrInterpolate(unref(autoCultivation) ? "Dừng" : "Bắt đầu")} Tự Động</span></div></button><button${ssrIncludeBooleanAttr(!unref(canCultivate) || unref(loading)) ? " disabled" : ""} class="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-2 px-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"><div class="flex items-center justify-center space-x-2"><span class="text-lg">${ssrInterpolate(unref(autoCultivation) ? "⏸️" : "⚡")}</span><span>${ssrInterpolate(unref(autoCultivation) ? "Dừng" : "Bắt đầu")} Nâng Cao</span></div></button></div><div class="mt-3 text-xs text-game-text-secondary"><p>• Tự động tu luyện mỗi 6 giây, mỗi lần +1000 EXP</p><p>• Tự động level up khi đủ kinh nghiệm</p><p>• Có thể dừng bất kỳ lúc nào</p></div></div></div><div class="max-w-4xl mx-auto"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="game-card p-6 rounded-lg"><h3 class="text-lg font-semibold text-white mb-4 text-center">Thông Tin Tu Luyện</h3><div class="space-y-3"><div class="flex justify-between items-center"><span class="text-game-text-secondary">Cấp Độ:</span><span class="text-xl font-bold" style="${ssrRenderStyle({ color: unref(realmColor) })}">${ssrInterpolate(unref(cultivationStatus)?.cultivation?.currentLevel || unref(player)?.level || 1)}</span></div><div class="flex justify-between items-center"><span class="text-game-text-secondary">Cảnh Giới:</span><span class="text-lg font-semibold" style="${ssrRenderStyle({ color: unref(realmColor) })}">${ssrInterpolate(unref(cultivationStatus)?.cultivation?.realm || unref(player)?.realm || "Phàm cảnh")}</span></div><div class="flex justify-between items-center"><span class="text-game-text-secondary">Sức Mạnh Chiến Đấu:</span><span class="text-lg font-semibold text-purple-400">${ssrInterpolate(unref(characterStore).combatPower?.toLocaleString() || "0")}</span></div><div class="flex justify-between items-center"><span class="text-game-text-secondary">Trạng thái:</span><span class="${ssrRenderClass([unref(canCultivate) ? "text-green-400" : "text-red-400", "text-sm"])}">${ssrInterpolate(unref(canCultivate) ? "Có thể tu luyện" : "Không đủ tài nguyên")}</span></div></div></div><div class="game-card p-6 rounded-lg"><h3 class="text-lg font-semibold text-white mb-4 text-center">Tiến Độ Cảnh Giới</h3>`);
        if (unref(realmProgress)) {
          _push(`<div class="space-y-3"><div class="flex justify-between items-center"><span class="text-game-text-secondary">Cảnh giới hiện tại:</span><span class="text-lg font-semibold" style="${ssrRenderStyle({ color: unref(realmColor) })}">${ssrInterpolate(unref(cultivationStatus)?.cultivation?.realm || "Phàm cảnh")}</span></div><div class="flex justify-between items-center"><span class="text-game-text-secondary">Tiến độ:</span><span class="text-lg font-semibold">${ssrInterpolate(unref(realmProgress).current)}/${ssrInterpolate(unref(realmProgress).max)}</span></div><div class="w-full bg-game-light rounded-full h-3"><div class="h-3 rounded-full transition-all duration-500" style="${ssrRenderStyle({
            width: `${unref(realmProgress).percentage}%`,
            background: `linear-gradient(90deg, ${unref(realmColor)} 0%, ${unref(nextRealmColor)} 100%)`
          })}"></div></div><div class="text-center text-sm text-game-text-secondary"> Cần cấp ${ssrInterpolate(unref(nextRealmLevel))} để lên ${ssrInterpolate(unref(nextRealm))}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></main></div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cultivation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=cultivation-DK9EEHEv.js.map
