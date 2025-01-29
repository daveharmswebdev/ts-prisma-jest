# Test Execution

# Controversial: "Typescript is Javascript cosplaying as C#"

![Cosplay](./assets/cosplay.jpg)

Might be true...might not.  Either way TS, along wit Jest requires a  ton of tooling.  This demo project requires typescript and vite for a build bundle, ts-node for dev, and jest for testing.  And because we are testing it requires separate tsconfigs for dev and testing.

And because we have unit and integration testing it requires separate jest files for both.

## Config Files
In this repo we have two config files because we are running two distinct types of test.

```js
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
};

module.exports = config;
```

## Important elements

### Code Coverage

```text
collectCoverage: true
coverageDirectory: 'coverage'
coverageProvider: 'v8',

collectCoverageFrom: [
  'src/**/*.ts',
  '!src/routes/**',
  '!src/tests/**',
  '!**/*.d.ts',
]
```

## Test match

Obviously this tells us which files to test.  Notice the distinction between unit and integration.

```text
testMatch: ['<rootDir>/tests/unit/**/*.unit.spec.ts'],
```

```text
testMatch: ['<rootDir>/tests/integration/**/*.integration.spec.ts'],
```

Furthermore notice how they are used in the test scripts.

```json
  "scripts": {
    "start": "node dist/server.js",
    "build": "vite build",
    "dev": "ts-node -r tsconfig-paths/register src/server.ts",
    "test": "jest --config jest.unit.config.js",
    "test:watch": "jest --watch --config jest.unit.config.js",
    "integration-testing:setup": "./integration-teseting-setup.sh",
    "integration-testing:teardown": "docker compose -f docker-compose.test.yml down",
    "integration-test": "npm run integration-testing:setup && jest --config jest.integration.config.js || true && npm run integration-testing:teardown"
  },
```

Informs jest that we are collecting coverage, where the report goes and what files we are covering.  We are covering source, but not routes and tests and not the TS declaration files.


The command line equivalent of the config file would be 

```text
npx jest --preset=ts-jest --testEnvironment=node --collectCoverage \
--coverageDirectory=coverage --coverageProvider=v8 --transform='{"^.+\\.tsx?$":["ts-jest",{"tsconfig":"tsconfig.tests.json"}]}' \
--testMatch='<rootDir>/tests/unit/**/*.unit.spec.ts' --rootDir=./ \
--collectCoverageFrom='["src/**/*.ts","!src/routes/**","!src/tests/**","!**/*.d.ts"]' \
--moduleDirectories='["node_modules","<rootDir>/src"]' \
--moduleNameMapper='{"^.+\\.[tj]sx?$":["ts-jest",{"tsconfig":"tsconfig.tests.json"}]}' 
```

And yes I got AI to do that for me.  But the point is that it should be obvious why we use a config file.

```js
const dotenv = require('dotenv');
const {pathsToModuleNameMapper} = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");
dotenv.config({ path: '.env.test'});

const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.tests.json', // Use the test-specific config
            },
        ],
    },
    testMatch: ['<rootDir>/tests/integration/**/*.integration.spec.ts'],
    rootDir: './',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/'}),
}

module.exports = config;
```