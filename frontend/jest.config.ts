import type { Config } from 'jest';
import nextJest from 'next/jest.js';



const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__test__/**/*.[jt]s?(x)' // Match files in __test__ directory
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1', // Use <rootDir>/app/ to resolve paths from the root
  },
};

export default createJestConfig(config);
