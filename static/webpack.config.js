const path = require('path');

module.exports = {
    entry: './lib/main.js',
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
            }
        ]
    },
    resolve: {
        alias: {
            pixijs: path.resolve(__dirname, 'node_modules/pixi.js'),
        }
    }
};
