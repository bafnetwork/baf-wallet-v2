const colors = require('tailwindcss/colors') // disable purge in dev

module.exports = {
  purge: {
    content: ['./src/**/*.svelte'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
