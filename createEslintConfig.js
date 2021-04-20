module.exports = function createEslintConfig({
  typescript = false,
  node = false,
  react = false,
  jest = false,
  cypress = false,
} = {}) {
  return {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: ["./tsconfig.json"],
    },

    env: {
      browser: react || cypress,
      es6: cypress,
      node,
      jest,
    },

    extends: [
      typescript
        ? react
          ? "airbnb-typescript"
          : "airbnb-typescript/base"
        : react
        ? "airbnb"
        : "airbnb-base",
      react && "airbnb/hooks",
      "plugin:import/errors",
      "plugin:import/warnings",
      typescript && "plugin:import/typescript",
      typescript && "plugin:@typescript-eslint/eslint-recommended",
      typescript && "plugin:@typescript-eslint/recommended",
      typescript &&
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      jest && "plugin:jest/recommended",
      cypress && "plugin:cypress/recommended",
      "plugin:promise/recommended",
      "plugin:unicorn/recommended",
      "plugin:prettier/recommended",
      react && "prettier/react",
      typescript && "prettier/@typescript-eslint",
    ].filter(Boolean),

    plugins: [
      typescript && "@typescript-eslint/eslint-plugin",
      react && "react-hooks",
      jest && "jest",
      cypress && "cypress",
      "promise",
      "unicorn",
    ].filter(Boolean),

    settings: {
      ...(react
        ? {
            react: {
              version: "detect",
            },
          }
        : {}),
      "import/resolver": {
        typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
      },
    },

    rules: {
      // Better to avoid one-line `if`s, especially since that rule has the `--fix` option
      curly: "error",

      // With prettier around, there's little danger that `i++` will bring unexpected results
      "no-plusplus": "off",

      // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
      "no-prototype-builtins": "off",

      // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
      "import/prefer-default-export": "off",
      "import/no-default-export": "error",

      "import/order": ["warn"],

      "no-void": ["error", { allowAsStatement: true }],

      "no-debugger": ["warn"],

      // It's OK if u know how to use it, that's why it's built-in into TS
      [typescript
        ? "@typescript-eslint/no-non-null-assertion"
        : "no-non-null-assertion"]: "off",

      // Functional programming FTW
      "unicorn/no-reduce": "off",

      // What if I want to export custom `Error` classes in the same file that uses them?
      // It's a good example when multiple classes in one file is fine.
      "max-classes-per-file": "off",

      // It's good if used well (i.e. when defining a var that replaces a function argument)
      "no-underscore-dangle": "off",

      // Allow for `error` and `cause` as error variable names in try-catch expressions
      // ( `cause` is useful in e.g. Sentry SDK https://github.com/getsentry/sentry-javascript/issues/1401 )
      "unicorn/catch-error-name": [
        "error",
        {
          ignore: ["cause"],
        },
      ],

      // With prettier around, they aren't that bad
      "no-nested-ternary": "off",
      "unicorn/no-nested-ternary": "off",

      // Use function hoisting to improve code readability
      ...(!typescript && {
        "no-use-before-define": [
          "error",
          { functions: false, classes: true, variables: true },
        ],
      }),
      ...(typescript && {
        "@typescript-eslint/no-use-before-define": [
          "error",
          {
            functions: false,
            classes: true,
            variables: true,
            typedefs: true,
          },
        ],
      }),

      [typescript ? "@typescript-eslint/no-unused-vars" : "no-unused-vars"]: [
        "warn",
        {
          argsIgnorePattern: "^_",
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],

      // Common abbreviations are known and readable
      "unicorn/prevent-abbreviations": "off",

      // Too lazy now to define our file naming rules in eslint
      "unicorn/filename-case": "off",

      // Until we fix some legacy files, we'll leave that as possible
      "unicorn/no-abusive-eslint-disable": "off",

      "unicorn/no-for-loop": "off",

      // This is cool, but in Ailo we use local path mappings a lot
      // and it would be tricky to force it in all the repos.
      "import/no-cycle": "off",

      // It's nice as it pushes the dev to not write class-based code,
      // but this would invalidate e.g. all of Ailo Repository classes.
      "class-methods-use-this": "off",

      // Contradicts `consistent-return` rule if we actally have a fn
      // that returns something like `string | undefined`.
      "unicorn/no-useless-undefined": "off",

      // This makes complete sense especially in TS
      // if you use functions that have type predicates,
      // e.g. `.filter(isNumber)`
      "unicorn/no-fn-reference-in-iterator": "off",

      // Doesn't make sense anymore (in ES5-compliant environments)
      radix: "off",

      ...(typescript && {
        "@typescript-eslint/no-floating-promises": "warn",

        // This might be nice, but it's too late now to enforce it
        "@typescript-eslint/explicit-function-return-type": "off",
        // Makes no sense to allow type inferrence for expression parameters, but require typing the response
        // "@typescript-eslint/explicit-function-return-type": [
        //   "error",
        //   { "allowExpressions": true, "allowTypedFunctionExpressions": true }
        // ],

        // It's bugged now, too many false positives
        // ( https://github.com/typescript-eslint/typescript-eslint/issues/522 )
        "@typescript-eslint/unbound-method": "off",

        // Somehow TS doesn't infer the type for me in a code like this:
        // ```ts
        // const goToNextQuestion = useCallback(
        //   (validate = true) => {
        //     ...
        // ```
        "@typescript-eslint/no-inferrable-types": [
          "warn",
          { ignoreParameters: true },
        ],

        // Nice in theory, but impractical... Printing numbers, undefineds, nulls, errors is sometimes still desired.
        "@typescript-eslint/restrict-template-expressions": "off",

        // They are nice in theory, but in practice if you have at least one `any` touching your codebase,
        // you'll end up with a lot of eslint exceptions...
        //
        // We already have a warning about not using `any` explicitly,
        // let's leave it that as the standard for now.
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-return": "off",
      }),

      // Same as https://github.com/airbnb/javascript/blob/63098cbb6c05376dbefc9a91351f5727540c1ce1/packages/eslint-config-airbnb-base/rules/style.js#L339 ,
      // but without banning ForOfStatement , as `for await` is actually a very useful and readable construction.
      // ( https://github.com/airbnb/javascript/issues/1271 )
      "no-restricted-syntax": [
        "error",
        {
          selector: "ForInStatement",
          message:
            "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
        },
        {
          selector: "LabeledStatement",
          message:
            "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
        },
        {
          selector: "WithStatement",
          message:
            "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
        },
      ],

      ...(typescript
        ? {
            // Fix for https://github.com/typescript-eslint/typescript-eslint/issues/2552
            "no-shadow": "off",
            // We use `transact(trx, trx => ...)` quite heavily,
            // let's skip this for rule for that case for now.
            "@typescript-eslint/no-shadow": ["warn", { allow: ["trx"] }],
          }
        : {
            "no-shadow": ["warn", { allow: ["trx"] }],
          }),

      ...(react
        ? {
            // Sometimes it's ok
            "react/no-array-index-key": "off",

            // TS is better than proptypes
            "react/prop-types": 0,

            // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
            "react/destructuring-assignment": "off",

            // No jsx extension: https://github.com/facebook/create-react-app/issues/87#issuecomment-234627904
            "react/jsx-filename-extension": "off",

            // It's not ideal true, but TS will error us when it's spreading too much
            "react/jsx-props-no-spreading": "off",

            // Workaround for https://github.com/evcohen/eslint-plugin-jsx-a11y/issues/402#issuecomment-368305051
            "jsx-a11y/anchor-is-valid": [
              "error",
              {
                components: ["Link"],
                specialLink: ["hrefLeft", "hrefRight"],
                aspects: ["invalidHref", "preferButton"],
              },
            ],

            // I find it useless, and just producing false negatives (e.g. when you want to render `You're`.)
            "react/no-unescaped-entities": "off",
          }
        : {}),
    },

    overrides: [
      // Allow for /// import declarations in .d.ts files
      {
        files: "*.d.ts",
        rules: {
          "spaced-comment": "off",
        },
      },

      // We don't support import/export yet in node.js files not processed by babel
      typescript && {
        files: [".*.js", "*.js", "*.*.js", "database/**/*.js", "ops/**/*.js"],
        rules: {
          "@typescript-eslint/no-var-requires": "off",
        },
      },

      // Knex generates migrations in such a way that they don't have their functions named
      // Let's stay with it, it's not that bad
      {
        files: ["database/migrations/*"],
        rules: {
          "func-names": "off",
        },
      },

      {
        // Test files
        files: [
          "**/{test,test_utils,test-utils,test_modules,test-modules}/**/*",
          "**.test.{js,jsx,ts,tsx}",
        ],
        rules: {
          // may use dev deps
          "import/no-extraneous-dependencies": [
            "error",
            {
              devDependencies: true,
            },
          ],

          // let them use `any`, as it's very often used in test files
          // (e.g. to mock stuff)
          "@typescript-eslint/no-explicit-any": "off",
        },
      },

      // Enable TS-only rules on .ts files only
      typescript && {
        files: ["*.ts", "*.tsx"],
        rules: {
          // All class methods are `public` by default in JS,
          // so writing that keyword is unneeded.
          "@typescript-eslint/explicit-member-accessibility": [
            "error",
            { accessibility: "no-public" },
          ],
        },
      },

      {
        // GraphQLSchemaModule files
        files: "src/api/**/module.{js,ts}",
        rules: {
          ...(typescript && {
            // It provides false negatives for gql modules using `GraphQLResolvers` type def
            "@typescript-eslint/explicit-module-boundary-types": "off",
          }),
          // nulls are actually useful in GQL modules
          "unicorn/no-null": "off",
        },
      },

      // Integration tests often test GQL which often return nulls
      // - let them use nulls
      {
        files: "*.integration.test.*",
        rules: {
          "unicorn/no-null": "off",
        },
      },
    ].filter(Boolean),
  };
};
