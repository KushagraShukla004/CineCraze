module.exports = {
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  testTimeout: 30000,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/", "/coverage/"],
};
