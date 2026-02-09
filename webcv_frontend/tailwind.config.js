/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: ["prettier-plugin-tailwindcss"],
  
  theme: {
    extend: {
      fontFamily: {
        bevietnam: ['"Be Vietnam Pro"', 'sans-serif'],
      },
    },
  },
};
