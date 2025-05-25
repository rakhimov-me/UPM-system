module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts','js','json','node'],

  testMatch: ['**/tests/**/*.(spec|test).ts'],

  setupFiles: ['<rootDir>/src/setupTests.ts'],
}
