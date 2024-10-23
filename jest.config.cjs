module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1" // Mapeia "@/..." para "src/..."
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
