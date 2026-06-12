/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        line: "#d9e2e7",
        mist: "#f5f8fa",
        teal: "#0f766e",
        coral: "#d95f43",
      },
    },
  },
  plugins: [],
};
