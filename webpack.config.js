const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development', // 'production' | 'development' | 'none'
    entry: __dirname + '/src/app/index.ts',
    devtool: 'inline-source-map',
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: [
                    /node_modules/
                ]
            },
            {
                test: /\.html/,
                loader: 'raw-loader'
            },
            {
                test: /\.(sass|scss)$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'body',
            template: __dirname + '/src/public/index.html'
        })
    ],
    devServer: {
        contentBase: './src/public',
        port: 7700,
    }
};