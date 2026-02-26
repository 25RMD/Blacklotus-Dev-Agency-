/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Area Normal", "Inter", "system-ui", "sans-serif"],
        serif: ["Bodoni Moda", "serif"],
        display: ["Poppins", "sans-serif"],
        impact: ["Bodoni Moda", "serif"],
        mono: ["JetBrains Mono", "monospace"],
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
