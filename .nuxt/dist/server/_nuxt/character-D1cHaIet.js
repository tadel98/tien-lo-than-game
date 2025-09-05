import { _ as _sfc_main$2 } from "./LoginForm-B1tZwOQp.js";
import { _ as __nuxt_component_0 } from "./nuxt-link-CnYqct-M.js";
import { computed, mergeProps, unref, useSSRContext, watch, withCtx, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderComponent, ssrRenderClass } from "vue/server-renderer";
import { u as useCharacterStore } from "./character-BBuP_n1i.js";
import { u as useAuthStore } from "./auth-EzXceMbr.js";
import { u as usePlayerStore } from "./player-B72JDVVQ.js";
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
  __name: "CharacterPanel",
  __ssrInlineRender: true,
  props: {
    playerId: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const characterStore = useCharacterStore();
    const characterData = computed(() => characterStore.characterData);
    computed(() => characterStore.stats);
    computed(() => characterStore.equipment);
    computed(() => characterStore.skills);
    computed(() => characterStore.loading);
    const error = computed(() => characterStore.error);
    const combatPower = computed(() => characterStore.combatPower);
    const totalStats = computed(() => characterStore.totalStats);
    const baseStats = computed(() => characterStore.baseStats);
    const equippedItems = computed(() => characterStore.equippedItems);
    const learnedSkills = computed(() => characterStore.learnedSkills);
    const equipmentSlots = [
      { name: "weapon", displayName: "Vũ Khí", icon: "⚔️" },
      { name: "armor", displayName: "Giáp", icon: "🛡️" },
      { name: "helmet", displayName: "Mũ", icon: "⛑️" },
      { name: "accessory", displayName: "Trang Sức", icon: "💍" }
    ];
    const getStatDisplayName = (stat) => {
      const names = {
        hp: "Máu",
        mp: "Pháp Lực",
        attack: "Tấn Công",
        defense: "Phòng Thủ",
        speed: "Tốc Độ",
        luck: "May Mắn",
        wisdom: "Trí Tuệ",
        strength: "Sức Mạnh",
        agility: "Nhanh Nhẹn",
        vitality: "Sinh Lực",
        spirit: "Tinh Thần"
      };
      return names[stat] || stat;
    };
    const getEquippedItem = (slot) => {
      return equippedItems.value.find((item) => item.equipment.type.slot === slot);
    };
    const getStatColor = (stat) => characterStore.getStatColor(stat);
    const getRarityColor = (rarity) => characterStore.getRarityColor(rarity);
    const getSkillCategoryColor = (category) => characterStore.getSkillCategoryColor(category);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "character-panel game-card p-6 rounded-lg" }, _attrs))}><h2 class="text-2xl font-bold text-center mb-6 text-white"> 👤 Thông Tin Nhân Vật </h2><div class="text-center mb-6"><div class="text-sm text-game-text-secondary mb-1">Sức Mạnh Chiến Đấu</div><div class="text-3xl font-bold text-yellow-400">${ssrInterpolate(unref(combatPower).toLocaleString())}</div></div><div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"><!--[-->`);
      ssrRenderList(unref(totalStats), (value, stat) => {
        _push(`<div class="bg-game-light/50 p-3 rounded-lg"><div class="flex items-center justify-between"><span class="text-sm text-game-text-secondary capitalize">${ssrInterpolate(getStatDisplayName(stat))}</span><span class="text-lg font-semibold" style="${ssrRenderStyle({ color: getStatColor(stat) })}">${ssrInterpolate(value)}</span></div>`);
        if (unref(baseStats)[stat] !== value) {
          _push(`<div class="text-xs text-game-text-secondary mt-1"> Base: ${ssrInterpolate(unref(baseStats)[stat])} +${ssrInterpolate(value - unref(baseStats)[stat])}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="mb-6"><h3 class="text-lg font-semibold text-white mb-4">Trang Bị</h3><div class="grid grid-cols-2 md:grid-cols-4 gap-3"><!--[-->`);
      ssrRenderList(equipmentSlots, (slot) => {
        _push(`<div class="bg-game-light/30 p-3 rounded-lg text-center"><div class="text-2xl mb-2">${ssrInterpolate(slot.icon)}</div><div class="text-xs text-game-text-secondary mb-1">${ssrInterpolate(slot.displayName)}</div>`);
        if (getEquippedItem(slot.slot)) {
          _push(`<div class="text-sm font-semibold" style="${ssrRenderStyle({ color: getRarityColor(getEquippedItem(slot.slot).equipment.rarity) })}">${ssrInterpolate(getEquippedItem(slot.slot).equipment.displayName)}</div>`);
        } else {
          _push(`<div class="text-xs text-game-text-secondary">Trống</div>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><div class="mb-6"><h3 class="text-lg font-semibold text-white mb-4">Kỹ Năng</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-3"><!--[-->`);
      ssrRenderList(unref(learnedSkills), (skill) => {
        _push(`<div class="bg-game-light/30 p-3 rounded-lg"><div class="flex items-center justify-between mb-2"><span class="font-semibold text-white">${ssrInterpolate(skill.skill.displayName)}</span><span class="text-xs px-2 py-1 rounded" style="${ssrRenderStyle({
          backgroundColor: getSkillCategoryColor(skill.skill.category) + "20",
          color: getSkillCategoryColor(skill.skill.category)
        })}">${ssrInterpolate(skill.skill.category)}</span></div><div class="text-sm text-game-text-secondary mb-2">${ssrInterpolate(skill.skill.description)}</div><div class="flex items-center justify-between text-xs"><span>Cấp ${ssrInterpolate(skill.level)}/${ssrInterpolate(skill.skill.maxLevel)}</span>`);
        if (skill.skill.cooldown > 0) {
          _push(`<span> CD: ${ssrInterpolate(skill.skill.cooldown)}s </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div><div class="bg-game-light/30 p-4 rounded-lg"><h3 class="text-lg font-semibold text-white mb-3">Thông Tin Cơ Bản</h3><div class="grid grid-cols-2 gap-4 text-sm"><div class="flex justify-between"><span class="text-game-text-secondary">Tên:</span><span class="text-white">${ssrInterpolate(unref(characterData)?.name)}</span></div><div class="flex justify-between"><span class="text-game-text-secondary">Cấp:</span><span class="text-white">${ssrInterpolate(unref(characterData)?.level)}</span></div><div class="flex justify-between"><span class="text-game-text-secondary">Cảnh giới:</span><span class="text-white">${ssrInterpolate(unref(characterData)?.realm)}</span></div><div class="flex justify-between"><span class="text-game-text-secondary">Kinh nghiệm:</span><span class="text-white">${ssrInterpolate(Number(unref(characterData)?.experience || 0).toLocaleString())}</span></div></div></div>`);
      if (unref(error)) {
        _push(`<div class="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"><p class="text-red-400 text-sm">${ssrInterpolate(unref(error))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CharacterPanel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "character",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const playerStore = usePlayerStore();
    const characterStore = useCharacterStore();
    const isAuthenticated = computed(() => authStore.isLoggedIn);
    const player = computed(() => playerStore.player);
    computed(() => playerStore.resources);
    const getResourceAmount = (resourceName) => {
      const resource = playerStore.getResourceByName(resourceName);
      return resource ? Number(resource.amount).toLocaleString() : "0";
    };
    const menuItems = [
      { name: "Nhân vật", icon: "👤", active: true },
      { name: "Thiên Phú", icon: "⭐", active: false, route: "/talent" },
      { name: "Cửa Hàng", icon: "🏠", active: false, route: "/shop" },
      { name: "Túi", icon: "🎒", active: false, route: "/inventory" },
      { name: "Tu Luyện", icon: "🧘", active: false, route: "/cultivation" },
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
        await characterStore.fetchCharacterData(authStore.user.player.id);
      } else {
        characterStore.reset();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoginForm = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CharacterPanel = _sfc_main$1;
      if (!unref(isAuthenticated)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_LoginForm, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen text-white" }, _attrs))}><header class="bg-game-gray/80 backdrop-blur-sm border-b border-white/10"><div class="container mx-auto px-4 py-3"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center"><span class="text-lg font-bold">${ssrInterpolate(unref(player)?.name?.charAt(0) || "V")}</span></div><div><h2 class="text-lg font-semibold">${ssrInterpolate(unref(player)?.name || "Viễn Cổ Đại Năng")}</h2><p class="text-sm text-game-text-secondary">Cấp ${ssrInterpolate(unref(player)?.level || 138)} | Chuyển: ${ssrInterpolate(unref(player)?.realm || "Phàm cảnh")}</p></div></div><div class="flex items-center space-x-6"><div class="text-center"><p class="text-sm text-game-text-secondary">Tiên Ngọc</p><p class="text-lg font-semibold text-yellow-400">${ssrInterpolate(getResourceAmount("tien_ngoc"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Linh Thạch</p><p class="text-lg font-semibold text-blue-400">${ssrInterpolate(getResourceAmount("linh_thach"))}</p></div><div class="text-center"><p class="text-sm text-game-text-secondary">Nguyên Thạch</p><p class="text-lg font-semibold text-green-400">${ssrInterpolate(getResourceAmount("nguyen_thach"))}</p></div></div><div class="flex items-center space-x-2">`);
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
        _push(`<button class="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"> Đăng xuất </button></div></div></div></header><nav class="bg-game-gray/60 backdrop-blur-sm border-b border-white/10"><div class="container mx-auto px-4 py-2"><div class="flex space-x-1 mb-4"><button class="px-4 py-2 bg-game-light rounded-lg text-white font-medium"> Nhân vật </button>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/cultivation",
          class: "px-4 py-2 text-game-text-secondary hover:text-white transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Tu Luyện `);
            } else {
              return [
                createTextVNode(" Tu Luyện ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="grid grid-cols-7 gap-4"><!--[-->`);
        ssrRenderList(menuItems, (menuItem) => {
          _push(`<div class="${ssrRenderClass([{ "bg-game-accent/20 border border-game-accent": menuItem.active }, "flex flex-col items-center p-3 rounded-lg hover:bg-game-light/50 transition-colors cursor-pointer"])}"><div class="w-12 h-12 rounded-full bg-game-light flex items-center justify-center mb-2"><span class="text-2xl">${ssrInterpolate(menuItem.icon)}</span></div><span class="text-xs text-center">${ssrInterpolate(menuItem.name)}</span></div>`);
        });
        _push(`<!--]--></div></div></nav><main class="container mx-auto px-4 py-8"><div class="text-center mb-8"><h1 class="text-4xl font-bold mb-4">👤 Thông Tin Nhân Vật</h1><p class="text-game-text-secondary">Quản lý thuộc tính, trang bị và kỹ năng của bạn</p></div><div class="max-w-6xl mx-auto">`);
        _push(ssrRenderComponent(_component_CharacterPanel, {
          "player-id": unref(player)?.id
        }, null, _parent));
        _push(`</div></main></div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/character.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=character-D1cHaIet.js.map
