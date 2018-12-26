const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ProgressBarWebpackPlugin = require("progress-bar-webpack-plugin");
const TsconfigPathsWebpackPlugin = require("tsconfig-paths-webpack-plugin");
const { DefinePlugin } = require("webpack");
const UglifyJsWebpackPlugin = require("uglifyjs-webpack-plugin");
const isProduction = process.env.NODE_ENV === "production" ? true : false;

module.exports = {
    devtool: isProduction ? "source-map" : "source-map",
    devServer: {
        proxy: {
            "/graphql": "http://localhost:8081/graphql"
        }
    },
    mode: isProduction ? "production" : "development",
    entry: "./src/app.tsx",
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new UglifyJsWebpackPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            })
        ]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    isProduction ? null : "cache-loader",
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true
                        }
                    }
                ].filter(a => a)
            },
            {
                test: /\.css$/,
                use: [
                    isProduction ? null : "cache-loader",
                    isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                    "css-loader",
                    "postcss-loader"
                ].filter(a => a)
            },
            {
                test: /\.(eot|svg|ttf|woff)$/,
                loader: "file-loader"
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".json"],
        plugins: [
            new TsconfigPathsWebpackPlugin(),
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true
            }
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            tslint: true
        }),
        new DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
        }),
        new CleanWebpackPlugin(["dist"]),
        new ProgressBarWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};
