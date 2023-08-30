/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  silent: false,
  preset: 'ts-jest',
  verbose: true,
  collectCoverageFrom: [
    './src/**/*'
  ],
  coverageThreshold: {
    global: {
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100,
    }
  },
  testEnvironment: 'node',
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '__tests__',
  ],
};