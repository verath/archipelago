import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
    {
        ignores: ["dist/", "dist-e2e/", "playwright-report/", "test-results/", "node_modules/", "src/wire/proto_bundle.*"],
    },
    js.configs.recommended,
    react.configs.flat.recommended,
    reactHooks.configs.flat.recommended,
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: { ...globals.browser },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        settings: {
            // Not "detect": eslint-plugin-react 7.37's version detection calls
            // context.getFilename(), which ESLint 10 removed. The plugin has no
            // ESLint 10 release yet, hence also the "overrides" in package.json.
            react: { version: "19.3" },
        },
        rules: {
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "quotes": ["error", "double"],
            "semi": ["error", "always"],
            "no-console": "off",
            "no-unused-vars": "off",
            "react/prop-types": "off",
        },
    },
    {
        // Node, plus browser globals for code passed to page.evaluate.
        files: ["e2e/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            globals: { ...globals.node, ...globals.browser },
        },
        rules: {
            // Playwright fixtures call use(), which is not a React hook.
            "react-hooks/rules-of-hooks": "off",
        },
    },
    {
        files: ["*.config.js"],
        languageOptions: {
            ecmaVersion: "latest",
            globals: { ...globals.node },
        },
    },
];
