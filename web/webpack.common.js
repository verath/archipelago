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
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        ["@babel/preset-env", {
                            "modules": false,
                            "targets": { "browsers": ["last 2 versions"] }
                        }]
                    ]
                }
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
            { from: "src/static", to: "static" }
        ])
    ],
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
    }
};
