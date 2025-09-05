import { ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { u as useAuthStore } from "./auth-EzXceMbr.js";
import { u as usePlayerStore } from "./player-B72JDVVQ.js";
import { u as useRouter } from "../server.mjs";
const _sfc_main = {
  __name: "LoginForm",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    usePlayerStore();
    useRouter();
    const isLogin = ref(true);
    const form = ref({
      username: "",
      email: "",
      password: "",
      playerName: ""
    });
    const loading = computed(() => authStore.loading);
    const error = computed(() => authStore.error);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-game-dark" }, _attrs))}><div class="game-card max-w-md w-full mx-4 p-8 rounded-lg"><h2 class="text-2xl font-bold text-center mb-6 text-white">${ssrInterpolate(unref(isLogin) ? "Đăng Nhập" : "Đăng Ký")}</h2><form class="space-y-4"><div><label class="block text-sm font-medium text-game-text-secondary mb-2"> Tên đăng nhập </label><input${ssrRenderAttr("value", unref(form).username)} type="text" required class="w-full px-3 py-2 bg-game-light border border-white/20 rounded-lg text-white focus:outline-none focus:border-game-accent" placeholder="Nhập tên đăng nhập"></div>`);
      if (!unref(isLogin)) {
        _push(`<div><label class="block text-sm font-medium text-game-text-secondary mb-2"> Email </label><input${ssrRenderAttr("value", unref(form).email)} type="email" required class="w-full px-3 py-2 bg-game-light border border-white/20 rounded-lg text-white focus:outline-none focus:border-game-accent" placeholder="Nhập email"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isLogin)) {
        _push(`<div><label class="block text-sm font-medium text-game-text-secondary mb-2"> Tên nhân vật </label><input${ssrRenderAttr("value", unref(form).playerName)} type="text" required class="w-full px-3 py-2 bg-game-light border border-white/20 rounded-lg text-white focus:outline-none focus:border-game-accent" placeholder="Nhập tên nhân vật"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div><label class="block text-sm font-medium text-game-text-secondary mb-2"> Mật khẩu </label><input${ssrRenderAttr("value", unref(form).password)} type="password" required class="w-full px-3 py-2 bg-game-light border border-white/20 rounded-lg text-white focus:outline-none focus:border-game-accent" placeholder="Nhập mật khẩu"></div><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-full game-button py-2 rounded-lg text-white font-semibold disabled:opacity-50">${ssrInterpolate(unref(loading) ? "Đang xử lý..." : unref(isLogin) ? "Đăng Nhập" : "Đăng Ký")}</button></form><div class="text-center mt-4"><button class="text-game-accent hover:text-green-300 transition-colors">${ssrInterpolate(unref(isLogin) ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập")}</button></div>`);
      if (unref(error)) {
        _push(`<div class="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"><p class="text-red-400 text-sm">${ssrInterpolate(unref(error))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LoginForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=LoginForm-B1tZwOQp.js.map
