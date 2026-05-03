import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": ["error", {
        "argsIgnorePattern": "^_|^next$|^err$|^error$",
        "args": "after-used"
      }]
    }
  }
];