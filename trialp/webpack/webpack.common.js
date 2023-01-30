const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EncodingPlugin = require('encoding-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
    output: {
        path: path.join(__dirname, '/build'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        open: false,
        static: './build',
        compress: true,
        port: 8099,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /(.js|.jsx)$/,
                exclude: /node_modules/,
                use: {
                    options: {
                        cacheDirectory: true
                    },
                    loader: 'babel-loader'
                },
            },
            {
                test: /(.ts|.tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(le|c)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(glb|gltf)$/,
                use:
                    [
                        {
                            loader: 'file-loader',
                            options:
                            {
                                outputPath: 'assets/models/'
                            }
                        }
                    ]
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new EncodingPlugin({
            encoding: 'iso-8859-1',
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: "./public", to: "assets/models/" } //to the dist root directory
            ],
        }),
        new MiniCssExtractPlugin()
    ]
}