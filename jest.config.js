module.exports = {
    preset: 'ts-jest', // Enables TypeScript support
    testEnvironment: 'node', // Testing environment for Node.js
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'], // File extensions Jest should handle
    testMatch: ['**/test/**/*.test.ts'], // Match test files in the `test` folder
    collectCoverage: true, // Enable code coverage
    collectCoverageFrom: ['src/**/*.ts'], // Include all TypeScript files in src for coverage
    coverageDirectory: './coverage', // Output coverage reports to the coverage directory
  };
  