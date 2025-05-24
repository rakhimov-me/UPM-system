// server/jest.server.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts','js','json','node'],

  testMatch: ['**/tests/**/*.(spec|test).ts'],

  // сначала выполняем setupTests.ts, в нём уже есть reflect-metadata + setupEnv
  setupFiles: ['<rootDir>/src/setupTests.ts'],
}
