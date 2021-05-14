#!/bin/bash

cd libs
for dir in $(ls -d */)
do
  cd $dir
  # Only bump the version if their is a change in the git
  if [[ -f 'package.json' && $(git diff --quiet HEAD $REF -- . || echo 'changed') == 'changed' ]]; then
    echo "Bumping $dir"
    npm version patch
  fi
  cd ..
done

cd core-publishable
echo "Bumping core publishable"
npm version patch

cd ../../

npx nx build core-publishable --with-deps

cd dist/libs
for dir in $(ls -d */)
do
  cd $dir
  npm publish --access=public
  cd ..
done
