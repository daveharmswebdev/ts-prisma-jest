/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const {pathsToModuleNameMapper} = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");
/**
* webstorm requires a *.js config file
*/

const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.tests.json', // Use the test-specific config
      },
    ],
  },
  testMatch: ['<rootDir>/tests/unit/**/*.unit.spec.ts'],
  rootDir: './',
  collectCoverageFrom: [
    'src/**/*.ts', // Collects coverage from all source files
    '!src/routes/**',
    '!src/tests/**', // Excludes test files from coverage
    '!**/*.d.ts', // Excludes TypeScript declaration files
  ],
  moduleDirectories: [
    'node_modules',
    '<rootDir>/src', // Allows imports from the src directory without relative paths
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/'}),
  // coverageThreshold: {
  //   global: {
  //     branches: 80, // Require 80% of branch coverage
  //     functions: 80, // Require 80% of function coverage
  //     lines: 80, // Require 80% of line coverage
  //     statements: 80, // Require 80% of statement coverage
  //   },
  // },
};

module.exports = config;
