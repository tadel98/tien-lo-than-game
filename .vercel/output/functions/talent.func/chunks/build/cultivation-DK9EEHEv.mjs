import { _ as _sfc_main$2 } from './LoginForm-B1tZwOQp.mjs';
import { computed, ref, watch, unref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-CnYqct-M.mjs';
import { u as useAuthStore } from './auth-EzXceMbr.mjs';
import { u as usePlayerStore } from './player-B72JDVVQ.mjs';
import { d as defineStore } from './server.mjs';
import { u as useCharacterStore } from './character-BBuP_n1i.mjs';
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
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-2xl border-2 border-yellow-400/50 max-w-sm" }, _attrs))}><div class="flex items-center space-x-3"><div class="text-4xl animate-bounce">\u{1F389}</div><div><div class="text-xl font-bold">Level Up!</div><div class="text-sm opacity-90"> +${ssrInterpolate(__props.levelGain)} level${ssrInterpolate(__props.levelGain > 1 ? "s" : "")}</div><div class="text-xs opacity-75 mt-1"> Level ${ssrInterpolate(__props.newLevel)}</div></div></div><div class="mt-3 text-xs opacity-90"> Ch\xFAc m\u1EEBng! B\u1EA1n \u0111\xE3 tr\u1EDF n\xEAn m\u1EA1nh m\u1EBD h\u01A1n! </div></div>`);
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
    return cultivationStatus.value?.cultivation?.realm || "Ph\xE0m c\u1EA3nh";
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
      { name: "Ph\xE0m c\u1EA3nh", min: 1, max: 9, color: "#6b7280" },
      { name: "Luy\u1EC7n Kh\xED c\u1EA3nh", min: 10, max: 49, color: "#3b82f6" },
      { name: "Tr\xFAc C\u01A1 c\u1EA3nh", min: 50, max: 99, color: "#10b981" },
      { name: "Kim \u0110an c\u1EA3nh", min: 100, max: 199, color: "#f59e0b" },
      { name: "Nguy\xEAn Anh c\u1EA3nh", min: 200, max: 499, color: "#ef4444" },
      { name: "H\xF3a Th\u1EA7n c\u1EA3nh", min: 500, max: 999, color: "#8b5cf6" },
      { name: "H\u1EE3p Th\u1EC3 c\u1EA3nh", min: 1e3, max: 1e3, color: "#f97316" }
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
      "Ph\xE0m c\u1EA3nh": "#6b7280",
      "Luy\u1EC7n Kh\xED c\u1EA3nh": "#3b82f6",
      "Tr\xFAc C\u01A1 c\u1EA3nh": "#10b981",
      "Kim \u0110an c\u1EA3nh": "#f59e0b",
      "Nguy\xEAn Anh c\u1EA3nh": "#ef4444",
      "H\xF3a Th\u1EA7n c\u1EA3nh": "#8b5cf6",
      "H\u1EE3p Th\u1EC3 c\u1EA3nh": "#f97316"
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
      const realm = cultivationStatus.value?.cultivation?.realm || player.value?.realm || "Ph\xE0m c\u1EA3nh";
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
      { name: "Nh\xE2n v\u1EADt", icon: "\u{1F464}", active: false, route: "/character" },
      { name: "Thi\xEAn Ph\xFA", icon: "\u2B50", active: false, route: "/talent" },
      { name: "C\u1EEDa H\xE0ng", icon: "\u{1F3E0}", active: false, route: "/shop" },
      { name: "T\xFAi", icon: "\u{1F392}", active: false, route: "/inventory" },
      { name: "Tu Luy\u1EC7n", icon: "\u{1F9D8}", active: true },
      { name: "\u0110\u1EA1o L\xF4", icon: "\u{1F525}", active: false, route: "/furnace" },
      { name: "Linh Th\xFA", icon: "\u{1F43E}", active: false, route: "/spirit-beast" },
      { name: "\u0110\u1EA1o L\u1EEF", icon: "\u{1F465}", active: false },
      { name: "Ph\xE1p B\u1EA3o", icon: "\u2694\uFE0F", active: false },
      { name: "Luy\u1EC7n \u0110an", icon: "\u2697\uFE0F", active: false },
      { name: "Luy\u1EC7n Kh\xED", icon: "\u{1F528}", active: false },
      { name: "Tr\u1EADn ph\xE1p", icon: "\u{1F52E}", active: false },
      { name: "X\u1EBFp H\u1EA1ng", icon: "\u{1F3C6}", active: false, route: "/ranking" },
      { name: "Danh hi\u1EC7u", icon: "\u{1F451}", active: false },
      { name: "Nhi\u1EC7m V\u1EE5", icon: "\u{1F4CB}", active: false, route: "/quest" },
      { name: "N\u1EA1p Th\u1EBB", icon: "\u{1F3DB}\uFE0F", active: false }
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
        _push(`<header class="bg-game-gray/80 backdrop-blur-sm border-b border-white/10"><div class="container mx-auto px-4 py-3"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center"><span class="text-lg font-bold">${ssrInterpolate(unref(player)?.name?.charAt(0) || "V")}</span></div><div><h2 class="text-lg font-semibold">${ssrInterpolate(unref(player)?.name || "Vi\u1EC5n C\u1ED5 \u0110\u1EA1i N\u0103ng")}</h2><p class="text-sm text-game-text-secondary">C\u1EA5p ${ssrInterpolate(unref(player)?.level || 138)} | Chuy\u1EC3n: ${ssrInterpolate(unref(player)?.realm || "Ph\xE0m c\u1EA3nh")}</p></div></div><div class="flex items-center space-x-6"><div class="text-center"><p class="text-sm text-game-text-secondary">Ti\xEAn Ng\u1ECDc</p><p class="text-lg font-semibold text-yellow-400">${ssrInterpolate(getResourceAmount("tien_ngoc"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Linh Th\u1EA1ch</p><p class="text-lg font-semibold text-blue-400">${ssrInterpolate(getResourceAmount("linh_thach"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Nguy\xEAn Th\u1EA1ch</p><p class="text-lg font-semibold text-green-400">${ssrInterpolate(getResourceAmount("nguyen_thach"))}</p></div></div><div class="flex items-center space-x-2">`);
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
        _push(`<button class="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"> \u0110\u0103ng xu\u1EA5t </button></div></div></div></header><nav class="bg-game-gray/60 backdrop-blur-sm border-b border-white/10"><div class="container mx-auto px-4 py-2"><div class="flex space-x-1 mb-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/character",
          class: "px-4 py-2 text-game-text-secondary hover:text-white transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Nh\xE2n v\u1EADt `);
            } else {
              return [
                createTextVNode(" Nh\xE2n v\u1EADt ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button class="px-4 py-2 bg-game-light rounded-lg text-white font-medium"> Tu Luy\u1EC7n </button></div><div class="grid grid-cols-7 gap-4"><!--[-->`);
        ssrRenderList(menuItems, (menuItem) => {
          _push(`<div class="${ssrRenderClass([{ "bg-game-accent/20 border border-game-accent": menuItem.active }, "flex flex-col items-center p-3 rounded-lg hover:bg-game-light/50 transition-colors cursor-pointer"])}"><div class="w-12 h-12 rounded-full bg-game-light flex items-center justify-center mb-2"><span class="text-2xl">${ssrInterpolate(menuItem.icon)}</span></div><span class="text-xs text-center">${ssrInterpolate(menuItem.name)}</span></div>`);
        });
        _push(`<!--]--></div></div></nav><main class="container mx-auto px-4 py-8"><div class="text-center mb-8"><h1 class="text-4xl font-bold mb-4">\u{1F9D8} Tu Luy\u1EC7n</h1><p class="text-game-text-secondary">N\xE2ng cao c\u1EA5p \u0111\u1ED9 v\xE0 c\u1EA3nh gi\u1EDBi c\u1EE7a b\u1EA1n</p></div><div class="flex items-center justify-center space-x-8 mb-8"><div class="text-center"><div class="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center mb-2 mx-auto"><span class="text-2xl">\u{1F338}</span></div><p class="text-sm">Thi\xEAn Hoa Ti\xEAn C\u01A1</p><span class="text-xs text-game-accent">+60</span></div><div class="text-center"><div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center mb-4 mx-auto"><div class="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center"><span class="text-4xl">\u262F</span></div></div></div><div class="text-center"><div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center mb-2 mx-auto"><span class="text-2xl">\u{1F409}</span></div><p class="text-sm">Ng\xE2n Long</p><span class="text-xs text-game-accent">+100</span></div></div><div class="max-w-2xl mx-auto mb-6"><div class="flex justify-between items-center mb-2"><span class="text-sm text-game-text-secondary">Kinh Nghi\u1EC7m</span><span class="text-sm text-game-text-secondary">${ssrInterpolate(Math.round(unref(cultivationStore).progressPercentage))}% </span></div><div class="w-full bg-game-light rounded-full h-4"><div class="progress-bar h-4 rounded-full transition-all duration-500" style="${ssrRenderStyle({ width: `${unref(cultivationStore).progressPercentage}%` })}"></div></div><div class="flex justify-between items-center mt-1"><span class="text-sm">${ssrInterpolate(unref(cultivationStore).cultivationStatus?.cultivation?.currentExp?.toLocaleString() || "0")}</span><span class="text-sm">${ssrInterpolate(unref(cultivationStore).cultivationStatus?.cultivation?.nextLevelExp?.toLocaleString() || "0")}</span></div></div><div class="max-w-2xl mx-auto mb-8"><p class="text-lg font-semibold text-orange-400 mb-2">${ssrInterpolate(unref(autoCultivation) ? "T\u1EF1 \u0111\u1ED9ng tu luy\u1EC7n \u0111ang ch\u1EA1y..." : unref(cultivationStatus)?.isCultivating ? "\u0110ang tu luy\u1EC7n..." : "\u0110ang nh\u1EADp \u0111\u1ECBnh, v\u1EADn chuy\u1EC3n huy\u1EC1n c\xF4ng theo chu thi\xEAn...")}</p><p class="text-sm text-game-text-secondary italic"> &quot;Linh kh\xED h\u1ED9i t\u1EE5, nguy\xEAn th\u1EA7n an \u0111\u1ECBnh, thi\xEAn \u0111\u1ECBa c\u1EA3m \u1EE9ng, \u0111\u1EA1o v\u1EADn lu\xE2n h\u1ED3i.&quot; </p>`);
        if (unref(autoCultivation)) {
          _push(`<div class="mt-2 text-xs text-green-400"> \u26A1 T\u1EF1 \u0111\u1ED9ng tu luy\u1EC7n m\u1ED7i 3 gi\xE2y - Nh\u1EA5n n\xFAt \u0111\u1EC3 d\u1EEBng </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="max-w-2xl mx-auto mb-8"><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><button${ssrIncludeBooleanAttr(!unref(canCultivate) || unref(loading)) ? " disabled" : ""} class="game-button py-3 px-6 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"><div class="flex items-center justify-center space-x-2"><span class="text-xl">\u{1F9D8}</span><div class="text-left"><div class="text-sm">Tu Luy\u1EC7n C\u01A1 B\u1EA3n</div><div class="text-xs opacity-80">100 S\u1EE9c M\u1EA1nh Chi\u1EBFn \u0110\u1EA5u</div></div></div></button><button${ssrIncludeBooleanAttr(!unref(canCultivate) || unref(loading)) ? " disabled" : ""} class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 px-6 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"><div class="flex items-center justify-center space-x-2"><span class="text-xl">\u26A1</span><div class="text-left"><div class="text-sm">Tu Luy\u1EC7n N\xE2ng Cao</div><div class="text-xs opacity-80">500 S\u1EE9c M\u1EA1nh Chi\u1EBFn \u0110\u1EA5u</div></div></div></button><button${ssrIncludeBooleanAttr(!unref(canBreakthrough) || unref(loading)) ? " disabled" : ""} class="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 py-3 px-6 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"><div class="flex items-center justify-center space-x-2"><span class="text-xl">\u{1F4A5}</span><div class="text-left"><div class="text-sm">\u0110\u1ED9t Ph\xE1</div><div class="text-xs opacity-80">1000+ S\u1EE9c M\u1EA1nh Chi\u1EBFn \u0110\u1EA5u</div></div></div></button></div><div class="mt-6 p-4 bg-game-light/30 rounded-lg"><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white">T\u1EF1 \u0110\u1ED9ng Tu Luy\u1EC7n</h3><div class="flex items-center space-x-2"><span class="text-sm text-game-text-secondary">Tr\u1EA1ng th\xE1i:</span><span class="${ssrRenderClass([unref(autoCultivation) ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400", "px-3 py-1 rounded-full text-xs font-semibold"])}">${ssrInterpolate(unref(autoCultivation) ? "\u0110ang ch\u1EA1y" : "T\u1EA1m d\u1EEBng")}</span></div></div><div class="flex items-center space-x-4"><button${ssrIncludeBooleanAttr(!unref(canCultivate) || unref(loading)) ? " disabled" : ""} class="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-2 px-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"><div class="flex items-center justify-center space-x-2"><span class="text-lg">${ssrInterpolate(unref(autoCultivation) ? "\u23F8\uFE0F" : "\u25B6\uFE0F")}</span><span>${ssrInterpolate(unref(autoCultivation) ? "D\u1EEBng" : "B\u1EAFt \u0111\u1EA7u")} T\u1EF1 \u0110\u1ED9ng</span></div></button><button${ssrIncludeBooleanAttr(!unref(canCultivate) || unref(loading)) ? " disabled" : ""} class="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-2 px-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"><div class="flex items-center justify-center space-x-2"><span class="text-lg">${ssrInterpolate(unref(autoCultivation) ? "\u23F8\uFE0F" : "\u26A1")}</span><span>${ssrInterpolate(unref(autoCultivation) ? "D\u1EEBng" : "B\u1EAFt \u0111\u1EA7u")} N\xE2ng Cao</span></div></button></div><div class="mt-3 text-xs text-game-text-secondary"><p>\u2022 T\u1EF1 \u0111\u1ED9ng tu luy\u1EC7n m\u1ED7i 6 gi\xE2y, m\u1ED7i l\u1EA7n +1000 EXP</p><p>\u2022 T\u1EF1 \u0111\u1ED9ng level up khi \u0111\u1EE7 kinh nghi\u1EC7m</p><p>\u2022 C\xF3 th\u1EC3 d\u1EEBng b\u1EA5t k\u1EF3 l\xFAc n\xE0o</p></div></div></div><div class="max-w-4xl mx-auto"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="game-card p-6 rounded-lg"><h3 class="text-lg font-semibold text-white mb-4 text-center">Th\xF4ng Tin Tu Luy\u1EC7n</h3><div class="space-y-3"><div class="flex justify-between items-center"><span class="text-game-text-secondary">C\u1EA5p \u0110\u1ED9:</span><span class="text-xl font-bold" style="${ssrRenderStyle({ color: unref(realmColor) })}">${ssrInterpolate(unref(cultivationStatus)?.cultivation?.currentLevel || unref(player)?.level || 1)}</span></div><div class="flex justify-between items-center"><span class="text-game-text-secondary">C\u1EA3nh Gi\u1EDBi:</span><span class="text-lg font-semibold" style="${ssrRenderStyle({ color: unref(realmColor) })}">${ssrInterpolate(unref(cultivationStatus)?.cultivation?.realm || unref(player)?.realm || "Ph\xE0m c\u1EA3nh")}</span></div><div class="flex justify-between items-center"><span class="text-game-text-secondary">S\u1EE9c M\u1EA1nh Chi\u1EBFn \u0110\u1EA5u:</span><span class="text-lg font-semibold text-purple-400">${ssrInterpolate(unref(characterStore).combatPower?.toLocaleString() || "0")}</span></div><div class="flex justify-between items-center"><span class="text-game-text-secondary">Tr\u1EA1ng th\xE1i:</span><span class="${ssrRenderClass([unref(canCultivate) ? "text-green-400" : "text-red-400", "text-sm"])}">${ssrInterpolate(unref(canCultivate) ? "C\xF3 th\u1EC3 tu luy\u1EC7n" : "Kh\xF4ng \u0111\u1EE7 t\xE0i nguy\xEAn")}</span></div></div></div><div class="game-card p-6 rounded-lg"><h3 class="text-lg font-semibold text-white mb-4 text-center">Ti\u1EBFn \u0110\u1ED9 C\u1EA3nh Gi\u1EDBi</h3>`);
        if (unref(realmProgress)) {
          _push(`<div class="space-y-3"><div class="flex justify-between items-center"><span class="text-game-text-secondary">C\u1EA3nh gi\u1EDBi hi\u1EC7n t\u1EA1i:</span><span class="text-lg font-semibold" style="${ssrRenderStyle({ color: unref(realmColor) })}">${ssrInterpolate(unref(cultivationStatus)?.cultivation?.realm || "Ph\xE0m c\u1EA3nh")}</span></div><div class="flex justify-between items-center"><span class="text-game-text-secondary">Ti\u1EBFn \u0111\u1ED9:</span><span class="text-lg font-semibold">${ssrInterpolate(unref(realmProgress).current)}/${ssrInterpolate(unref(realmProgress).max)}</span></div><div class="w-full bg-game-light rounded-full h-3"><div class="h-3 rounded-full transition-all duration-500" style="${ssrRenderStyle({
            width: `${unref(realmProgress).percentage}%`,
            background: `linear-gradient(90deg, ${unref(realmColor)} 0%, ${unref(nextRealmColor)} 100%)`
          })}"></div></div><div class="text-center text-sm text-game-text-secondary"> C\u1EA7n c\u1EA5p ${ssrInterpolate(unref(nextRealmLevel))} \u0111\u1EC3 l\xEAn ${ssrInterpolate(unref(nextRealm))}</div></div>`);
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

export { _sfc_main as default };
//# sourceMappingURL=cultivation-DK9EEHEv.mjs.map
