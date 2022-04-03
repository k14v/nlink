# NLink

Command line interface tool to solve common problems for developing linked modules with transpiled code in [NodeJS](https://nodejs.org/es/).


> NOTE: This module is for development purposes if you new also publish the lib directory you must use in conjuntion with [semantic-release](https://github.com/semantic-release/npm#options) setting up the `pkgRoot` option pointing to the desired lib directory.

## Motivation

Nowdays is not rare to use a preprocesor transpiler such [babeljs](https://babeljs.io/), [coffeescript](https://coffeescript.org/) or [typescript](https://www.typescriptlang.org/). This module enables you to use the a transpiled lib instead of the root directory.

## Getting tarted

Nowdays it's commonly to use a different language for writing modules in NodeJS, such [typescript](https://es.wikipedia.org/wiki/TypeScript) or [coffeescript](https://es.wikipedia.org/wiki/CoffeeScript).

For such cases normally the developer creates a directory `src` containing all the sources that are not pretended to be the final code, so a proccess of transpilation generates a `lib` / `dist` folder to have a controlled way to identify where the final code will be generated, in order to ignore on the git repo or have a simple way to clean up.

Have in mind if a module wants to import a certain file of our library, due the nature of NodeJS, it only allows to exposing in package.json a [one single main file](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#main). This causes to have nested imports of 3 levels [when it should't](https://mui.com/guides/minimizing-bundle-size/#option-1), when the developer needs to [import a certain logic on a subfile](https://stackoverflow.com/questions/38935176/how-to-npm-publish-specific-folder-but-as-package-root).

```javascript
// ✅ OK
import ModuleSubFile from '@scope/packageName/subfile';
// ❌ NOT OK
import ModuleSubFile from '@scope/packageName/lib/subfile';
```

If the module is transpiled using [es-modules](https://tech-wiki.online/es/es-modules.html), this will be solved with [tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) but not all versions of nodejs or browser bundlers supports this. So in order to keep the legacy compatibility we must to handle this a easy and smart way without to much headhache.




The idea for linking is to create a copy of the package.json into the `lib` / `dist` folder, a simple way to identify which directory will allocate the transpiled code will be use `tsconfig.json`[.outpuDir](https://www.typescriptlang.org/tsconfig/outDir.html) to use the package.json meta information [directories.lib](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#directories).

## Linking 

For development purposes, [linking](https://docs.npmjs.com/cli/v8/commands/npm-link) is a tool which allows us to test a module locally without publishing. If we have the transpiled directory, NodeJS will not be able to discover the desired exposed files, so this tool will provide us a system to identify if the modules is exposed in our environment as linked module in order to replace the linked path to the real one.

## Contributing

This module requires [node@12](https://nodejs.org/download/release/v12.22.7/).

## References
- https://blog.izs.me/2013/02/why-no-directorieslib-in-node-the-less-snarky/
- https://docs.npmjs.com/cli/v8/using-npm/scripts
