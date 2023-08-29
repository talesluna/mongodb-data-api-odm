/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  silent: false,
  preset: 'ts-jest',
  verbose: true,
  collectCoverageFrom: [
    './src/**/*'
  ],
  testEnvironment: 'node',
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '__tests__',
  ],
};