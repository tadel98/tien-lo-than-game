/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      colors: {
        'game-dark': '#1a1a1a',
        'game-gray': '#2d2d2d',
        'game-light': '#3a3a3a',
        'game-accent': '#4ade80',
        'game-text': '#ffffff',
        'game-text-secondary': '#a1a1aa'
      },
      fontFamily: {
        'game': ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
