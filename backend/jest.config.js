module.exports = {
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  testTimeout: 30000,
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text', 'html'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './test-results', outputName: 'junit.xml' }]
  ]
};
