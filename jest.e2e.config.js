module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    testEnvironment: 'node',
    testRegex: '.*\\.*spec\\.ts$',
    verbose: true,
    rootDir: '.',
    coverageDirectory: './coverage-e2e',
    collectCoverageFrom: ['**/*.ts'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFiles: ['./__tests__/jest.env.ts'],
    setupFilesAfterEnv: ['./__tests__/jest.setup.ts'],
    globalSetup: './__tests__/jest.global-setup.ts',
    globalTeardown: './__tests__/jest.global-teardown.ts',
    testPathIgnorePatterns: ['./src/database', './src/index'],
    coveragePathIgnorePatterns: ['./src/database', './src/index'],
};
