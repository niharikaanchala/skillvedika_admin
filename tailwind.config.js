// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // all pages/components in app folder
    "./components/**/*.{js,ts,jsx,tsx}", // all components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};