const dotenv = require('dotenv');
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
}

module.exports = config;