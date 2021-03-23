// const dependencies = require('../../package.json').dependencies;
// const nodePolyfills = require('rollup-plugin-node-polyfills');
// const commonjs = require('@rollup/plugin-commonjs');

// module.exports = (rollupConfig, opts) => {
//   console.log(rollupConfig.external);
//   const plugins = [
//     commonjs(),
//     nodePolyfills(),
//     json({ compact: true }),
//     ...rollupConfig.plugins,
//   ];
//   return {
//     ...rollupConfig,
//     // external: [],//Object.keys(dependencies),
//     onwarn: (warning) => {
//       // Skip certain warnings

//       // should intercept ... but doesn't in some rollup versions
//       if (warning.code === 'THIS_IS_UNDEFINED') {
//         return;
//       }

//       // console.warn everything else
//       console.warn(warning.message);
//     },
//     plugins,
//   };
// };
const svelte = require('rollup-plugin-svelte');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const livereload = require('rollup-plugin-livereload');
const { terser } = require('rollup-plugin-terser');
const css = require('rollup-plugin-css-only');
const json = require('@rollup/plugin-json');
const autoPreprocess = require('svelte-preprocess');
const typescript = require('@rollup/plugin-typescript');
const nodePolyfills = require('rollup-plugin-node-polyfills');
const jsonPlug = require('@rollup/plugin-json');

module.exports = (r, o) => {
  const production = !process.env.ROLLUP_WATCH;

  function serve() {
    let server;

    function toExit() {
      if (server) server.kill(0);
    }

    return {
      writeBundle() {
        if (server) return;
        server = require('child_process').spawn(
          'npm',
          ['run', 'start', '--', '--dev'],
          {
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: true,
          }
        );

        process.on('SIGTERM', toExit);
        process.on('exit', toExit);
      },
    };
  }

  return {
    input: 'apps/frontend/src/main.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'dist/apps/frontend/bundle.js',
    },
    plugins: [
      svelte({
        preprocess: autoPreprocess({
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
      }),
      resolve.nodeResolve({
        browser: true,
        dedupe: ['svelte'],
        preferBuiltins: false,
      }),
      typescript({
        sourceMap: !production,
        tsconfig: 'apps/frontend/tsconfig.app.json',
        rootDir: 'apps/frontend/',
      }),
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css({ output: 'bundle.css' }),
      json({ compact: true }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      commonjs(),
      nodePolyfills(),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      !production && serve(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      !production && livereload('public'),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  };
};