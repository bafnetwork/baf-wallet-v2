// Depreciated
const sveltePreprocess = require('svelte-preprocess');
const jsonPlug = require('@rollup/plugin-json');
module.exports = {
  compilerOptions: {
    dev: true,
  },
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess({
    postcss: {
      plugins: [
        require('tailwindcss')(__dirname + '/tailwind.config.js'),
        require('autoprefixer'),
      ],
    },
    typescript: {
      extensions: ['.svelte', '.ts'],
      plugins: [
        jsonPlug({
          compact: true,
        }),
      ],
    },
  }),
};
