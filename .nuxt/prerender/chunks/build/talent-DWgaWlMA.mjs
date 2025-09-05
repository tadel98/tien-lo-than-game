import { _ as _sfc_main$1 } from './LoginForm-B1tZwOQp.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CnYqct-M.mjs';
import { ref, computed, watch, unref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/vue/server-renderer/index.mjs';
import { u as useAuthStore } from './auth-EzXceMbr.mjs';
import { u as usePlayerStore } from './player-B72JDVVQ.mjs';
import { d as defineStore } from './server.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/ufo/dist/index.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';
import '../_/nitro.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/destr/dist/index.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/hookable/dist/index.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/node-mock-http/dist/index.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/unstorage/dist/index.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/unstorage/drivers/fs.mjs';
import 'file:///C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/nuxt/dist/core/runtime/nitro/utils/cache-driver.js';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/ohash/dist/index.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/klona/dist/index.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/defu/dist/defu.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/scule/dist/index.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/pathe/dist/index.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/unhead/dist/server.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/devalue/index.js';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/unhead/dist/utils.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/unhead/dist/plugins.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/unctx/dist/index.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/vue-router/dist/vue-router.node.mjs';

const useTalentStore = defineStore("talent", () => {
  const playerTalents = ref([]);
  const availableTalents = ref([]);
  const playerBuffs = ref([]);
  const totalEffects = ref({});
  const loading = ref(false);
  const error = ref(null);
  const unlockedTalents = computed(() => {
    return playerTalents.value.filter((talent) => talent.isUnlocked);
  });
  const activeTalents = computed(() => {
    return playerTalents.value.filter((talent) => talent.isUnlocked && talent.isActive);
  });
  const activeBuffs = computed(() => {
    return playerBuffs.value.filter((buff) => {
      if (!buff.expiresAt) return true;
      return new Date(buff.expiresAt) > /* @__PURE__ */ new Date();
    });
  });
  const talentTypes = computed(() => {
    const types = /* @__PURE__ */ new Map();
    availableTalents.value.forEach((talent) => {
      var _a, _b;
      if ((_b = (_a = talent == null ? void 0 : talent.talent) == null ? void 0 : _a.type) == null ? void 0 : _b.id) {
        if (!types.has(talent.talent.type.id)) {
          types.set(talent.talent.type.id, talent.talent.type);
        }
      }
    });
    return Array.from(types.values());
  });
  const fetchTalentStatus = async (playerId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch(`/api/talent/status?playerId=${playerId}`);
      playerTalents.value = response.data.playerTalents;
      availableTalents.value = response.data.availableTalents;
      playerBuffs.value = response.data.playerBuffs;
      totalEffects.value = response.data.totalEffects;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching talent status:", err);
    } finally {
      loading.value = false;
    }
  };
  const unlockTalent = async (playerId, talentId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/talent/unlock", {
        method: "POST",
        body: {
          playerId,
          talentId
        }
      });
      await fetchTalentStatus(playerId);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error unlocking talent:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const upgradeTalent = async (playerId, talentId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/talent/upgrade", {
        method: "POST",
        body: {
          playerId,
          talentId
        }
      });
      await fetchTalentStatus(playerId);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error upgrading talent:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const toggleTalent = async (playerId, talentId, isActive) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/talent/toggle", {
        method: "POST",
        body: {
          playerId,
          talentId,
          isActive
        }
      });
      await fetchTalentStatus(playerId);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error toggling talent:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const getRarityColor = (rarity) => {
    const colors = {
      common: "#6b7280",
      uncommon: "#10b981",
      rare: "#3b82f6",
      epic: "#8b5cf6",
      legendary: "#f59e0b",
      mythic: "#ef4444"
    };
    return colors[rarity] || "#6b7280";
  };
  const getTalentTypeColor = (typeName) => {
    const colors = {
      "combat": "#ef4444",
      "cultivation": "#8b5cf6",
      "defense": "#10b981",
      "utility": "#06b6d4",
      "special": "#f59e0b"
    };
    return colors[typeName] || "#6b7280";
  };
  const getBuffTypeColor = (type) => {
    const colors = {
      "buff": "#10b981",
      "debuff": "#ef4444",
      "neutral": "#6b7280"
    };
    return colors[type] || "#6b7280";
  };
  const canUnlockTalent = (talent, playerLevel, playerRealm) => {
    if (!talent.requirements) return true;
    const requirements = talent.requirements;
    if (requirements.level && playerLevel < requirements.level) return false;
    if (requirements.realm && playerRealm !== requirements.realm) return false;
    return true;
  };
  const canUpgradeTalent = (playerTalent) => {
    return playerTalent.isUnlocked && playerTalent.level < playerTalent.talent.maxLevel;
  };
  const getTalentUpgradeCost = (playerTalent) => {
    return playerTalent.talent.cost * playerTalent.level;
  };
  const reset = () => {
    playerTalents.value = [];
    availableTalents.value = [];
    playerBuffs.value = [];
    totalEffects.value = {};
    loading.value = false;
    error.value = null;
  };
  return {
    // State
    playerTalents,
    availableTalents,
    playerBuffs,
    totalEffects,
    loading,
    error,
    // Getters
    unlockedTalents,
    activeTalents,
    activeBuffs,
    talentTypes,
    // Actions
    fetchTalentStatus,
    unlockTalent,
    upgradeTalent,
    toggleTalent,
    getRarityColor,
    getTalentTypeColor,
    getBuffTypeColor,
    canUnlockTalent,
    canUpgradeTalent,
    getTalentUpgradeCost,
    reset
  };
});
const _sfc_main = {
  __name: "talent",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const playerStore = usePlayerStore();
    const talentStore = useTalentStore();
    const selectedType = ref(null);
    const isAuthenticated = computed(() => authStore.isLoggedIn);
    const player = computed(() => playerStore.player);
    computed(() => playerStore.resources);
    const loading = computed(() => talentStore.loading);
    const error = computed(() => talentStore.error);
    const playerTalents = computed(() => talentStore.playerTalents);
    computed(() => talentStore.availableTalents);
    const totalEffects = computed(() => talentStore.totalEffects);
    const talentTypes = computed(() => talentStore.talentTypes);
    const filteredTalents = computed(() => {
      if (!selectedType.value) return playerTalents.value;
      return playerTalents.value.filter((talent) => talent.talent.type.id === selectedType.value);
    });
    const getResourceAmount = (resourceName) => {
      const resource = playerStore.getResourceByName(resourceName);
      return resource ? Number(resource.amount).toLocaleString() : "0";
    };
    const getEffectDisplayName = (effect) => {
      const names = {
        attack: "T\u1EA5n C\xF4ng",
        defense: "Ph\xF2ng Th\u1EE7",
        speed: "T\u1ED1c \u0110\u1ED9",
        hp: "M\xE1u",
        mp: "Ph\xE1p L\u1EF1c",
        luck: "May M\u1EAFn",
        wisdom: "Tr\xED Tu\u1EC7",
        strength: "S\u1EE9c M\u1EA1nh",
        agility: "Nhanh Nh\u1EB9n",
        vitality: "Sinh L\u1EF1c",
        spirit: "Tinh Th\u1EA7n",
        expMultiplier: "Kinh Nghi\u1EC7m",
        dropRate: "T\u1EF7 L\u1EC7 R\u01A1i",
        critChance: "T\u1EF7 L\u1EC7 Ch\xED M\u1EA1ng",
        critDamage: "S\xE1t Th\u01B0\u01A1ng Ch\xED M\u1EA1ng"
      };
      return names[effect] || effect;
    };
    const getEffectColor = (effect) => {
      const colors = {
        attack: "#ef4444",
        defense: "#10b981",
        speed: "#8b5cf6",
        hp: "#ef4444",
        mp: "#3b82f6",
        luck: "#f59e0b",
        wisdom: "#06b6d4",
        strength: "#84cc16",
        agility: "#ec4899",
        vitality: "#14b8a6",
        spirit: "#6366f1",
        expMultiplier: "#8b5cf6",
        dropRate: "#f59e0b",
        critChance: "#ef4444",
        critDamage: "#dc2626"
      };
      return colors[effect] || "#6b7280";
    };
    const formatEffectValue = (effect, value) => {
      if (effect.includes("Multiplier") || effect.includes("Rate")) {
        return `+${((value - 1) * 100).toFixed(1)}%`;
      }
      return `+${value}`;
    };
    const formatTalentEffects = (effects, level) => {
      if (!effects) return "Kh\xF4ng c\xF3";
      const effectStrings = [];
      for (const [effect, value] of Object.entries(effects)) {
        if (typeof value === "number") {
          effectStrings.push(`${getEffectDisplayName(effect)}: +${value * level}`);
        } else if (typeof value === "object" && value.scaling) {
          const totalValue = value.base + value.scaling * level;
          effectStrings.push(`${getEffectDisplayName(effect)}: +${totalValue}`);
        }
      }
      return effectStrings.join(", ");
    };
    const getRarityColor = (rarity) => talentStore.getRarityColor(rarity);
    const getTalentTypeColor = (typeName) => talentStore.getTalentTypeColor(typeName);
    const canUnlockTalent = (talent, playerLevel, playerRealm) => talentStore.canUnlockTalent(talent, playerLevel, playerRealm);
    const canUpgradeTalent = (talent) => talentStore.canUpgradeTalent(talent);
    const getTalentUpgradeCost = (talent) => talentStore.getTalentUpgradeCost(talent);
    const menuItems = [
      { name: "Nh\xE2n v\u1EADt", icon: "\u{1F464}", active: false, route: "/character" },
      { name: "Thi\xEAn Ph\xFA", icon: "\u2B50", active: true },
      { name: "C\u1EEDa H\xE0ng", icon: "\u{1F3E0}", active: false, route: "/shop" },
      { name: "T\xFAi", icon: "\u{1F392}", active: false, route: "/inventory" },
      { name: "Tu Luy\u1EC7n", icon: "\u{1F9D8}", active: false, route: "/cultivation" },
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
      var _a;
      if (newValue && ((_a = authStore.user) == null ? void 0 : _a.player)) {
        await playerStore.initializePlayer(authStore.user.player.id);
        await talentStore.fetchTalentStatus(authStore.user.player.id);
      } else {
        talentStore.reset();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      const _component_LoginForm = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0;
      if (!unref(isAuthenticated)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_LoginForm, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen text-white" }, _attrs))}><header class="bg-game-gray/80 backdrop-blur-sm border-b border-white/10"><div class="container mx-auto px-4 py-3"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center"><span class="text-lg font-bold">${ssrInterpolate(((_b = (_a = unref(player)) == null ? void 0 : _a.name) == null ? void 0 : _b.charAt(0)) || "V")}</span></div><div><h2 class="text-lg font-semibold">${ssrInterpolate(((_c = unref(player)) == null ? void 0 : _c.name) || "Vi\u1EC5n C\u1ED5 \u0110\u1EA1i N\u0103ng")}</h2><p class="text-sm text-game-text-secondary">C\u1EA5p ${ssrInterpolate(((_d = unref(player)) == null ? void 0 : _d.level) || 138)} | Chuy\u1EC3n: ${ssrInterpolate(((_e = unref(player)) == null ? void 0 : _e.realm) || "Ph\xE0m c\u1EA3nh")}</p></div></div><div class="flex items-center space-x-6"><div class="text-center"><p class="text-sm text-game-text-secondary">Ti\xEAn Ng\u1ECDc</p><p class="text-lg font-semibold text-yellow-400">${ssrInterpolate(getResourceAmount("tien_ngoc"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Linh Th\u1EA1ch</p><p class="text-lg font-semibold text-blue-400">${ssrInterpolate(getResourceAmount("linh_thach"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Nguy\xEAn Th\u1EA1ch</p><p class="text-lg font-semibold text-green-400">${ssrInterpolate(getResourceAmount("nguyen_thach"))}</p></div></div><div class="flex items-center space-x-2">`);
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
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/cultivation",
          class: "px-4 py-2 text-game-text-secondary hover:text-white transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Tu Luy\u1EC7n `);
            } else {
              return [
                createTextVNode(" Tu Luy\u1EC7n ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button class="px-4 py-2 bg-game-light rounded-lg text-white font-medium"> Thi\xEAn Ph\xFA </button></div><div class="grid grid-cols-7 gap-4"><!--[-->`);
        ssrRenderList(menuItems, (menuItem) => {
          _push(`<div class="${ssrRenderClass([{ "bg-game-accent/20 border border-game-accent": menuItem.active }, "flex flex-col items-center p-3 rounded-lg hover:bg-game-light/50 transition-colors cursor-pointer"])}"><div class="w-12 h-12 rounded-full bg-game-light flex items-center justify-center mb-2"><span class="text-2xl">${ssrInterpolate(menuItem.icon)}</span></div><span class="text-xs text-center">${ssrInterpolate(menuItem.name)}</span></div>`);
        });
        _push(`<!--]--></div></div></nav><main class="container mx-auto px-4 py-8"><div class="text-center mb-8"><h1 class="text-4xl font-bold mb-4">\u2B50 Thi\xEAn Ph\xFA</h1><p class="text-game-text-secondary">K\xEDch ho\u1EA1t v\xE0 n\xE2ng c\u1EA5p t\xE0i n\u0103ng \u0111\u1EB7c bi\u1EC7t c\u1EE7a b\u1EA1n</p></div><div class="max-w-4xl mx-auto mb-8"><div class="game-card p-6 rounded-lg"><h3 class="text-xl font-semibold text-white mb-4 text-center">T\u1ED5ng Hi\u1EC7u \u1EE8ng Thi\xEAn Ph\xFA</h3><div class="grid grid-cols-2 md:grid-cols-4 gap-4">`);
        if (_ctx.value !== 0 && _ctx.value !== 1) {
          _push(`<!--[-->`);
          ssrRenderList(unref(totalEffects), (value, effect) => {
            _push(`<div class="bg-game-light/30 p-3 rounded-lg text-center"><div class="text-sm text-game-text-secondary mb-1">${ssrInterpolate(getEffectDisplayName(effect))}</div><div class="text-lg font-semibold" style="${ssrRenderStyle({ color: getEffectColor(effect) })}">${ssrInterpolate(formatEffectValue(effect, value))}</div></div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div><div class="max-w-6xl mx-auto mb-8"><div class="flex space-x-2 mb-6"><!--[-->`);
        ssrRenderList(unref(talentTypes), (type) => {
          _push(`<button class="${ssrRenderClass([unref(selectedType) === type.id ? "bg-game-accent text-white" : "bg-game-light/30 text-game-text-secondary hover:bg-game-light/50", "px-4 py-2 rounded-lg transition-colors"])}"><span class="mr-2">${ssrInterpolate(type.icon)}</span> ${ssrInterpolate(type.displayName)}</button>`);
        });
        _push(`<!--]--></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(filteredTalents), (talent) => {
          var _a2;
          _push(`<div class="${ssrRenderClass([{ "opacity-50": !talent.isUnlocked }, "game-card p-6 rounded-lg"])}"><div class="flex items-center justify-between mb-4"><div class="flex items-center space-x-3"><div class="w-12 h-12 rounded-full bg-game-light flex items-center justify-center"><span class="text-2xl">${ssrInterpolate(talent.icon)}</span></div><div><h4 class="text-lg font-semibold text-white">${ssrInterpolate(talent.displayName)}</h4><div class="flex items-center space-x-2"><span class="text-xs px-2 py-1 rounded" style="${ssrRenderStyle({
            backgroundColor: getRarityColor(talent.rarity) + "20",
            color: getRarityColor(talent.rarity)
          })}">${ssrInterpolate(((_a2 = talent.rarity) == null ? void 0 : _a2.toUpperCase()) || "COMMON")}</span><span class="text-xs px-2 py-1 rounded" style="${ssrRenderStyle({
            backgroundColor: getTalentTypeColor(talent.type.name) + "20",
            color: getTalentTypeColor(talent.type.name)
          })}">${ssrInterpolate(talent.type.displayName)}</span></div></div></div>`);
          if (talent.isUnlocked) {
            _push(`<div class="flex items-center space-x-2"><button class="${ssrRenderClass([talent.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white", "w-8 h-8 rounded-full flex items-center justify-center transition-colors"])}">${ssrInterpolate(talent.isActive ? "\u2713" : "\u25CB")}</button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-sm text-game-text-secondary mb-4">${ssrInterpolate(talent.description)}</p>`);
          if (talent.isUnlocked) {
            _push(`<div class="mb-4"><div class="flex justify-between items-center mb-2"><span class="text-sm text-game-text-secondary">C\u1EA5p \u0111\u1ED9:</span><span class="text-sm font-semibold">${ssrInterpolate(talent.level)}/${ssrInterpolate(talent.maxLevel)}</span></div><div class="w-full bg-game-light rounded-full h-2 mb-2"><div class="h-2 rounded-full transition-all duration-300" style="${ssrRenderStyle({
              width: `${talent.level / talent.maxLevel * 100}%`,
              backgroundColor: getRarityColor(talent.rarity)
            })}"></div></div><div class="text-xs text-game-text-secondary"> Hi\u1EC7u \u1EE9ng: ${ssrInterpolate(formatTalentEffects(talent.effects, talent.level))}</div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (talent.requirements && !talent.isUnlocked) {
            _push(`<div class="mb-4"><div class="text-xs text-game-text-secondary mb-2">Y\xEAu c\u1EA7u:</div><div class="text-xs">`);
            if (talent.requirements.level) {
              _push(`<div>C\u1EA5p ${ssrInterpolate(talent.requirements.level)}</div>`);
            } else {
              _push(`<!---->`);
            }
            if (talent.requirements.realm) {
              _push(`<div>${ssrInterpolate(talent.requirements.realm)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex space-x-2">`);
          if (!talent.isUnlocked) {
            _push(`<button${ssrIncludeBooleanAttr(!canUnlockTalent(talent, unref(player).level, unref(player).realm) || unref(loading)) ? " disabled" : ""} class="flex-1 game-button py-2 px-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"> M\u1EDF Kh\xF3a (${ssrInterpolate(talent.cost)} Ti\xEAn Ng\u1ECDc) </button>`);
          } else if (canUpgradeTalent(talent)) {
            _push(`<button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-2 px-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"> N\xE2ng C\u1EA5p (${ssrInterpolate(getTalentUpgradeCost(talent))} Ti\xEAn Ng\u1ECDc) </button>`);
          } else {
            _push(`<button disabled class="flex-1 bg-gray-500 py-2 px-4 rounded-lg text-white font-semibold cursor-not-allowed"> \u0110\xE3 \u0110\u1EA1t C\u1EA5p T\u1ED1i \u0110a </button>`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div>`);
        if (unref(error)) {
          _push(`<div class="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"><p class="text-red-400 text-sm">${ssrInterpolate(unref(error))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</main></div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/talent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=talent-DWgaWlMA.mjs.map
