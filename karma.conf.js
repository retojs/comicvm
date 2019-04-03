//
// The Karma test runner is just needed to debug tests involving canvas.
// With jest and jest-canvas-mock these tests are causing a heap out of memory error.

let webpackConfig = require("./webpack.test.config");

module.exports = function (config) {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        concurrency: Infinity,

        client: {
            clearContext: false
        },

        basePath: '',
        files: [
            'src/app/layout/engine/LayoutEngine.test.ts',
            'src/app/layout/engine/BubbleLayoutEngine.test.ts',
            'src/demos/components/PanelBoundingBoxViewer.test.ts'
        ],
        preprocessors: {
            'src/app/layout/engine/LayoutEngine.test.ts': ['webpack', 'sourcemap'],
            'src/app/layout/engine/BubbleLayoutEngine.test.ts': ['webpack', 'sourcemap'],
            'src/app/components/PanelBoundingBoxViewer.test.ts': ['webpack', 'sourcemap'],
        },
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },

        webpack: webpackConfig,
        webpackMiddleware: {
            stats: 'errors-only'
        }
    })
};
