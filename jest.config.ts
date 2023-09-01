import type { Config } from "jest";

const config: Config = {
  resetMocks: true,
  moduleNameMapper: {
    "^./utils.js$": "<rootDir>/src/utils.ts",
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

export default config;
