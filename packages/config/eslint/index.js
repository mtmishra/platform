/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"],
  rules: {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
  },
};
