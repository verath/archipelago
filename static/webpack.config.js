const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: {
        main: './src/main.js',
        vendor: ['pixijs', 'eventemitter3']
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [["es2015", {"modules": false}]]
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            },
            {
                test: /\.(jpg|png|svg)$/,
                loader: 'file-loader',
                options: {name: '[name].[hash].[ext]'},
            },
        ]
    },
    resolve: {
        alias: {
            pixijs: path.resolve(__dirname, 'node_modules/pixi.js'),
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html.ejs'
        }),
        new ExtractTextPlugin('[name].[contenthash].css'),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        CopyWebpackPlugin([
            {from: 'src/static', to: 'static'}
        ]),
        new OfflinePlugin({
            AppCache: false,
            responseStrategy: 'network-first'
        })
    ]
};
