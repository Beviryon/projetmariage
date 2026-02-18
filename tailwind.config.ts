import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        elegant: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
      },
      colors: {
        champagne: {
          50: "#fdfbf7",
          100: "#f9f2e8",
          200: "#f2e4d0",
          300: "#e8d0b0",
          400: "#dbb88a",
          500: "#c9a06a",
        },
        primary: {
          50: "#eef2f7",
          100: "#dce5ef",
          200: "#b8cae0",
          300: "#5c7a9e",
          400: "#3d5a7a",
          500: "#1e3a5f",
          600: "#1a3355",
          700: "#162c4a",
        },
        rose: {
          50: "#fdf5f5",
          100: "#fce8e8",
          200: "#f8d4d4",
          300: "#f2b5b5",
          400: "#e88a8a",
          500: "#db6b6b",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
