/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      fontFamily: {
        sans: ["'Syne'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        bg:         "#080c10",
        surface:    "#0f1720",
        border:     "#1e2d3d",
        gold:       "#e8b84b",
        "gold-dim": "#a07a28",
        teal:       "#2dd4bf",
        muted:      "#4a6075",
        ink:        "#c8d8e8",
      },
      animation: {
        "fade-up":    "fadeUp 0.4s ease both",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

