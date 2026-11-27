// @ts-check
import js from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier/flat";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { createNodeResolver, importX } from "eslint-plugin-import-x";
import jest from "eslint-plugin-jest";
import jestDom from "eslint-plugin-jest-dom";
import jsxA11y from "eslint-plugin-jsx-a11y";
import playwright from "eslint-plugin-playwright";
import reactHooks from "eslint-plugin-react-hooks";
import testingLibrary from "eslint-plugin-testing-library";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import { configs as tseslint } from "typescript-eslint";

const TS_FILES = ["**/*.{ts,tsx}"];
const APP_FILES = ["src/**/*.{ts,tsx}"];
const UNIT_TEST_FILES = ["src/**/*.test.{ts,tsx}"];
const TEST_SUPPORT_FILES = ["src/testUtils/**/*.{ts,tsx}", "src/setupTests.ts"];

// react-hooks owns the hooks and React Compiler rules, so switch off the copies
// that @eslint-react ships under its own prefix. The names come from the preset
// that lists the overlap.
const DUPLICATE_HOOK_RULES = Object.fromEntries(
  Object.keys(
    eslintReact.configs["disable-conflict-eslint-plugin-react-hooks"].rules ??
      {},
  ).map((rule) => [
    rule.replace("react-hooks/", "@eslint-react/"),
    /** @type {const} */ ("off"),
  ]),
);

// APIs that are removed or discouraged in React 19 and have no plugin rule.
const LEGACY_REACT_SYNTAX = [
  {
    selector:
      "AssignmentExpression[left.property.name=/^(defaultProps|propTypes)$/]",
    message: "Use TypeScript types and default parameter values instead.",
  },
  {
    selector:
      "PropertyDefinition[static=true][key.name=/^(defaultProps|propTypes|contextTypes|childContextTypes)$/]",
    message: "Not supported in React 19 function components or legacy context.",
  },
  {
    selector:
      "AssignmentExpression[left.property.name=/^(contextTypes|childContextTypes)$/]",
    message: "Legacy context was removed in React 19. Use createContext.",
  },
  {
    selector: "MethodDefinition[key.name='getChildContext']",
    message: "Legacy context was removed in React 19. Use createContext.",
  },
  {
    selector: "JSXAttribute[name.name='ref'] > Literal",
    message: "String refs were removed in React 19. Use useRef.",
  },
];

export default defineConfig([
  // Build output, reports and generated files.
  globalIgnores([
    "dist/",
    "build/",
    ".next/",
    "coverage/",
    "playwright-report/",
    "test-results/",
    "**/*.gen.ts",
  ]),

  { linterOptions: { reportUnusedDisableDirectives: "error" } },

  // Baseline for every file.
  js.configs.recommended,

  // TypeScript: strict, type-aware rules.
  {
    files: TS_FILES,
    extends: [tseslint.strictTypeChecked, tseslint.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        // Picks the nearest tsconfig.json: ./ for src, ./e2e for e2e.
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Rewrites `x as T` to `x!`, which no-non-null-assertion forbids.
      "@typescript-eslint/non-nullable-type-assertion-style": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        // Async JSX event handlers are fine.
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      // Numbers format predictably in template strings.
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        { ignoreArrowShorthand: true },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": true,
          "ts-nocheck": true,
          minimumDescriptionLength: 3,
        },
      ],
    },
  },

  // React 19 and accessibility.
  {
    files: APP_FILES,
    extends: [
      eslintReact.configs["recommended-type-checked"],
      // Includes the React Compiler rules (purity, refs, immutability, ...).
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.strict,
    ],
    languageOptions: { globals: globals.browser },
    rules: {
      ...DUPLICATE_HOOK_RULES,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      "@eslint-react/no-forward-ref": "error",
      "@eslint-react/no-context-provider": "error",
      "@eslint-react/no-array-index-key": "error",
      "@eslint-react/no-nested-component-definitions": "error",
      "@eslint-react/no-unstable-context-value": "error",
      "@eslint-react/no-unstable-default-props": "error",
      "@eslint-react/no-duplicate-key": "error",
      "@eslint-react/no-implicit-key": "error",
      "@eslint-react/no-leaked-conditional-rendering": "error",
      "@eslint-react/jsx-no-useless-fragment": [
        "error",
        { allowExpressions: true },
      ],
      "@eslint-react/dom-no-missing-button-type": "error",
      "@eslint-react/dom-no-missing-iframe-sandbox": "error",
      "@eslint-react/dom-no-unsafe-target-blank": "error",

      "no-restricted-syntax": ["error", ...LEGACY_REACT_SYNTAX],
      // `role` is also an ordinary prop name on our own components.
      "jsx-a11y/aria-role": ["error", { ignoreNonDOM: true }],
    },
  },

  // Imports: no cycles, no duplicates, consistent order.
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    extends: [importX.flatConfigs.recommended, importX.flatConfigs.typescript],
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          project: ["tsconfig.json", "e2e/tsconfig.json"],
          noWarnOnMultipleProjects: true,
        }),
        createNodeResolver(),
      ],
    },
    rules: {
      "import-x/no-cycle": "error",
      "import-x/no-duplicates": "error",
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },

  // General hygiene.
  {
    plugins: { "unused-imports": unusedImports },
    rules: {
      // Unused code. Imports have an autofix, so the pre-commit `eslint --fix`
      // removes them; other unused variables are only reported. These replace
      // both built-in rules to avoid reporting everything twice.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-param-reassign": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "no-nested-ternary": "error",
    },
  },

  // Unit tests (Jest + Testing Library).
  {
    files: UNIT_TEST_FILES,
    extends: [
      jest.configs["flat/recommended"],
      testingLibrary.configs["flat/react"],
      jestDom.configs["flat/recommended"],
    ],
    rules: {
      // Treats the synchronous user-event v13 ("user-event-13") as async, and
      // its autofix crashes the lint run. no-floating-promises already catches
      // a missing await on the async v14 API.
      "testing-library/await-async-events": "off",
      // Some third-party markup has no accessible query.
      "testing-library/no-node-access": "off",
      // `alerted` is a local helper that asserts on window.alert.
      "jest/expect-expect": [
        "error",
        { assertFunctionNames: ["expect", "alerted"] },
      ],
    },
  },
  // Relaxations for tests and test helpers only.
  {
    files: [...UNIT_TEST_FILES, ...TEST_SUPPORT_FILES],
    plugins: { jest },
    languageOptions: { globals: globals.jest },
    rules: {
      // Empty mock implementations are how console noise is silenced.
      "@typescript-eslint/no-empty-function": "off",
      // The Jest-aware version allows `expect(obj.method)`.
      "@typescript-eslint/unbound-method": "off",
      "jest/unbound-method": "error",
    },
  },

  // Integration tests (Playwright).
  {
    files: ["e2e/**/*.ts"],
    extends: [playwright.configs["flat/recommended"]],
    languageOptions: { globals: globals.node },
  },

  // Plain JS and config files: Node globals, no type-aware rules.
  {
    files: ["**/*.{js,mjs,cjs}", "playwright.config.ts"],
    extends: [tseslint.disableTypeChecked],
    languageOptions: {
      globals: globals.node,
      parserOptions: { projectService: false },
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: { sourceType: "commonjs" },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    files: ["jest.polyfills.cjs", "jest.environment.cjs"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },

  // Turns off rules that conflict with Prettier. Keep after all presets.
  prettierConfig,

  // eslint-config-prettier disables these two; both are safe with Prettier
  // in these forms, so they have to be set after it.
  {
    rules: {
      curly: ["error", "all"],
      "prefer-arrow-callback": "error",
    },
  },
]);
