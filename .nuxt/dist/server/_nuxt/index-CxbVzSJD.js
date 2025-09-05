import { _ as _sfc_main$2 } from "./LoginForm-B1tZwOQp.js";
import { _ as __nuxt_component_0 } from "./nuxt-link-CnYqct-M.js";
import { ref, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext, watch, createVNode, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { u as useRankingStore } from "./ranking-DeF6yzfr.js";
import { u as useAuthStore } from "./auth-EzXceMbr.js";
import { u as usePlayerStore } from "./player-B72JDVVQ.js";
import { u as useCharacterStore } from "./character-BBuP_n1i.js";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/hookable/dist/index.mjs";
import "../server.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/unctx/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/radix3/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/defu/dist/defu.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/ufo/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/klona/dist/index.mjs";
const _sfc_main$1 = {
  __name: "RankingWidget",
  __ssrInlineRender: true,
  setup(__props) {
    const rankingStore = useRankingStore();
    const loading = ref(false);
    const topPlayers = computed(() => rankingStore.topPlayers);
    const getRankIcon = (rank) => {
      if (rank === 1) return "👑";
      if (rank === 2) return "🥈";
      if (rank === 3) return "🥉";
      return rank;
    };
    const formatNumber = (num) => {
      if (!num) return "0";
      return new Intl.NumberFormat("vi-VN").format(num);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6" }, _attrs))}><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-bold text-white flex items-center"> 🏆 Top 3 Người Chơi </h3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/ranking",
        class: "text-sm text-purple-400 hover:text-purple-300 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Xem tất cả → `);
          } else {
            return [
              createTextVNode(" Xem tất cả → ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="text-center py-4"><div class="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div></div>`);
      } else if (unref(topPlayers).length === 0) {
        _push(`<div class="text-center py-4 text-gray-400"> Chưa có dữ liệu </div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(topPlayers).slice(0, 3), (player, index) => {
          _push(`<div class="${ssrRenderClass([
            "flex items-center justify-between p-3 rounded-lg transition-colors",
            index === 0 ? "bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30" : index === 1 ? "bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/30" : "bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30"
          ])}"><div class="flex items-center space-x-3"><div class="${ssrRenderClass([
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
            index === 0 ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-black" : index === 1 ? "bg-gradient-to-br from-gray-400 to-gray-600 text-white" : "bg-gradient-to-br from-orange-600 to-red-600 text-white"
          ])}">${ssrInterpolate(getRankIcon(index + 1))}</div><div><div class="font-medium text-white">${ssrInterpolate(player.name)}</div><div class="text-xs text-gray-400">Cấp ${ssrInterpolate(player.level)}</div></div></div><div class="text-right"><div class="text-sm font-bold text-yellow-400">${ssrInterpolate(formatNumber(player.combatPower))}</div><div class="text-xs text-gray-400">SMCĐ</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RankingWidget.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const playerStore = usePlayerStore();
    const characterStore = useCharacterStore();
    const isAuthenticated = computed(() => authStore.isLoggedIn);
    const player = computed(() => playerStore.player);
    computed(() => playerStore.resources);
    computed(() => playerStore.companions);
    const getResourceAmount = (resourceName) => {
      const resource = playerStore.getResourceByName(resourceName);
      return resource ? Number(resource.amount).toLocaleString() : "0";
    };
    const menuItems = [
      { name: "Nhân vật", icon: "👤", active: false, route: "/character" },
      { name: "Thiên Phú", icon: "⭐", active: false, route: "/talent" },
      { name: "Tu Luyện", icon: "🧘", active: false, route: "/cultivation" },
      { name: "Cửa Hàng", icon: "🏠", active: false, route: "/shop" },
      { name: "Túi", icon: "🎒", active: false, route: "/inventory" },
      { name: "Đạo Lô", icon: "🔥", active: false, route: "/furnace" },
      { name: "Linh Thú", icon: "🐾", active: false, route: "/spirit-beast" },
      { name: "Đạo Lữ", icon: "👥", active: false, route: null },
      { name: "Pháp Bảo", icon: "⚔️", active: false, route: null },
      { name: "Luyện Đan", icon: "⚗️", active: false, route: null },
      { name: "Luyện Khí", icon: "🔨", active: false, route: null },
      { name: "Trận pháp", icon: "🔮", active: false, route: null },
      { name: "Xếp Hạng", icon: "🏆", active: false, route: "/ranking" },
      { name: "Danh hiệu", icon: "👑", active: false, route: null },
      { name: "Nhiệm Vụ", icon: "📋", active: false, route: "/quest" },
      { name: "Nạp Thẻ", icon: "🏛️", active: false, route: null }
    ];
    watch(isAuthenticated, async (newValue) => {
      if (newValue && authStore.user?.player) {
        await playerStore.initializePlayer(authStore.user.player.id);
        await characterStore.fetchCharacterData(authStore.user.player.id);
      } else {
        characterStore.reset();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoginForm = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_RankingWidget = _sfc_main$1;
      if (!unref(isAuthenticated)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_LoginForm, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen text-white" }, _attrs))}><header class="bg-game-gray/80 backdrop-blur-sm border-b border-white/10"><div class="container mx-auto px-4 py-3"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center"><span class="text-lg font-bold">${ssrInterpolate(unref(player)?.name?.charAt(0) || "V")}</span></div><div><h2 class="text-lg font-semibold">${ssrInterpolate(unref(player)?.name || "Viễn Cổ Đại Năng")}</h2><p class="text-sm text-game-text-secondary">Cấp ${ssrInterpolate(unref(player)?.level || 138)} | Chuyển: ${ssrInterpolate(unref(player)?.realm || "Phàm cảnh")}</p></div></div><div class="flex items-center space-x-6"><div class="text-center"><p class="text-sm text-game-text-secondary">Tiên Ngọc</p><p class="text-lg font-semibold text-yellow-400">${ssrInterpolate(getResourceAmount("tien_ngoc"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Linh Thạch</p><p class="text-lg font-semibold text-blue-400">${ssrInterpolate(getResourceAmount("linh_thach"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Nguyên Thạch</p><p class="text-lg font-semibold text-green-400">${ssrInterpolate(getResourceAmount("nguyen_thach"))}</p></div></div><div class="flex items-center space-x-2"><button class="game-button px-6 py-2 rounded-lg text-white font-semibold"> Chí Tôn Tam Trọng </button><button class="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"> Đăng xuất </button></div></div></div></header><nav class="bg-game-gray/60 backdrop-blur-sm border-b border-white/10"><div class="container mx-auto px-4 py-2"><div class="flex space-x-1 mb-4"><button class="px-4 py-2 bg-game-light rounded-lg text-white font-medium"> Mở hoạt động </button><button class="px-4 py-2 text-game-text-secondary hover:text-white transition-colors"> Sự kiện: Dao Trì </button></div><div class="grid grid-cols-7 gap-4"><!--[-->`);
        ssrRenderList(menuItems, (menuItem) => {
          _push(`<div class="${ssrRenderClass([{ "bg-game-accent/20 border border-game-accent": menuItem.active }, "flex flex-col items-center p-3 rounded-lg hover:bg-game-light/50 transition-colors cursor-pointer"])}"><div class="w-12 h-12 rounded-full bg-game-light flex items-center justify-center mb-2"><span class="text-2xl">${ssrInterpolate(menuItem.icon)}</span></div><span class="text-xs text-center">${ssrInterpolate(menuItem.name)}</span></div>`);
        });
        _push(`<!--]--></div></div></nav><main class="container mx-auto px-4 py-8"><div class="text-center mb-8"><h1 class="text-4xl font-bold mb-4">Thiên Hạ Đệ Nhị Tông</h1><div class="flex items-center justify-center space-x-8 mb-8"><div class="text-center"><div class="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center mb-2 mx-auto"><span class="text-2xl">🌸</span></div><p class="text-sm">Thiên Hoa Tiên Cơ</p><span class="text-xs text-game-accent">+60</span></div><div class="text-center"><div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center mb-4 mx-auto"><div class="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center"><span class="text-4xl">☯</span></div></div></div><div class="text-center"><div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center mb-2 mx-auto"><span class="text-2xl">🐉</span></div><p class="text-sm">Ngân Long</p><span class="text-xs text-game-accent">+100</span></div></div><div class="max-w-2xl mx-auto mb-8"><p class="text-lg font-semibold text-orange-400 mb-2"> Chào mừng đến với Thiên Hạ Đệ Nhị Tông </p><p class="text-sm text-game-text-secondary italic"> &quot;Linh khí hội tụ, nguyên thần an định, thiên địa cảm ứng, đạo vận luân hồi.&quot; </p></div><div class="max-w-6xl mx-auto"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/character",
          class: "game-card p-6 rounded-lg hover:bg-game-light/60 transition-all duration-300 cursor-pointer"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center space-x-4"${_scopeId}><div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center"${_scopeId}><span class="text-2xl"${_scopeId}>👤</span></div><div class="flex-1"${_scopeId}><h3 class="text-xl font-semibold text-white mb-2"${_scopeId}>Nhân Vật</h3><p class="text-game-text-secondary mb-2"${_scopeId}>Quản lý thuộc tính, trang bị và kỹ năng</p><div class="flex items-center space-x-4 text-sm"${_scopeId}><span class="text-yellow-400"${_scopeId}>Combat Power: ${ssrInterpolate(unref(characterStore).combatPower?.toLocaleString() || "0")}</span><span class="text-purple-400"${_scopeId}>Level: ${ssrInterpolate(unref(player)?.level || 1)}</span></div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center space-x-4" }, [
                  createVNode("div", { class: "w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center" }, [
                    createVNode("span", { class: "text-2xl" }, "👤")
                  ]),
                  createVNode("div", { class: "flex-1" }, [
                    createVNode("h3", { class: "text-xl font-semibold text-white mb-2" }, "Nhân Vật"),
                    createVNode("p", { class: "text-game-text-secondary mb-2" }, "Quản lý thuộc tính, trang bị và kỹ năng"),
                    createVNode("div", { class: "flex items-center space-x-4 text-sm" }, [
                      createVNode("span", { class: "text-yellow-400" }, "Combat Power: " + toDisplayString(unref(characterStore).combatPower?.toLocaleString() || "0"), 1),
                      createVNode("span", { class: "text-purple-400" }, "Level: " + toDisplayString(unref(player)?.level || 1), 1)
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/cultivation",
          class: "game-card p-6 rounded-lg hover:bg-game-light/60 transition-all duration-300 cursor-pointer"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center space-x-4"${_scopeId}><div class="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center"${_scopeId}><span class="text-2xl"${_scopeId}>🧘</span></div><div class="flex-1"${_scopeId}><h3 class="text-xl font-semibold text-white mb-2"${_scopeId}>Tu Luyện</h3><p class="text-game-text-secondary mb-2"${_scopeId}>Nâng cao cấp độ và cảnh giới</p><div class="flex items-center space-x-4 text-sm"${_scopeId}><span class="text-orange-400"${_scopeId}>Realm: ${ssrInterpolate(unref(player)?.realm || "Phàm cảnh")}</span><span class="text-purple-400"${_scopeId}>Huyền Lực: ${ssrInterpolate(getResourceAmount("huyen_luc"))}</span></div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center space-x-4" }, [
                  createVNode("div", { class: "w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center" }, [
                    createVNode("span", { class: "text-2xl" }, "🧘")
                  ]),
                  createVNode("div", { class: "flex-1" }, [
                    createVNode("h3", { class: "text-xl font-semibold text-white mb-2" }, "Tu Luyện"),
                    createVNode("p", { class: "text-game-text-secondary mb-2" }, "Nâng cao cấp độ và cảnh giới"),
                    createVNode("div", { class: "flex items-center space-x-4 text-sm" }, [
                      createVNode("span", { class: "text-orange-400" }, "Realm: " + toDisplayString(unref(player)?.realm || "Phàm cảnh"), 1),
                      createVNode("span", { class: "text-purple-400" }, "Huyền Lực: " + toDisplayString(getResourceAmount("huyen_luc")), 1)
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="lg:col-span-1">`);
        _push(ssrRenderComponent(_component_RankingWidget, null, null, _parent));
        _push(`</div></div></div></div></main></div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-CxbVzSJD.js.map
