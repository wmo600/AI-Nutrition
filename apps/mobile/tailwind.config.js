/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#16a34a", // green
          light: "#22c55e",
          dark: "#15803d",
          soft: "#dcfce7",
        },
      },
    },
  },
  plugins: [],
};
