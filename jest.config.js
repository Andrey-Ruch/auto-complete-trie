export default {
  testEnvironment: "node",
  // Source files are native ESM, so no transform step is required.
  transform: {},
  testMatch: ["**/tests/**/*.test.js"],
};
