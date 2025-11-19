module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  testTimeout: 10000,
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/test/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/admin.test.js',
    '/test/auth.test.js',
    '/test/google-auth.test.js',
    '/test/user.test.js',
    '/test/warrantyController.test.js'
  ],
  passWithNoTests: true,
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
