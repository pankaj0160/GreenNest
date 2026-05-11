/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // GreenNest brand colors
      colors: {
        brand: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",  // Primary green
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        earth: {
          50:  "#fdf8f0",
          100: "#faefd9",
          200: "#f4ddb0",
          300: "#ecc47e",
          400: "#e2a54a",
          500: "#d68e2a",  // Warm earth tone
          600: "#bc7320",
          700: "#9c591e",
          800: "#7e461f",
          900: "#673b1d",
        },
        leaf: {
          light: "#86efac",
          DEFAULT: "#22c55e",
          dark: "#15803d",
        },
      },
      fontFamily: {
        // Will be extended in later phases with Google Fonts
        sans: ["system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-hover": "0 10px 25px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
