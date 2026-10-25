import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

const hookRules =
  reactHooks.configs["flat/recommended"]?.rules ??
  reactHooks.configs.recommended?.rules ??
  {};

export default [
  { ignores: ["dist", "node_modules", ".vite", ".ssr-check", "ssr-check.jsx"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.es2022 },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...hookRules,
      // Komponen yang hanya dipakai sebagai tag JSX tidak dihitung core
      // eslint sebagai "dipakai" — abaikan identifier PascalCase.
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
