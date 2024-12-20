/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1A48C6",
        secondary: "#111520",
        background: "#0d111c",
      },
    },
  },
  plugins: [require("daisyui")],
};
