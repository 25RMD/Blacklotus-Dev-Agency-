/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Switzer", "Inter", "system-ui", "sans-serif"],
        serif: ["Switzer", "Inter", "system-ui", "sans-serif"],
        display: ["Switzer", "Inter", "system-ui", "sans-serif"],
        impact: ["Switzer", "Inter", "system-ui", "sans-serif"],
        mono: ["Switzer", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        "off-black": "#111111",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
}
