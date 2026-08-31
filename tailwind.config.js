/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      colors: {
        navy: {
          50: "#EEF2F8",
          100: "#D8E0EE",
          400: "#4C5A78",
          500: "#33405C",
          600: "#212C44",
          700: "#161F35",
          800: "#0B1220",
          900: "#070B14",
          950: "#05070C",
        },
        command: {
          cyan: "#22D3EE",
          blue: "#5B8CFF",
          violet: "#8B7CF6",
        },
        risk: {
          critical: "#FB4B5D",
          high: "#F5A623",
          medium: "#F5D547",
          low: "#33D69F",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.15), 0 0 24px -4px rgba(34,211,238,0.25)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 50% 0%, rgba(91,140,255,0.10), transparent 60%)",
      },
    },
  },
  plugins: [],
};