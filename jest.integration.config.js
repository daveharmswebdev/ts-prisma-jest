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