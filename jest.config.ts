/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleDirectories: [
    "node_modules", "<rootDir>"
  ],
  moduleNameMapper:{
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  preset: 'ts-jest',
  setupFiles: [
    "<rootDir>/setupTests.ts"
  ],
  testEnvironment: "jest-environment-node",
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
};

export default config;
