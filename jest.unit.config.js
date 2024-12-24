/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

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
  collectCoverageFrom: ['src/**/*.ts'],
};

module.exports = config;
