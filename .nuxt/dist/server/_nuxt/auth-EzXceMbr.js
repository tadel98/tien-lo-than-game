import { d as defineStore } from "../server.mjs";
import { ref, computed } from "vue";
const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref(null);
  const isLoggedIn = computed(() => isAuthenticated.value && !!token.value);
  const login = async (username, password) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: {
          username,
          password
        }
      });
      if (response.success) {
        user.value = response.user;
        token.value = response.token;
        isAuthenticated.value = true;
        if (false) ;
        return response;
      }
    } catch (err) {
      error.value = err.message;
      console.error("Login error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const register = async (username, email, password, playerName) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await $fetch("/api/auth/register", {
        method: "POST",
        body: {
          username,
          email,
          password,
          playerName
        }
      });
      if (response.success) {
        user.value = response.user;
        token.value = response.token;
        isAuthenticated.value = true;
        if (false) ;
        return response;
      }
    } catch (err) {
      error.value = err.message;
      console.error("Register error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    error.value = null;
  };
  const checkAuth = () => {
  };
  const initializeAuth = () => {
  };
  const reset = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    loading.value = false;
    error.value = null;
  };
  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,
    // Getters
    isLoggedIn,
    // Actions
    login,
    register,
    logout,
    checkAuth,
    initializeAuth,
    reset
  };
});
export {
  useAuthStore as u
};
//# sourceMappingURL=auth-EzXceMbr.js.map
