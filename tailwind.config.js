/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',        // <- App Router
    './components/**/*.{js,ts,jsx,tsx}', // <- Komponenty
    './lib/**/*.{js,ts,jsx,tsx}',        // <- np. utils, client Prisma
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}