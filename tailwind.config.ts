export default {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: { 100: "#E05265", DEFAULT: "#FA7275" },
        green: "#3DD9B3",
        /* …other colors */
      },
    },
  },
};
