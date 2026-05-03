import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        "landing-fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "landing-progress": {
          "0%, 100%": { width: "48%" },
          "50%": { width: "88%" },
        },
        "landing-partial": {
          "0%, 100%": { opacity: "0.32" },
          "50%": { opacity: "0.95" },
        },
        "landing-soft-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "landing-fade-up": "landing-fade-up 0.7s ease-out both",
        "landing-progress": "landing-progress 5s ease-in-out infinite",
        "landing-partial": "landing-partial 2.5s ease-in-out infinite",
        "landing-soft-float": "landing-soft-float 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
