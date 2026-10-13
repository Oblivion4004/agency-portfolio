import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  { files: ["src/**/*.js"], languageOptions: { globals: globals.browser } },
  {
    files: ["scripts/**/*.mjs", "*.mjs"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["scripts/browser-check.mjs"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
