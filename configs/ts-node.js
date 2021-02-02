const createEslintConfig = require("../createEslintConfig");

module.exports = createEslintConfig({
  typescript: true,
  node: true,
  jest: true,
});
