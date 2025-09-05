import { _ as _sfc_main$1 } from './LoginForm-B1tZwOQp.mjs';
import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { d as defineStore } from './server.mjs';
import { u as useAuthStore } from './auth-EzXceMbr.mjs';
import { u as usePlayerStore } from './player-B72JDVVQ.mjs';
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

const useQuestStore = defineStore("quest", () => {
  const quests = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const availableQuests = computed(() => {
    return quests.value.filter((quest) => quest.playerStatus.status === "available");
  });
  const inProgressQuests = computed(() => {
    return quests.value.filter((quest) => quest.playerStatus.status === "in_progress");
  });
  const completedQuests = computed(() => {
    return quests.value.filter((quest) => quest.playerStatus.status === "completed");
  });
  const questsByLevel = computed(() => {
    const grouped = {};
    quests.value.forEach((quest) => {
      if (!grouped[quest.level]) {
        grouped[quest.level] = [];
      }
      grouped[quest.level].push(quest);
    });
    return grouped;
  });
  const fetchQuests = async (playerId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch(`/api/quest/list?playerId=${playerId}`);
      quests.value = response.data.quests;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching quests:", err);
    } finally {
      loading.value = false;
    }
  };
  const startQuest = async (playerId, questId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/quest/start", {
        method: "POST",
        body: {
          playerId,
          questId
        }
      });
      const questIndex = quests.value.findIndex((q) => q.id === questId);
      if (questIndex !== -1) {
        quests.value[questIndex] = response.data.quest;
      }
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error starting quest:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const completeQuest = async (playerId, questId) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/quest/complete", {
        method: "POST",
        body: {
          playerId,
          questId
        }
      });
      const questIndex = quests.value.findIndex((q) => q.id === questId);
      if (questIndex !== -1) {
        quests.value[questIndex] = response.data.quest;
      }
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error completing quest:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const getQuestById = (questId) => {
    return quests.value.find((quest) => quest.id === questId);
  };
  const getQuestsByLevel = (level) => {
    return quests.value.filter((quest) => quest.level === level);
  };
  const reset = () => {
    quests.value = [];
    loading.value = false;
    error.value = null;
  };
  return {
    // State
    quests,
    loading,
    error,
    // Getters
    availableQuests,
    inProgressQuests,
    completedQuests,
    questsByLevel,
    // Actions
    fetchQuests,
    startQuest,
    completeQuest,
    getQuestById,
    getQuestsByLevel,
    reset
  };
});
const _sfc_main = {
  __name: "quest",
  __ssrInlineRender: true,
  setup(__props) {
    const questStore = useQuestStore();
    const authStore = useAuthStore();
    const playerStore = usePlayerStore();
    const activeTab = ref("available");
    const questTabs = ref([
      { value: "available", label: "C\xF3 Th\u1EC3 Nh\u1EADn", icon: "\u{1F4CB}" },
      { value: "in_progress", label: "\u0110ang Th\u1EF1c Hi\u1EC7n", icon: "\u23F3" },
      { value: "completed", label: "\u0110\xE3 Ho\xE0n Th\xE0nh", icon: "\u2705" },
      { value: "repeatable", label: "L\u1EB7p L\u1EA1i", icon: "\u{1F504}" },
      { value: "cooldown", label: "Ch\u1EDD L\xE0m M\u1EDBi", icon: "\u23F0" }
    ]);
    const isAuthenticated = computed(() => authStore.isLoggedIn);
    const player = computed(() => playerStore.player);
    const loading = computed(() => questStore.loading);
    const availableQuests = computed(() => questStore.availableQuests);
    const inProgressQuests = computed(() => questStore.inProgressQuests);
    const completedQuests = computed(() => questStore.completedQuests);
    const repeatableQuests = computed(() => questStore.quests.filter((quest) => quest.isRepeatable && quest.playerStatus.status === "available"));
    const cooldownQuests = computed(() => questStore.quests.filter((quest) => quest.playerStatus.status === "cooldown"));
    const getCurrentQuests = computed(() => {
      switch (activeTab.value) {
        case "available":
          return availableQuests.value;
        case "in_progress":
          return inProgressQuests.value;
        case "completed":
          return completedQuests.value;
        case "repeatable":
          return repeatableQuests.value;
        case "cooldown":
          return cooldownQuests.value;
        default:
          return [];
      }
    });
    const formatDate = (date) => {
      if (!date) return "Ch\u01B0a x\xE1c \u0111\u1ECBnh";
      return new Date(date).toLocaleString("vi-VN");
    };
    const getDifficultyText = (difficulty) => {
      const difficultyMap = {
        "easy": "D\u1EC5",
        "medium": "Trung B\xECnh",
        "hard": "Kh\xF3",
        "expert": "Chuy\xEAn Gia"
      };
      return difficultyMap[difficulty] || difficulty;
    };
    const formatTime = (seconds) => {
      if (!seconds) return "0s";
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      }
      return `${remainingSeconds}s`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoginForm = _sfc_main$1;
      if (!isAuthenticated.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_LoginForm, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen text-white" }, _attrs))}><div class="bg-black/20 backdrop-blur-sm border-b border-purple-500/30"><div class="container mx-auto px-4 py-6"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><h1 class="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> \u{1F4CB} Nhi\u1EC7m V\u1EE5 </h1><div class="text-sm text-gray-400"> Ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5 \u0111\u1EC3 nh\u1EADn EXP v\xE0 t\xE0i nguy\xEAn </div></div><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors">${ssrInterpolate(loading.value ? "\u0110ang t\u1EA3i..." : "\u{1F504} L\xE0m m\u1EDBi")}</button></div></div></div><div class="container mx-auto px-4 py-6"><div class="flex space-x-2 mb-8"><!--[-->`);
        ssrRenderList(questTabs.value, (tab) => {
          _push(`<button class="${ssrRenderClass([
            "px-6 py-3 rounded-lg font-medium transition-all duration-300",
            activeTab.value === tab.value ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
          ])}">${ssrInterpolate(tab.icon)} ${ssrInterpolate(tab.label)}</button>`);
        });
        _push(`<!--]--></div><div class="grid gap-6">`);
        if (activeTab.value === "available" && availableQuests.value.length > 0) {
          _push(`<div class="space-y-4"><h2 class="text-xl font-bold text-white mb-4">Nhi\u1EC7m V\u1EE5 C\xF3 Th\u1EC3 Nh\u1EADn</h2><!--[-->`);
          ssrRenderList(availableQuests.value, (quest) => {
            _push(`<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center space-x-3 mb-3"><h3 class="text-lg font-bold text-white">${ssrInterpolate(quest.displayName)}</h3><span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">${ssrInterpolate(getDifficultyText(quest.difficulty))}</span>`);
            if (quest.isRepeatable) {
              _push(`<span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"> \u{1F504} ${ssrInterpolate(quest.repeatInterval)}p </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><p class="text-gray-300 mb-4">${ssrInterpolate(quest.description)}</p><div class="mb-4"><h4 class="text-sm font-semibold text-yellow-400 mb-2">Ph\u1EA7n Th\u01B0\u1EDFng:</h4><div class="flex flex-wrap gap-2">`);
            if (quest.rewards) {
              _push(`<span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"> +${ssrInterpolate(JSON.parse(quest.rewards).experience || 0)} EXP </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--[-->`);
            ssrRenderList(JSON.parse(quest.rewards || "{}").resources || {}, (amount, resource) => {
              _push(`<span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"> +${ssrInterpolate(amount)} ${ssrInterpolate(resource)}</span>`);
            });
            _push(`<!--]--></div></div></div><button${ssrIncludeBooleanAttr(loading.value || player.value?.level < quest.level) ? " disabled" : ""} class="ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all duration-300"> Nh\u1EADn Nhi\u1EC7m V\u1EE5 </button></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeTab.value === "in_progress" && inProgressQuests.value.length > 0) {
          _push(`<div class="space-y-4"><h2 class="text-xl font-bold text-white mb-4">Nhi\u1EC7m V\u1EE5 \u0110ang Th\u1EF1c Hi\u1EC7n</h2><!--[-->`);
          ssrRenderList(inProgressQuests.value, (quest) => {
            _push(`<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-orange-500/20 p-6 hover:border-orange-500/40 transition-all duration-300"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center space-x-3 mb-3"><h3 class="text-lg font-bold text-white">${ssrInterpolate(quest.displayName)}</h3><span class="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full"> \u0110ang th\u1EF1c hi\u1EC7n </span></div><p class="text-gray-300 mb-4">${ssrInterpolate(quest.description)}</p><div class="mb-4"><div class="flex items-center justify-between text-sm text-gray-400 mb-2"><span>Ti\u1EBFn \u0111\u1ED9</span><span>100%</span></div><div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full" style="${ssrRenderStyle({ "width": "100%" })}"></div></div></div><div class="mb-4"><h4 class="text-sm font-semibold text-yellow-400 mb-2">Ph\u1EA7n Th\u01B0\u1EDFng:</h4><div class="flex flex-wrap gap-2">`);
            if (quest.rewards) {
              _push(`<span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"> +${ssrInterpolate(JSON.parse(quest.rewards).experience || 0)} EXP </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--[-->`);
            ssrRenderList(JSON.parse(quest.rewards || "{}").resources || {}, (amount, resource) => {
              _push(`<span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"> +${ssrInterpolate(amount)} ${ssrInterpolate(resource)}</span>`);
            });
            _push(`<!--]--></div></div></div><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="ml-4 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all duration-300"> Ho\xE0n Th\xE0nh </button></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeTab.value === "repeatable" && repeatableQuests.value.length > 0) {
          _push(`<div class="space-y-4"><h2 class="text-xl font-bold text-white mb-4">Nhi\u1EC7m V\u1EE5 L\u1EB7p L\u1EA1i</h2><!--[-->`);
          ssrRenderList(repeatableQuests.value, (quest) => {
            _push(`<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center space-x-3 mb-3"><h3 class="text-lg font-bold text-white">${ssrInterpolate(quest.displayName)}</h3><span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"> \u{1F504} ${ssrInterpolate(quest.repeatInterval)}p </span></div><p class="text-gray-300 mb-4">${ssrInterpolate(quest.description)}</p><div class="mb-4"><h4 class="text-sm font-semibold text-yellow-400 mb-2">Ph\u1EA7n Th\u01B0\u1EDFng:</h4><div class="flex flex-wrap gap-2">`);
            if (quest.rewards) {
              _push(`<span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"> +${ssrInterpolate(JSON.parse(quest.rewards).experience || 0)} EXP </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--[-->`);
            ssrRenderList(JSON.parse(quest.rewards || "{}").resources || {}, (amount, resource) => {
              _push(`<span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"> +${ssrInterpolate(amount)} ${ssrInterpolate(resource)}</span>`);
            });
            _push(`<!--]--></div></div></div><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all duration-300"> Nh\u1EADn Nhi\u1EC7m V\u1EE5 </button></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeTab.value === "cooldown" && cooldownQuests.value.length > 0) {
          _push(`<div class="space-y-4"><h2 class="text-xl font-bold text-white mb-4">Nhi\u1EC7m V\u1EE5 \u0110ang Ch\u1EDD L\xE0m M\u1EDBi</h2><!--[-->`);
          ssrRenderList(cooldownQuests.value, (quest) => {
            _push(`<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-orange-500/20 p-6 hover:border-orange-500/40 transition-all duration-300"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center space-x-3 mb-3"><h3 class="text-lg font-bold text-white">${ssrInterpolate(quest.displayName)}</h3><span class="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full"> \u23F0 ${ssrInterpolate(quest.playerStatus.cooldownRemaining)}s </span></div><p class="text-gray-300 mb-4">${ssrInterpolate(quest.description)}</p><div class="mb-4"><div class="text-sm text-gray-400"> Ho\xE0n th\xE0nh l\u1EA7n cu\u1ED1i: ${ssrInterpolate(formatDate(quest.playerStatus.lastCompletedAt))}</div><div class="text-sm text-orange-400"> C\xF3 th\u1EC3 nh\u1EADn l\u1EA1i sau: ${ssrInterpolate(formatTime(quest.playerStatus.cooldownRemaining))}</div></div></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeTab.value === "completed" && completedQuests.value.length > 0) {
          _push(`<div class="space-y-4"><h2 class="text-xl font-bold text-white mb-4">Nhi\u1EC7m V\u1EE5 \u0110\xE3 Ho\xE0n Th\xE0nh</h2><!--[-->`);
          ssrRenderList(completedQuests.value, (quest) => {
            _push(`<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center space-x-3 mb-3"><h3 class="text-lg font-bold text-white">${ssrInterpolate(quest.displayName)}</h3><span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"> \u0110\xE3 ho\xE0n th\xE0nh </span></div><p class="text-gray-300 mb-4">${ssrInterpolate(quest.description)}</p><div class="text-sm text-gray-400"> Ho\xE0n th\xE0nh: ${ssrInterpolate(formatDate(quest.playerStatus.completedAt))}</div></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (getCurrentQuests.value.length === 0) {
          _push(`<div class="text-center py-12"><div class="text-6xl mb-4">\u{1F4CB}</div><div class="text-xl text-gray-400 mb-2">${ssrInterpolate(activeTab.value === "available" ? "Kh\xF4ng c\xF3 nhi\u1EC7m v\u1EE5 n\xE0o" : activeTab.value === "in_progress" ? "Kh\xF4ng c\xF3 nhi\u1EC7m v\u1EE5 \u0111ang th\u1EF1c hi\u1EC7n" : "Ch\u01B0a ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5 n\xE0o")}</div><div class="text-sm text-gray-500">${ssrInterpolate(activeTab.value === "available" ? "H\xE3y n\xE2ng c\u1EA5p level \u0111\u1EC3 m\u1EDF kh\xF3a nhi\u1EC7m v\u1EE5 m\u1EDBi" : activeTab.value === "in_progress" ? "H\xE3y nh\u1EADn nhi\u1EC7m v\u1EE5 \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u" : "H\xE3y ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5 \u0111\u1EC3 xem l\u1ECBch s\u1EED")}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (loading.value) {
          _push(`<div class="text-center py-12"><div class="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div><div class="text-gray-400">\u0110ang t\u1EA3i nhi\u1EC7m v\u1EE5...</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quest.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=quest-kCXcHEBo.mjs.map
