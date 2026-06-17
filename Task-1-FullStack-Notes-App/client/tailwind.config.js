/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 20px 70px -30px rgba(37, 99, 235, 0.55)",
        soft: "0 18px 45px -28px rgba(15, 23, 42, 0.45)",
      },
    },
  },
  plugins: [],
};
