import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";

export default tseslint.config(
  // 1. Global Ignores
  {
    ignores: [".next/*", "node_modules/*", "**/*.d.ts", "migrations/*"],
  },

  // 2. Base JS & TS Recommended rules
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Next.js & React Plugin Composition
  {
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": hooksPlugin,
    },
    rules: {
      // Spread recommended rules from plugins
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // React 17+ JSX Transform compatibility
      "react/react-in-jsx-scope": "off",
      
      // Custom TS rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);
