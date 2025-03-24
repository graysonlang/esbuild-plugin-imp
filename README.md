# esbuild-plugin-imp

A plugin for [esbuild](https://github.com/evanw/esbuild) that adds support for file handling via import statements.

## Basic Usage

1. Install this plugin in your project:

  ```sh
  npm install --save-dev esbuild-plugin-imp
  ```

2. Add this plugin to your esbuild build script using ES Module import
    ```diff
    +import impPlugin from 'esbuild-plugin-imp';
    ```
    or CommonJS require syntax:
    ```diff
    +const impPlugin = require('esbuild-plugin-imp');
    ```
    ```diff
    esbuild.build({
      ...
      plugins: [
    +   impPlugin({ filter: }),
      ],
      ...
    })
    ```

3. In your source files, add an import statement for the file you want copied, optionally specifying the destination:

    ```js
    import './index.html'
    import './styles.css' with { dest: "./dist/styles" }
    ```

## Options

The plugin method takes an object with one field, `filter`.

#### `filter: RegExp`

A regular expression to filter the files to match ([documentation on filters](https://esbuild.github.io/plugins/#filters)).
