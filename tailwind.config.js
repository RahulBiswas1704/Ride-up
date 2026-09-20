/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        surface: "#1E1E1E",
        primary: "#FF5E00", // Neon Orange
        secondary: "#E0FF00", // Electric Yellow
        textPrimary: "#FFFFFF",
        textSecondary: "#A0A0A0",
        danger: "#FF3B30",
      },
    },
  },
  plugins: [],
}
