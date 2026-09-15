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
          50: "rgb(var(--navy-50) / <alpha-value>)",
          100: "rgb(var(--navy-100) / <alpha-value>)",
          400: "rgb(var(--navy-400) / <alpha-value>)",
          500: "rgb(var(--navy-500) / <alpha-value>)",
          600: "rgb(var(--navy-600) / <alpha-value>)",
          700: "rgb(var(--navy-700) / <alpha-value>)",
          800: "rgb(var(--navy-800) / <alpha-value>)",
          900: "rgb(var(--navy-900) / <alpha-value>)",
          950: "rgb(var(--navy-950) / <alpha-value>)",
        },
        command: {
          cyan: "rgb(var(--accent-cyan) / <alpha-value>)",
          blue: "rgb(var(--accent-blue) / <alpha-value>)",
          violet: "rgb(var(--accent-violet) / <alpha-value>)",
        },
        risk: {
          critical: "#FB4B5D",
          high: "#F5A623",
          medium: "#F5D547",
          low: "#33D69F",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(86,14,162,0.2), 0 0 24px -4px rgba(201,125,199,0.35)",
      },
      backgroundImage: {
        "grid-fade": "radial-gradient(circle at 50% 0%, rgba(86,14,162,0.12), transparent 60%)",
        luxury: "linear-gradient(135deg, #560EA2 0%, #C97DC7 55%, #F595A6 100%)",
      },
    },
  },
  plugins: [],
};