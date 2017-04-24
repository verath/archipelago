const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {presets: ['es2015']}
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            },
            {
                test: /\.(jpg|png|svg)$/,
                loader: 'file-loader'
            },
        ]
    },
    resolve: {
        alias: {
            pixijs: path.resolve(__dirname, 'node_modules/pixi.js'),
        }
    },
    plugins: [
        new HtmlWebpackPlugin({template: 'src/index.html'}),
        new ExtractTextPlugin('style.css')
    ]
};
