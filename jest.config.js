const createMapper = (keys) => {
  return keys.reduce((acc, key) => {
    acc[`^./${key}.js$`] = `<rootDir>/src/${key}.ts`;
    return acc;
  }, {});
};

const config = {
  resetMocks: true,
  moduleNameMapper: createMapper([
    "utils",
    "set-image",
    "wayback",
    "save-bookmarks",
    "get-metadata",
    "add-bookmark",
    "set-additional-properties",
    "create-dates",
  ]),
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
