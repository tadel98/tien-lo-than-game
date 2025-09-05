import { _ as __nuxt_component_0 } from "./nuxt-link-CnYqct-M.js";
import { computed, ref, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { u as useAuthStore } from "./auth-EzXceMbr.js";
import { u as usePlayerStore } from "./player-B72JDVVQ.js";
import { u as useShopStore } from "./shop-DYNcnUVr.js";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/hookable/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/unctx/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/radix3/dist/index.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/defu/dist/defu.mjs";
import "C:/Users/THE SUN/Desktop/TienLoThan/node_modules/klona/dist/index.mjs";
const _sfc_main = {
  __name: "shop",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const playerStore = usePlayerStore();
    const shopStore = useShopStore();
    const isAuthenticated = computed(() => authStore.isLoggedIn);
    const player = computed(() => playerStore.player);
    computed(() => playerStore.resources);
    const shops = computed(() => shopStore.shops);
    const loading = computed(() => shopStore.loading);
    const error = computed(() => shopStore.error);
    const currentShop = computed(() => shopStore.currentShop);
    const selectedCategory = ref("all");
    const purchaseQuantities = ref({});
    const shopCategories = [
      { name: "all", displayName: "Tất Cả", icon: "🏪", description: "Xem tất cả cửa hàng" },
      { name: "equipment", displayName: "Trang Bị", icon: "⚔️", description: "Vũ khí và áo giáp" },
      { name: "consumables", displayName: "Tiêu Hao", icon: "🧪", description: "Thuốc và vật phẩm" },
      { name: "materials", displayName: "Nguyên Liệu", icon: "💎", description: "Vật liệu chế tạo" }
    ];
    const filteredShops = computed(() => {
      if (selectedCategory.value === "all") {
        return shops.value;
      }
      return shops.value.filter((shop) => shop.category === selectedCategory.value);
    });
    const getResourceAmount = (resourceName) => {
      const resource = playerStore.getResourceByName(resourceName);
      return resource ? Number(resource.amount).toLocaleString() : "0";
    };
    const getCategoryDisplayName = (category) => {
      const cat = shopCategories.find((c) => c.name === category);
      return cat ? cat.displayName : category;
    };
    const getCurrencyName = (currency) => {
      const currencies = {
        tien_ngoc: "Tiên Ngọc",
        linh_thach: "Linh Thạch",
        nguyen_thach: "Nguyên Thạch"
      };
      return currencies[currency] || currency;
    };
    const getRarityColor = (rarity) => shopStore.getRarityColor(rarity);
    const getItemTypeIcon = (itemType) => shopStore.getItemTypeIcon(itemType);
    const canPurchase = (item) => {
      const quantity = purchaseQuantities.value[item.id] || 1;
      const totalCost = item.price * quantity;
      const currencyResource = playerStore.getResourceByName(item.currency);
      if (!currencyResource) return false;
      return Number(currencyResource.amount) >= totalCost && (item.stock === -1 || item.stock >= quantity) && player.value.level >= item.level;
    };
    watch(isAuthenticated, async (newValue) => {
      if (newValue && authStore.user?.player) {
        await playerStore.initializePlayer(authStore.user.player.id);
        await shopStore.fetchShops();
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
            _push2(` 🏪 Cửa Hàng `);
          } else {
            return [
              createTextVNode(" 🏪 Cửa Hàng ")
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
      _push(`<button class="game-button px-6 py-2 rounded-lg text-white font-semibold"> 🚪 Đăng Xuất </button></div></div></div></header><main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="mb-8"><h2 class="text-2xl font-bold text-white mb-4">Danh Mục Cửa Hàng</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-4"><!--[-->`);
      ssrRenderList(shopCategories, (category) => {
        _push(`<button class="${ssrRenderClass([
          "p-4 rounded-lg border-2 transition-all duration-300",
          unref(selectedCategory) === category.name ? "border-purple-500 bg-purple-500/20" : "border-gray-600 bg-gray-800/50 hover:border-purple-400"
        ])}"><div class="text-center"><div class="text-3xl mb-2">${ssrInterpolate(category.icon)}</div><div class="text-sm font-semibold text-white">${ssrInterpolate(category.displayName)}</div><div class="text-xs text-game-text-secondary">${ssrInterpolate(category.description)}</div></div></button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-8"><div class="text-white">Đang tải cửa hàng...</div></div>`);
      } else if (unref(error)) {
        _push(`<div class="text-center py-8"><div class="text-red-400">Lỗi: ${ssrInterpolate(unref(error))}</div></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(filteredShops), (shop) => {
          _push(`<div class="game-card p-6 rounded-lg"><div class="flex items-center justify-between mb-4"><h3 class="text-xl font-bold text-white">${ssrInterpolate(shop.displayName)}</h3><span class="text-2xl">${ssrInterpolate(shop.icon)}</span></div><p class="text-game-text-secondary mb-4">${ssrInterpolate(shop.description)}</p><div class="mb-4"><div class="text-sm text-game-text-secondary mb-2">Số lượng item: ${ssrInterpolate(shop.items.length)}</div><div class="text-sm text-game-text-secondary">Loại: ${ssrInterpolate(getCategoryDisplayName(shop.category))}</div></div><button class="w-full game-button py-2 px-4 rounded-lg text-white font-semibold"> Vào Cửa Hàng </button></div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (unref(currentShop)) {
        _push(`<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div class="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"><div class="flex items-center justify-between p-6 border-b border-gray-700"><div class="flex items-center space-x-3"><span class="text-2xl">${ssrInterpolate(unref(currentShop).icon)}</span><h2 class="text-2xl font-bold text-white">${ssrInterpolate(unref(currentShop).displayName)}</h2></div><button class="text-gray-400 hover:text-white text-2xl"> ✕ </button></div><div class="p-6 overflow-y-auto max-h-[60vh]">`);
        if (unref(currentShop).items.length === 0) {
          _push(`<div class="text-center py-8"><div class="text-game-text-secondary">Cửa hàng này chưa có item nào</div></div>`);
        } else {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
          ssrRenderList(unref(currentShop).items, (item) => {
            _push(`<div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700"><div class="flex items-start justify-between mb-3"><div class="flex items-center space-x-3"><span class="text-2xl">${ssrInterpolate(getItemTypeIcon(item.itemType))}</span><div><h4 class="text-lg font-semibold text-white">${ssrInterpolate(item.displayName)}</h4><div class="flex items-center space-x-2"><span class="px-2 py-1 rounded text-xs font-semibold" style="${ssrRenderStyle({
              backgroundColor: getRarityColor(item.rarity) + "20",
              color: getRarityColor(item.rarity)
            })}">${ssrInterpolate(item.rarity.toUpperCase())}</span><span class="text-xs text-game-text-secondary">Cấp ${ssrInterpolate(item.level)}</span></div></div></div></div><p class="text-sm text-game-text-secondary mb-3">${ssrInterpolate(item.description)}</p><div class="flex items-center justify-between"><div class="flex items-center space-x-2"><span class="text-yellow-400 font-semibold">${ssrInterpolate(item.price.toLocaleString())}</span><span class="text-sm text-game-text-secondary">${ssrInterpolate(getCurrencyName(item.currency))}</span></div><div class="flex items-center space-x-2"><input${ssrRenderAttr("value", unref(purchaseQuantities)[item.id])} type="number" min="1"${ssrRenderAttr("max", item.stock === -1 ? 999 : item.stock)} class="w-16 px-2 py-1 bg-gray-700 text-white rounded text-sm"><button${ssrIncludeBooleanAttr(unref(loading) || !canPurchase(item)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white"> Mua </button></div></div>`);
            if (item.stock !== -1) {
              _push(`<div class="text-xs text-game-text-secondary mt-2"> Còn lại: ${ssrInterpolate(item.stock)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shop.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=shop-DGXaTHrO.js.map
