# Introduction

ESLint config to be used in some of our projects, that includes recommended rules of the following plugins:

- eslint-config-airbnb / eslint-config-airbnb-base / eslint-config-airbnb-typescript
- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-plugin-jsx-a11y
- eslint-config-prettier
- eslint-import-resolver-typescript
- eslint-plugin-import
- eslint-plugin-jest
- eslint-plugin-promise
- eslint-plugin-unicorn

With some slight modifications to some of the defaults on our side.

# Usage

1. Setup eslint as you would normally do.

2. `yarn add -D @ailo/eslint-config eslint @typescript-eslint/parser`

3. Extend the config as in the following example:

   Node.js service:

   ```js
   // .eslintrc.js
   module.exports = {
     parser: "@typescript-eslint/parser",
     parserOptions: {
       project: ["./tsconfig.json"],
     },
     extends: [require.resolve("@ailo/eslint-config/configs/ts-node")],
   };
   ```

   Node.js service without TS:

   ```js
   // .eslintrc.js
   module.exports = {
     parser: "babel-eslint",
     extends: [require.resolve("@ailo/eslint-config/configs/node")],
   };
   ```

   Front-end React app:

   ```js
   // .eslintrc.js
   module.exports = {
     parser: "@typescript-eslint/parser",
     parserOptions: {
       project: ["./tsconfig.json"],
     },
     extends: [require.resolve("@ailo/eslint-config/configs/ts-react")],
   };
   ```

   Cypress:

   ```js
   // .eslintrc.js
   module.exports = {
     parser: "@typescript-eslint/parser",
     parserOptions: {
       project: ["./tsconfig.json"],
     },
     extends: [require.resolve("@ailo/eslint-config/configs/ts-cypress")],
   };
   ```

   Replace `ts-node` with other name of another [config file](https://github.com/ailohq/ailo-eslint-config/tree/master/configs) if your environment differs.

## Adding it to existing codebase

If your codebase is large and introducing this config makes eslint yell with hundreds of errors, you might find following advices to be useful:

- keep a list of ignored "legacy" files by adding `overrides` to your `.eslintrc.js` that ignores some rules in some of your files (until they get improved). You can generate this automatically using [transform-eslint-errors-into-overrides](./bin/transform-eslint-errors-into-overrides.js) script.
- use https://github.com/IanVS/eslint-nibble

# Releasing

```sh
yarn release
```
