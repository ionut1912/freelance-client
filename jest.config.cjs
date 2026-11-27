/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "<rootDir>/jest.environment.cjs",
  // More workers than this exhaust memory on many-core machines.
  maxWorkers: "50%",
  testTimeout: 20000,
  roots: ["<rootDir>/src"],
  // MSW: do not resolve the "browser" export condition, which it disables.
  testEnvironmentOptions: { customExportConditions: [""] },
  // Some MSW dependencies ship only as ES modules.
  transformIgnorePatterns: [
    "/node_modules/(?!(msw|@mswjs|@open-draft|until-async|rettime|outvariant|strict-event-emitter|headers-polyfill|react-calendar|@wojtekmaj|get-user-locale|memoize|mimic-function|warning)/)",
  ],
  setupFiles: ["<rootDir>/jest.polyfills.cjs"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    // The browser build, so requests go through XMLHttpRequest as in the app.
    "^axios$": "<rootDir>/node_modules/axios/dist/browser/axios.cjs",
    "\\.css$": "<rootDir>/jest.styleMock.cjs",
    "^@mui/icons-material$": "<rootDir>/jest.iconsMock.cjs",
  },
  transform: {
    // Same presets as webpack.config.js, targeting Node so tests run as CommonJS.
    "^.+\\.(js|mjs|ts|tsx|jsx)$": [
      "babel-jest",
      {
        presets: [
          [
            "@babel/preset-env",
            { targets: { node: "current" }, modules: "commonjs" },
          ],
          ["@babel/preset-react", { runtime: "automatic" }],
          "@babel/preset-typescript",
        ],
      },
    ],
  },
  clearMocks: true,
  // Every source file counts, including ones no test imports.
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/*.test.{ts,tsx}",
    "!src/testUtils/**",
    "!src/setupTests.ts",
  ],
  coverageReporters: ["text", "text-summary", "lcov"],
  // A glob key is checked against each matching file on its own, so every file
  // (not just the total) must be above 80%. 80.01 means "greater than 80".
  coverageThreshold: {
    "./src/**/*.{ts,tsx}": {
      statements: 80.01,
      branches: 80.01,
      functions: 80.01,
      lines: 80.01,
    },
  },
};
