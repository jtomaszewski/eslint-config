module.exports = function createEslintConfig({ react = false } = {}) {
  return {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: ["./tsconfig.json"],
    },

    extends: [
      react ? "airbnb-typescript" : "airbnb-typescript/base",
      react && "airbnb/hooks",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
      "plugin:jest/recommended",
      "plugin:promise/recommended",
      "plugin:unicorn/recommended",
      "plugin:prettier/recommended",
      react && "prettier/react",
      "prettier/@typescript-eslint",
    ].filter(Boolean),

    plugins: [
      "@typescript-eslint/eslint-plugin",
      react && "react-hooks",
      "jest",
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
      // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
      "no-prototype-builtins": "off",

      // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
      "import/prefer-default-export": "off",
      "import/no-default-export": "error",

      "@typescript-eslint/no-floating-promises": "warn",

      // It's OK if u know how to use it, that's why it's built-in into TS
      "@typescript-eslint/no-non-null-assertion": "off",

      // This might be nice, but it's too late now to enforce it
      "@typescript-eslint/explicit-function-return-type": "off",
      // Makes no sense to allow type inferrence for expression parameters, but require typing the response
      // "@typescript-eslint/explicit-function-return-type": [
      //   "error",
      //   { "allowExpressions": true, "allowTypedFunctionExpressions": true }
      // ],

      // It's good if used well (i.e. when defining a var that replaces a function argument)
      "no-underscore-dangle": "off",

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

      // With prettier around, they aren't that bad
      "no-nested-ternary": "off",
      "unicorn/no-nested-ternary": "off",

      // Use function hoisting to improve code readability
      "no-use-before-define": [
        "error",
        { functions: false, classes: true, variables: true },
      ],
      "@typescript-eslint/no-use-before-define": [
        "error",
        {
          functions: false,
          classes: true,
          variables: true,
          typedefs: true,
        },
      ],

      "@typescript-eslint/no-unused-vars": [
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

      // Test files may use dev deps
      {
        files: ["{test,test_modules}/**/*", "**.test.{js,jsx,ts,tsx}"],
        rules: {
          "import/no-extraneous-dependencies": [
            "error",
            {
              devDependencies: true,
            },
          ],
        },
      },

      // Enable TS-only rules on .ts files only
      {
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
    ],
  };
};
