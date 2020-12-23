const createEslintConfig = require("../createEslintConfig");

module.exports = createEslintConfig({
  react: false,
  jest: false,
  cypress: true,
});
