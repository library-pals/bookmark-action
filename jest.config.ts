import type { Config } from "jest";

const config: Config = {
  resetMocks: true,
  moduleNameMapper: {
    "^./utils.js$": "<rootDir>/src/utils.ts",
  },
  transformIgnorePatterns: [],
  coverageThreshold: {
    global: {
      branches: 98,
      functions: 100,
      lines: 98,
      statements: 98,
    },
  },
};

export default config;
