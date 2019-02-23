//
// see https://basarat.gitbooks.io/typescript/docs/testing/jest.html

module.exports = {
    roots: [
        "<rootDir>/src"
    ],

    testEnvironment: 'node',

    testPathIgnorePatterns: [
        "/node_modules/",

        // With jest and jest-canvas-mock these tests are causing the error
        //  "Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory"
        "src/app/layout/engine/LayoutEngine.test.ts",
        "src/app/layout/engine/BubbleLayoutEngine.test.ts"
    ],

    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },

    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",

    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],

    setupFiles: ["jest-canvas-mock"]
};