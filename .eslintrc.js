module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
  rules: {
    "@typescript-eslint/no-explicit-any": ["off"],
    "tsdoc/syntax": "warn",
  },
};
