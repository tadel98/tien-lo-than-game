import { _ as __nuxt_component_0 } from './nuxt-link-CnYqct-M.mjs';
import { computed, ref, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-EzXceMbr.mjs';
import { u as usePlayerStore } from './player-B72JDVVQ.mjs';
import { u as useShopStore } from './shop-DYNcnUVr.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "inventory",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const playerStore = usePlayerStore();
    const shopStore = useShopStore();
    const isAuthenticated = computed(() => authStore.isLoggedIn);
    computed(() => playerStore.player);
    computed(() => playerStore.resources);
    const inventory = computed(() => shopStore.inventory);
    const groupedInventory = computed(() => shopStore.groupedInventory);
    const loading = computed(() => shopStore.loading);
    const error = computed(() => shopStore.error);
    const getTotalItems = computed(() => shopStore.getTotalItems);
    const selectedCategory = ref("all");
    const itemCategories = [
      { type: "all", name: "T\u1EA5t C\u1EA3", icon: "\u{1F4E6}" },
      { type: "equipment", name: "Trang B\u1ECB", icon: "\u2694\uFE0F" },
      { type: "consumable", name: "Ti\xEAu Hao", icon: "\u{1F9EA}" },
      { type: "material", name: "Nguy\xEAn Li\u1EC7u", icon: "\u{1F48E}" },
      { type: "skill", name: "K\u1EF9 N\u0103ng", icon: "\u{1F4DC}" },
      { type: "talent", name: "Thi\xEAn Ph\xFA", icon: "\u2B50" }
    ];
    const filteredItems = computed(() => {
      if (selectedCategory.value === "all") {
        return inventory.value;
      }
      return inventory.value.filter((item) => item.itemType === selectedCategory.value);
    });
    const getEquipmentCount = computed(() => {
      return inventory.value.filter((item) => item.itemType === "equipment").length;
    });
    const getConsumableCount = computed(() => {
      return inventory.value.filter((item) => item.itemType === "consumable").length;
    });
    const getResourceAmount = (resourceName) => {
      const resource = playerStore.getResourceByName(resourceName);
      return resource ? Number(resource.amount).toLocaleString() : "0";
    };
    const getItemTypeIcon = (itemType) => shopStore.getItemTypeIcon(itemType);
    const getItemTypeName = (itemType) => {
      const types = {
        equipment: "Trang B\u1ECB",
        consumable: "Ti\xEAu Hao",
        material: "Nguy\xEAn Li\u1EC7u",
        skill: "K\u1EF9 N\u0103ng",
        talent: "Thi\xEAn Ph\xFA"
      };
      return types[itemType] || itemType;
    };
    const getItemCount = (itemType) => {
      if (itemType === "all") {
        return inventory.value.length;
      }
      return inventory.value.filter((item) => item.itemType === itemType).length;
    };
    const canUseItem = (item) => {
      return item.itemType === "consumable" || item.itemType === "equipment";
    };
    watch(isAuthenticated, async (newValue) => {
      if (newValue && authStore.user?.player) {
        await playerStore.initializePlayer(authStore.user.player.id);
        await shopStore.fetchInventory(authStore.user.player.id);
      } else {
        shopStore.reset();
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
            _push2(` \u{1F392} T\xFAi \u0110\u1ED3 `);
          } else {
            return [
              createTextVNode(" \u{1F392} T\xFAi \u0110\u1ED3 ")
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
      _push(`<button class="game-button px-6 py-2 rounded-lg text-white font-semibold"> \u{1F6AA} \u0110\u0103ng Xu\u1EA5t </button></div></div></div></header><main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="mb-8"><div class="game-card p-6 rounded-lg"><h2 class="text-2xl font-bold text-white mb-4">Th\u1ED1ng K\xEA T\xFAi \u0110\u1ED3</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-4"><div class="text-center"><div class="text-2xl font-bold text-blue-400">${ssrInterpolate(unref(getTotalItems))}</div><div class="text-sm text-game-text-secondary">T\u1ED5ng Items</div></div><div class="text-center"><div class="text-2xl font-bold text-green-400">${ssrInterpolate(Object.keys(unref(groupedInventory)).length)}</div><div class="text-sm text-game-text-secondary">Lo\u1EA1i Items</div></div><div class="text-center"><div class="text-2xl font-bold text-purple-400">${ssrInterpolate(unref(getEquipmentCount))}</div><div class="text-sm text-game-text-secondary">Trang B\u1ECB</div></div><div class="text-center"><div class="text-2xl font-bold text-yellow-400">${ssrInterpolate(unref(getConsumableCount))}</div><div class="text-sm text-game-text-secondary">Ti\xEAu Hao</div></div></div></div></div><div class="mb-8"><h2 class="text-2xl font-bold text-white mb-4">Danh M\u1EE5c Items</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-4"><!--[-->`);
      ssrRenderList(itemCategories, (category) => {
        _push(`<button class="${ssrRenderClass([
          "p-4 rounded-lg border-2 transition-all duration-300",
          unref(selectedCategory) === category.type ? "border-purple-500 bg-purple-500/20" : "border-gray-600 bg-gray-800/50 hover:border-purple-400"
        ])}"><div class="text-center"><div class="text-3xl mb-2">${ssrInterpolate(category.icon)}</div><div class="text-sm font-semibold text-white">${ssrInterpolate(category.name)}</div><div class="text-xs text-game-text-secondary">${ssrInterpolate(getItemCount(category.type))} items</div></div></button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-8"><div class="text-white">\u0110ang t\u1EA3i t\xFAi \u0111\u1ED3...</div></div>`);
      } else if (unref(error)) {
        _push(`<div class="text-center py-8"><div class="text-red-400">L\u1ED7i: ${ssrInterpolate(unref(error))}</div></div>`);
      } else if (unref(filteredItems).length === 0) {
        _push(`<div class="text-center py-12"><div class="text-6xl mb-4">\u{1F4E6}</div><div class="text-xl text-white mb-2">T\xFAi \u0111\u1ED3 tr\u1ED1ng</div><div class="text-game-text-secondary">H\xE3y mua s\u1EAFm t\u1EA1i c\u1EEDa h\xE0ng \u0111\u1EC3 c\xF3 items!</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/shop",
          class: "inline-block mt-4 game-button px-6 py-2 rounded-lg text-white font-semibold"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u{1F3EA} \u0110\u1EBFn C\u1EEDa H\xE0ng `);
            } else {
              return [
                createTextVNode(" \u{1F3EA} \u0110\u1EBFn C\u1EEDa H\xE0ng ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(unref(filteredItems), (item) => {
          _push(`<div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300"><div class="flex items-start justify-between mb-3"><div class="flex items-center space-x-3"><span class="text-2xl">${ssrInterpolate(getItemTypeIcon(item.itemType))}</span><div><h4 class="text-lg font-semibold text-white">${ssrInterpolate(item.name)}</h4><div class="text-xs text-game-text-secondary">${ssrInterpolate(getItemTypeName(item.itemType))}</div></div></div></div><div class="mb-3"><div class="flex items-center justify-between"><span class="text-sm text-game-text-secondary">S\u1ED1 l\u01B0\u1EE3ng:</span><span class="text-sm font-semibold text-white">${ssrInterpolate(item.quantity)}</span></div>`);
          if (item.stackable) {
            _push(`<div class="flex items-center justify-between"><span class="text-sm text-game-text-secondary">C\xF3 th\u1EC3 x\u1EBFp ch\u1ED3ng:</span><span class="text-sm text-green-400">\u2713</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex items-center space-x-2"><button${ssrIncludeBooleanAttr(!canUseItem(item)) ? " disabled" : ""} class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white"> S\u1EED D\u1EE5ng </button><button class="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold text-white"> V\u1EE9t </button></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/inventory.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=inventory-Bxj67TO8.mjs.map
