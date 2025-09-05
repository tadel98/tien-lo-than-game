import { ref, computed, mergeProps, useSSRContext } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/vue/server-renderer/index.mjs';
import { u as useRankingStore } from './ranking-DeF6yzfr.mjs';
import { u as useAuthStore } from './auth-EzXceMbr.mjs';
import './server.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';
import 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/ufo/dist/index.mjs';
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

const _sfc_main = {
  __name: "ranking",
  __ssrInlineRender: true,
  setup(__props) {
    const rankingStore = useRankingStore();
    useAuthStore();
    const rankingTypes = ref([
      { value: "level", label: "C\u1EA5p \u0110\u1ED9", icon: "\u{1F4C8}" },
      { value: "combat_power", label: "S\u1EE9c M\u1EA1nh", icon: "\u2694\uFE0F" },
      { value: "experience", label: "Kinh Nghi\u1EC7m", icon: "\u2B50" }
    ]);
    const topPlayers = computed(() => rankingStore.topPlayers);
    const currentType = computed(() => rankingStore.currentType);
    const loading = computed(() => rankingStore.loading);
    const lastUpdated = computed(() => rankingStore.lastUpdated);
    const getRankIcon = (rank) => {
      if (rank === 1) return "\u{1F451}";
      if (rank === 2) return "\u{1F948}";
      if (rank === 3) return "\u{1F949}";
      return rank;
    };
    const formatNumber = (num) => {
      if (!num) return "0";
      return new Intl.NumberFormat("vi-VN").format(num);
    };
    const formatTime = (time) => {
      if (!time) return "Ch\u01B0a c\u1EADp nh\u1EADt";
      return new Date(time).toLocaleString("vi-VN");
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white" }, _attrs))}><div class="bg-black/20 backdrop-blur-sm border-b border-purple-500/30"><div class="container mx-auto px-4 py-6"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><h1 class="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> \u{1F3C6} B\u1EA3ng X\u1EBFp H\u1EA1ng </h1><div class="text-sm text-gray-400"> C\u1EADp nh\u1EADt: ${ssrInterpolate(formatTime(lastUpdated.value))}</div></div><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors">${ssrInterpolate(loading.value ? "\u0110ang t\u1EA3i..." : "\u{1F504} L\xE0m m\u1EDBi")}</button></div></div></div><div class="container mx-auto px-4 py-6"><div class="flex space-x-2 mb-8"><!--[-->`);
      ssrRenderList(rankingTypes.value, (type) => {
        _push(`<button class="${ssrRenderClass([
          "px-6 py-3 rounded-lg font-medium transition-all duration-300",
          currentType.value === type.value ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
        ])}">${ssrInterpolate(type.icon)} ${ssrInterpolate(type.label)}</button>`);
      });
      _push(`<!--]--></div><div class="grid gap-6">`);
      if (topPlayers.value.length >= 3) {
        _push(`<div class="flex justify-center items-end space-x-8 mb-8"><div class="text-center"><div class="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-2xl font-bold mb-2"> 2 </div><div class="bg-gray-800/80 rounded-lg p-4 min-w-[200px]"><div class="text-lg font-bold text-gray-300">${ssrInterpolate((_a = topPlayers.value[1]) == null ? void 0 : _a.name)}</div><div class="text-sm text-gray-400">C\u1EA5p ${ssrInterpolate((_b = topPlayers.value[1]) == null ? void 0 : _b.level)}</div><div class="text-yellow-400 font-bold">${ssrInterpolate(formatNumber((_c = topPlayers.value[1]) == null ? void 0 : _c.combatPower))} SMC\u0110</div></div></div><div class="text-center"><div class="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl font-bold mb-2 shadow-2xl"> \u{1F451} </div><div class="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-6 min-w-[250px] border border-yellow-500/30"><div class="text-xl font-bold text-yellow-400">${ssrInterpolate((_d = topPlayers.value[0]) == null ? void 0 : _d.name)}</div><div class="text-sm text-yellow-300">C\u1EA5p ${ssrInterpolate((_e = topPlayers.value[0]) == null ? void 0 : _e.level)} - ${ssrInterpolate((_f = topPlayers.value[0]) == null ? void 0 : _f.realm)}</div><div class="text-yellow-200 font-bold text-lg">${ssrInterpolate(formatNumber((_g = topPlayers.value[0]) == null ? void 0 : _g.combatPower))} SMC\u0110</div></div></div><div class="text-center"><div class="w-24 h-24 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center text-2xl font-bold mb-2"> 3 </div><div class="bg-gray-800/80 rounded-lg p-4 min-w-[200px]"><div class="text-lg font-bold text-gray-300">${ssrInterpolate((_h = topPlayers.value[2]) == null ? void 0 : _h.name)}</div><div class="text-sm text-gray-400">C\u1EA5p ${ssrInterpolate((_i = topPlayers.value[2]) == null ? void 0 : _i.level)}</div><div class="text-yellow-400 font-bold">${ssrInterpolate(formatNumber((_j = topPlayers.value[2]) == null ? void 0 : _j.combatPower))} SMC\u0110</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead class="bg-purple-900/30"><tr><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">H\u1EA1ng</th><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">T\xEAn</th><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">C\u1EA5p</th><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">C\u1EA3nh Gi\u1EDBi</th><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">SMC\u0110</th><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Kinh Nghi\u1EC7m</th><th class="px-6 py-4 text-left text-sm font-medium text-purple-300">T\xE0i Nguy\xEAn</th></tr></thead><tbody class="divide-y divide-gray-700/50"><!--[-->`);
      ssrRenderList(topPlayers.value, (player, index) => {
        _push(`<tr class="${ssrRenderClass([
          "hover:bg-gray-800/30 transition-colors",
          index < 3 ? "bg-gradient-to-r from-purple-900/20 to-pink-900/20" : ""
        ])}"><td class="px-6 py-4"><div class="flex items-center"><span class="${ssrRenderClass([
          "text-lg font-bold",
          index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-orange-400" : "text-gray-400"
        ])}">${ssrInterpolate(getRankIcon(index + 1))}</span></div></td><td class="px-6 py-4"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">${ssrInterpolate(player.name.charAt(0).toUpperCase())}</div><div><div class="font-medium text-white">${ssrInterpolate(player.name)}</div><div class="text-xs text-gray-400">${ssrInterpolate(player.equipmentCount)} trang b\u1ECB</div></div></div></td><td class="px-6 py-4"><div class="text-lg font-bold text-blue-400">${ssrInterpolate(player.level)}</div></td><td class="px-6 py-4"><div class="text-sm text-purple-300">${ssrInterpolate(player.realm)}</div></td><td class="px-6 py-4"><div class="text-lg font-bold text-yellow-400">${ssrInterpolate(formatNumber(player.combatPower))}</div></td><td class="px-6 py-4"><div class="text-sm text-green-400">${ssrInterpolate(formatNumber(player.experience))}</div></td><td class="px-6 py-4"><div class="text-xs space-y-1"><div class="text-yellow-300">\u26A1 ${ssrInterpolate(formatNumber(player.resources.huyenLuc))}</div><div class="text-blue-300">\u{1F48E} ${ssrInterpolate(formatNumber(player.resources.linhThach))}</div></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
      if (loading.value) {
        _push(`<div class="text-center py-12"><div class="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div><div class="text-gray-400">\u0110ang t\u1EA3i b\u1EA3ng x\u1EBFp h\u1EA1ng...</div></div>`);
      } else if (topPlayers.value.length === 0) {
        _push(`<div class="text-center py-12"><div class="text-6xl mb-4">\u{1F3C6}</div><div class="text-xl text-gray-400 mb-2">Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u x\u1EBFp h\u1EA1ng</div><div class="text-sm text-gray-500">H\xE3y th\u1EED l\u1EA1i sau ho\u1EB7c ki\u1EC3m tra k\u1EBFt n\u1ED1i</div></div>`);
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

export { _sfc_main as default };
//# sourceMappingURL=ranking-LnoKc4JT.mjs.map
