const package = require('../package.json');
const fs = require('fs');

fs.writeFileSync(
  'dist/apps/bot/package.json',
  JSON.stringify({
    main: 'main.js',
    scripts: { start: 'node main.js' },
    dependencies: package.dependencies,
  })
);
