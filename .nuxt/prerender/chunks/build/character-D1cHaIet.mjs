import { _ as _sfc_main$2 } from './LoginForm-B1tZwOQp.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CnYqct-M.mjs';
import { computed, watch, unref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/vue/server-renderer/index.mjs';
import { u as useCharacterStore } from './character-BBuP_n1i.mjs';
import { u as useAuthStore } from './auth-EzXceMbr.mjs';
import { u as usePlayerStore } from './player-B72JDVVQ.mjs';
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
      { name: "weapon", displayName: "V\u0169 Kh\xED", icon: "\u2694\uFE0F" },
      { name: "armor", displayName: "Gi\xE1p", icon: "\u{1F6E1}\uFE0F" },
      { name: "helmet", displayName: "M\u0169", icon: "\u26D1\uFE0F" },
      { name: "accessory", displayName: "Trang S\u1EE9c", icon: "\u{1F48D}" }
    ];
    const getStatDisplayName = (stat) => {
      const names = {
        hp: "M\xE1u",
        mp: "Ph\xE1p L\u1EF1c",
        attack: "T\u1EA5n C\xF4ng",
        defense: "Ph\xF2ng Th\u1EE7",
        speed: "T\u1ED1c \u0110\u1ED9",
        luck: "May M\u1EAFn",
        wisdom: "Tr\xED Tu\u1EC7",
        strength: "S\u1EE9c M\u1EA1nh",
        agility: "Nhanh Nh\u1EB9n",
        vitality: "Sinh L\u1EF1c",
        spirit: "Tinh Th\u1EA7n"
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
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "character-panel game-card p-6 rounded-lg" }, _attrs))}><h2 class="text-2xl font-bold text-center mb-6 text-white"> \u{1F464} Th\xF4ng Tin Nh\xE2n V\u1EADt </h2><div class="text-center mb-6"><div class="text-sm text-game-text-secondary mb-1">S\u1EE9c M\u1EA1nh Chi\u1EBFn \u0110\u1EA5u</div><div class="text-3xl font-bold text-yellow-400">${ssrInterpolate(unref(combatPower).toLocaleString())}</div></div><div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"><!--[-->`);
      ssrRenderList(unref(totalStats), (value, stat) => {
        _push(`<div class="bg-game-light/50 p-3 rounded-lg"><div class="flex items-center justify-between"><span class="text-sm text-game-text-secondary capitalize">${ssrInterpolate(getStatDisplayName(stat))}</span><span class="text-lg font-semibold" style="${ssrRenderStyle({ color: getStatColor(stat) })}">${ssrInterpolate(value)}</span></div>`);
        if (unref(baseStats)[stat] !== value) {
          _push(`<div class="text-xs text-game-text-secondary mt-1"> Base: ${ssrInterpolate(unref(baseStats)[stat])} +${ssrInterpolate(value - unref(baseStats)[stat])}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="mb-6"><h3 class="text-lg font-semibold text-white mb-4">Trang B\u1ECB</h3><div class="grid grid-cols-2 md:grid-cols-4 gap-3"><!--[-->`);
      ssrRenderList(equipmentSlots, (slot) => {
        _push(`<div class="bg-game-light/30 p-3 rounded-lg text-center"><div class="text-2xl mb-2">${ssrInterpolate(slot.icon)}</div><div class="text-xs text-game-text-secondary mb-1">${ssrInterpolate(slot.displayName)}</div>`);
        if (getEquippedItem(slot.slot)) {
          _push(`<div class="text-sm font-semibold" style="${ssrRenderStyle({ color: getRarityColor(getEquippedItem(slot.slot).equipment.rarity) })}">${ssrInterpolate(getEquippedItem(slot.slot).equipment.displayName)}</div>`);
        } else {
          _push(`<div class="text-xs text-game-text-secondary">Tr\u1ED1ng</div>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><div class="mb-6"><h3 class="text-lg font-semibold text-white mb-4">K\u1EF9 N\u0103ng</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-3"><!--[-->`);
      ssrRenderList(unref(learnedSkills), (skill) => {
        _push(`<div class="bg-game-light/30 p-3 rounded-lg"><div class="flex items-center justify-between mb-2"><span class="font-semibold text-white">${ssrInterpolate(skill.skill.displayName)}</span><span class="text-xs px-2 py-1 rounded" style="${ssrRenderStyle({
          backgroundColor: getSkillCategoryColor(skill.skill.category) + "20",
          color: getSkillCategoryColor(skill.skill.category)
        })}">${ssrInterpolate(skill.skill.category)}</span></div><div class="text-sm text-game-text-secondary mb-2">${ssrInterpolate(skill.skill.description)}</div><div class="flex items-center justify-between text-xs"><span>C\u1EA5p ${ssrInterpolate(skill.level)}/${ssrInterpolate(skill.skill.maxLevel)}</span>`);
        if (skill.skill.cooldown > 0) {
          _push(`<span> CD: ${ssrInterpolate(skill.skill.cooldown)}s </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div><div class="bg-game-light/30 p-4 rounded-lg"><h3 class="text-lg font-semibold text-white mb-3">Th\xF4ng Tin C\u01A1 B\u1EA3n</h3><div class="grid grid-cols-2 gap-4 text-sm"><div class="flex justify-between"><span class="text-game-text-secondary">T\xEAn:</span><span class="text-white">${ssrInterpolate((_a = unref(characterData)) == null ? void 0 : _a.name)}</span></div><div class="flex justify-between"><span class="text-game-text-secondary">C\u1EA5p:</span><span class="text-white">${ssrInterpolate((_b = unref(characterData)) == null ? void 0 : _b.level)}</span></div><div class="flex justify-between"><span class="text-game-text-secondary">C\u1EA3nh gi\u1EDBi:</span><span class="text-white">${ssrInterpolate((_c = unref(characterData)) == null ? void 0 : _c.realm)}</span></div><div class="flex justify-between"><span class="text-game-text-secondary">Kinh nghi\u1EC7m:</span><span class="text-white">${ssrInterpolate(Number(((_d = unref(characterData)) == null ? void 0 : _d.experience) || 0).toLocaleString())}</span></div></div></div>`);
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
      { name: "Nh\xE2n v\u1EADt", icon: "\u{1F464}", active: true },
      { name: "Thi\xEAn Ph\xFA", icon: "\u2B50", active: false, route: "/talent" },
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
        await characterStore.fetchCharacterData(authStore.user.player.id);
      } else {
        characterStore.reset();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      const _component_LoginForm = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CharacterPanel = _sfc_main$1;
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
        _push(`<button class="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"> \u0110\u0103ng xu\u1EA5t </button></div></div></div></header><nav class="bg-game-gray/60 backdrop-blur-sm border-b border-white/10"><div class="container mx-auto px-4 py-2"><div class="flex space-x-1 mb-4"><button class="px-4 py-2 bg-game-light rounded-lg text-white font-medium"> Nh\xE2n v\u1EADt </button>`);
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
        _push(`</div><div class="grid grid-cols-7 gap-4"><!--[-->`);
        ssrRenderList(menuItems, (menuItem) => {
          _push(`<div class="${ssrRenderClass([{ "bg-game-accent/20 border border-game-accent": menuItem.active }, "flex flex-col items-center p-3 rounded-lg hover:bg-game-light/50 transition-colors cursor-pointer"])}"><div class="w-12 h-12 rounded-full bg-game-light flex items-center justify-center mb-2"><span class="text-2xl">${ssrInterpolate(menuItem.icon)}</span></div><span class="text-xs text-center">${ssrInterpolate(menuItem.name)}</span></div>`);
        });
        _push(`<!--]--></div></div></nav><main class="container mx-auto px-4 py-8"><div class="text-center mb-8"><h1 class="text-4xl font-bold mb-4">\u{1F464} Th\xF4ng Tin Nh\xE2n V\u1EADt</h1><p class="text-game-text-secondary">Qu\u1EA3n l\xFD thu\u1ED9c t\xEDnh, trang b\u1ECB v\xE0 k\u1EF9 n\u0103ng c\u1EE7a b\u1EA1n</p></div><div class="max-w-6xl mx-auto">`);
        _push(ssrRenderComponent(_component_CharacterPanel, {
          "player-id": (_f = unref(player)) == null ? void 0 : _f.id
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

export { _sfc_main as default };
//# sourceMappingURL=character-D1cHaIet.mjs.map
