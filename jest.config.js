module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    testEnvironment: 'node',
    testRegex: '\\.spec\\.ts$',
    verbose: true,
    rootDir: '.',
    coverageDirectory: '../coverage',
    collectCoverageFrom: ['**/*.(t|j)s'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testPathIgnorePatterns: ['\\.e2e\\.spec\\.(js|ts)$'],
    coveragePathIgnorePatterns: ['\\.e2e\\.spec\\.(js|ts)$'],
};
