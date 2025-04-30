import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Comment this out to disable specific rules
      // "@typescript-eslint/no-explicit-any": "off", // Turn off the rule for any
      // "@typescript-eslint/no-unused-vars": "off", // Turn off unused-vars
      // "@typescript-eslint/no-empty-object-type": "off", // Disable empty object type error
    },
  },
];

export default eslintConfig;
