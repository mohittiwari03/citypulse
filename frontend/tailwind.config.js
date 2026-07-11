/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        bg:           "#030712",
        surface:      "rgba(15, 23, 42, 0.45)",
        "surface-dark": "rgba(15, 23, 42, 0.6)",
        border:       "rgba(255, 255, 255, 0.08)",
        accent:       "#3b82f6",
        "accent-soft": "rgba(59, 130, 246, 0.10)",
        muted:        "#94a3b8",
        ink:          "#f8fafc",
        "ink-light":  "#FFFFFF",
        "danger":     "#EF4444",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card:     "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
        "card-lg": "0 4px 24px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.10)",
        float:    "0 12px 40px rgba(0,0,0,0.12)",
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
