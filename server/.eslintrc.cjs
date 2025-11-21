module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "prettier", // Must be last
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "prettier",
  ],
  rules: {
    "prettier/prettier": "error",
    "no-console": "warn", // Warn about console.log statements
  },
};


