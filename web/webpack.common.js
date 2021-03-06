/*eslint-env node*/

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/main.js",
    },
    output: {
        filename: "[name].[chunkhash].js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(jpg|png|svg)$/,
                loader: "file-loader",
                options: { name: "[name].[hash].[ext]" },
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "src/index.html.ejs"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[chunkhash].css",
        }),
        new CopyWebpackPlugin([
            { from: "src/static/manifest.json", to: "static/manifest.json" },
            { from: "src/static/icon192.png", to: "static/icon192.png" },
            { from: "src/sw.js", to: "." },
        ], { copyUnmodified: true })
    ],
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
    }
};
