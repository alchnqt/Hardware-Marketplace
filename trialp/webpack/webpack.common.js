const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EncodingPlugin = require('encoding-plugin');

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
        static: './build',
        compress: true,
        port: 8989,
        host: 'courseproject',
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /(.js|.jsx)$/,
                exclude: /node_modules/,
                use: {
                    options: {
                        cacheDirectory: true, // ������������� ���� ��� ��������� ������������
                        // ��� ������ �������
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
                test: /\.(le|c)ss$/i, // /\.(le|c)ss$/i ���� �� ����������� less
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
                type: 'asset/resource', // � ��������� ������
                // ����������� �������� �� 8�� ����� ���������� � ���
                // � ������ ���������� ��� ����������� ����� ���������� � dist/assets
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource',
            }
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
        new MiniCssExtractPlugin()
    ]
}