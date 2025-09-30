module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.steps.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
