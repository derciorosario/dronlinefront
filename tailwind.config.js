/** @type {import('tailwindcss').Config} */
const colors = require('./src/assets/colors.json');
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
     colors: {
        fire_engine_red:colors.fire_engine_red,
        egyptian_blue:colors.egyptian_blue,
        gunmetal:colors.gunmetal,
        verdigris:colors.verdigris,
        light_red:colors.light_red,
        honolulu_blue:colors.honolulu_blue,
        delft_blue:colors.delft_blue,
        common:colors.common
      }
    },
  },
  plugins: [],
}

