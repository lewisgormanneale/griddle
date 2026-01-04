const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
};

module.exports = createJestConfig(customJestConfig);
