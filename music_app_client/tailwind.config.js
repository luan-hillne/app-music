/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", './public/index.html'],
  theme: {
    extend: {
      animation: {
        'popupShow': 'popupShow .6s linear'
      },
      keyframes: {
        popupShow: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0%)' }
        }
      }
    },
  },
  plugins: [],
}
