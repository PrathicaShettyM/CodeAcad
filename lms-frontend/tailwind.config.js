/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
export default {
  content: [
    "./index.html",
    "./src/**/*.{is,ts,jsx,tsx}"
],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};

