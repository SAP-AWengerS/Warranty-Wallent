module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  testTimeout: 10000,
  // Ensure proper module resolution
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js'
  ],
};
