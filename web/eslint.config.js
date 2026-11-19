import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
    {
        ignores: ["dist/", "node_modules/", "src/wire/proto_bundle.*"],
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
            react: { version: "detect" },
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
        files: ["*.config.js"],
        languageOptions: {
            globals: { ...globals.node },
        },
    },
];
