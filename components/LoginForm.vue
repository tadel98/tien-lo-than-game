<template>
  <div class="min-h-screen flex items-center justify-center bg-game-dark">
    <div class="game-card max-w-md w-full mx-4 p-8 rounded-lg">
      <h2 class="text-2xl font-bold text-center mb-6 text-white">
        {{ isLogin ? 'Đăng Nhập' : 'Đăng Ký' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-game-text-secondary mb-2">
            Tên đăng nhập
          </label>
          <input
            v-model="form.username"
            type="text"
            required
            class="w-full px-3 py-2 bg-game-light border border-white/20 rounded-lg text-white focus:outline-none focus:border-game-accent"
            placeholder="Nhập tên đăng nhập"
          />
        </div>

        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-game-text-secondary mb-2">
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 bg-game-light border border-white/20 rounded-lg text-white focus:outline-none focus:border-game-accent"
            placeholder="Nhập email"
          />
        </div>

        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-game-text-secondary mb-2">
            Tên nhân vật
          </label>
          <input
            v-model="form.playerName"
            type="text"
            required
            class="w-full px-3 py-2 bg-game-light border border-white/20 rounded-lg text-white focus:outline-none focus:border-game-accent"
            placeholder="Nhập tên nhân vật"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-game-text-secondary mb-2">
            Mật khẩu
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 bg-game-light border border-white/20 rounded-lg text-white focus:outline-none focus:border-game-accent"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full game-button py-2 rounded-lg text-white font-semibold disabled:opacity-50"
        >
          {{ loading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Đăng Ký') }}
        </button>
      </form>

      <div class="text-center mt-4">
        <button
          @click="toggleMode"
          class="text-game-accent hover:text-green-300 transition-colors"
        >
          {{ isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập' }}
        </button>
      </div>

      <div v-if="error" class="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const router = useRouter()

// Form state
const isLogin = ref(true)
const form = ref({
  username: '',
  email: '',
  password: '',
  playerName: ''
})

// Computed
const loading = computed(() => authStore.loading)
const error = computed(() => authStore.error)

// Methods
const toggleMode = () => {
  isLogin.value = !isLogin.value
  form.value = {
    username: '',
    email: '',
    password: '',
    playerName: ''
  }
  authStore.reset()
}

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await authStore.login(form.value.username, form.value.password)
    } else {
      await authStore.register(
        form.value.username,
        form.value.email,
        form.value.password,
        form.value.playerName
      )
    }

    // Initialize player data after successful auth
    if (authStore.user?.player) {
      await playerStore.initializePlayer(authStore.user.player.id)
    }

    // Redirect to game
    await router.push('/')
  } catch (err) {
    console.error('Auth error:', err)
  }
}

// Initialize auth on mount
onMounted(() => {
  authStore.initializeAuth()
  if (authStore.isLoggedIn) {
    router.push('/')
  }
})
</script>
