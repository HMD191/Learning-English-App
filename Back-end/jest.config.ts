import type { Config } from 'jest';
import { compilerOptions } from './tsconfig.json';
import { pathsToModuleNameMapper } from 'ts-jest';

const config: Config = {
  clearMocks: true,
  // collectCoverage: true,
  // coverageDirectory: 'coverage',
  // coverageProvider: 'v8',
  moduleFileExtensions: [
    'js',
    'mjs',
    'cjs',
    'jsx',
    'ts',
    'mts',
    'cts',
    'tsx',
    'json',
    'node',
  ],
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  }),

  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

export default config;
