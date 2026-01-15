module.exports = {
    testEnvironment: 'node',
    testEnvironmentOptions: {
        NODE_ENV: 'test',
    },
    restoreMocks: true,
    coveragePathIgnorePatterns: [
        'node_modules',
        'src/shared/config',
        'src/app.js',
        'drizzle',
    ],
    coverageReporters: ['text', 'lcov', 'clover', 'html'],
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: [
        '**/*.test.js',
    ],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/app.js',
        '!src/shared/config/**',
        '!src/db/**',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    verbose: true,
};
