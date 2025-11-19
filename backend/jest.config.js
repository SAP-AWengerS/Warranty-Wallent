module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  testTimeout: 10000,
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js'
  ],
  testEnvironmentOptions: {
    node: {
      global: {
        Buffer: Buffer
      }
    }
  },
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
