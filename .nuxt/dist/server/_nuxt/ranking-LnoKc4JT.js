import { ref, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { u as useRankingStore } from "./ranking-DeF6yzfr.js";
import { u as useAuthStore } from "./auth-EzXceMbr.js";
import "../server.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/hookable/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/unctx/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/radix3/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/defu/dist/defu.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/ufo/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/klona/dist/index.mjs";
const _sfc_main = {
  __name: "ranking",
  __ssrInlineRender: true,
  setup(__props) {
    const rankingStore = useRankingStore();
    useAuthStore();
    const rankingTypes = ref([
      { value: "level", label: "Cấp Độ", icon: "📈" },
      { value: "combat_power", label: "Sức Mạnh", icon: "⚔️" },
      { value: "experience", label: "Kinh Nghiệm", icon: "⭐" }
    ]);
    const topPlayers = computed(() => rankingStore.topPlayers);
    const currentType = computed(() => rankingStore.currentType);
    const loading = computed(() => rankingStore.loading);
    const lastUpdated = computed(() => rankingStore.lastUpdated);
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
    const formatTime = (time) => {
      if (!time) return "Chưa cập nhật";
      return new Date(time).toLocaleString("vi-VN");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white" }, _attrs))}><div class="bg-black/20 backdrop-blur-sm border-b border-purple-500/30"><div class="container mx-auto px-4 py-6"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><h1 class="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> 🏆 Bảng Xếp Hạng </h1><div class="text-sm text-gray-400"> Cập nhật: ${ssrInterpolate(formatTime(lastUpdated.value))}</div></div><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors">${ssrInterpolate(loading.value ? "Đang tải..." : "🔄 Làm mới")}</button></div></div></div><div class="container mx-auto px-4 py-6"><div class="flex space-x-2 mb-8"><!--[-->`);
      ssrRenderList(rankingTypes.value, (type) => {
        _push(`<button class="${ssrRenderClass([
          "px-6 py-3 rounded-lg font-medium transition-all duration-300",
          currentType.value === type.value ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
        ])}">${ssrInterpolate(type.icon)} ${ssrInterpolate(type.label)}</button>`);
      });
      _push(`<!--]--></div><div class="grid gap-6">`);
      if (topPlayers.value.length >= 3) {
        _push(`<div class="flex justify-center items-end space-x-8 mb-8"><div class="text-center"><div class="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-2xl font-bold mb-2"> 2 </div><div class="bg-gray-800/80 rounded-lg p-4 min-w-[200px]"><div class="text-lg font-bold text-gray-300">${ssrInterpolate(topPlayers.value[1]?.name)}</div><div class="text-sm text-gray-400">Cấp ${ssrInterpolate(topPlayers.value[1]?.level)}</div><div class="text-yellow-400 font-bold">${ssrInterpolate(formatNumber(topPlayers.value[1]?.combatPower))} SMCĐ</div></div></div><div class="text-center"><div class="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl font-bold mb-2 shadow-2xl"> 👑 </div><div class="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-6 min-w-[250px] border border-yellow-500/30"><div class="text-xl font-bold text-yellow-400">${ssrInterpolate(topPlayers.value[0]?.name)}</div><div class="text-sm text-yellow-300">Cấp ${ssrInterpolate(topPlayers.value[0]?.level)} - ${ssrInterpolate(topPlayers.value[0]?.realm)}</div><div class="text-yellow-200 font-bold text-lg">${ssrInterpolate(formatNumber(topPlayers.value[0]?.combatPower))} SMCĐ</div></div></div><div class="text-center"><div class="w-24 h-24 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center text-2xl font-bold mb-2"> 3 </div><div class="bg-gray-800/80 rounded-lg p-4 min-w-[200px]"><div class="text-lg font-bold text-gray-300">${ssrInterpolate(topPlayers.value[2]?.name)}</div><div class="text-sm text-gray-400">Cấp ${ssrInterpolate(topPlayers.value[2]?.level)}</div><div class="text-yellow-400 font-bold">${ssrInterpolate(formatNumber(topPlayers.value[2]?.combatPower))} SMCĐ</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead class="bg-purple-900/30"><tr><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Hạng</th><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Tên</th><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Cấp</th><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Cảnh Giới</th><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">SMCĐ</th><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Kinh Nghiệm</th><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Tài Nguyên</th></tr></thead><tbody class="divide-y divide-gray-700/50"><!--[-->`);
      ssrRenderList(topPlayers.value, (player, index) => {
        _push(`<tr class="${ssrRenderClass([
          "hover:bg-gray-800/30 transition-colors",
          index < 3 ? "bg-gradient-to-r from-purple-900/20 to-pink-900/20" : ""
        ])}"><td class="px-6 py-4"><div class="flex items-center"><span class="${ssrRenderClass([
          "text-lg font-bold",
          index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-orange-400" : "text-gray-400"
        ])}">${ssrInterpolate(getRankIcon(index + 1))}</span></div></td><td class="px-6 py-4"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">${ssrInterpolate(player.name.charAt(0).toUpperCase())}</div><div><div class="font-medium text-white">${ssrInterpolate(player.name)}</div><div class="text-xs text-gray-400">${ssrInterpolate(player.equipmentCount)} trang bị</div></div></div></td><td class="px-6 py-4"><div class="text-lg font-bold text-blue-400">${ssrInterpolate(player.level)}</div></td><td class="px-6 py-4"><div class="text-sm text-purple-300">${ssrInterpolate(player.realm)}</div></td><td class="px-6 py-4"><div class="text-lg font-bold text-yellow-400">${ssrInterpolate(formatNumber(player.combatPower))}</div></td><td class="px-6 py-4"><div class="text-sm text-green-400">${ssrInterpolate(formatNumber(player.experience))}</div></td><td class="px-6 py-4"><div class="text-xs space-y-1"><div class="text-yellow-300">⚡ ${ssrInterpolate(formatNumber(player.resources.huyenLuc))}</div><div class="text-blue-300">💎 ${ssrInterpolate(formatNumber(player.resources.linhThach))}</div></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
      if (loading.value) {
        _push(`<div class="text-center py-12"><div class="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div><div class="text-gray-400">Đang tải bảng xếp hạng...</div></div>`);
      } else if (topPlayers.value.length === 0) {
        _push(`<div class="text-center py-12"><div class="text-6xl mb-4">🏆</div><div class="text-xl text-gray-400 mb-2">Chưa có dữ liệu xếp hạng</div><div class="text-sm text-gray-500">Hãy thử lại sau hoặc kiểm tra kết nối</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ranking.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=ranking-LnoKc4JT.js.map
