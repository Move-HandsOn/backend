import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^@/(.*)$': '<rootDir>/../src/$1',
    '^test/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'node',
  testTimeout: 30000, 
};

export default config;
