const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        main: './src/index.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }, {
            test: /\.(jpg|png|gif)$/,
            use: {
                loader: 'url-loader',
                options: {
                    name: '[name]_[hash].[ext]',
                    outputPath: 'images/',
                    limit: 10240
                }
            }
        }, {
            test: /\.(eot|ttf|svg)$/,
            use: {
                loader: 'file-loader'
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../')
        })
    ],
    optimization: {
        runtimeChunk: {
            name: 'runtime' //对于老版本的用户 如果我们没有更改代码但是两次打包文件的hash值却变化了 我们需要做一个额外的配置 对于新版本用户来说配了也没有影响
        },
        usedExports: true,
        splitChunks: { // 第三方库chunk
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: 'vendors',
                }
            }
        }
    },
    performance: false,
    output: {
        path: path.resolve(__dirname, '../dist')
    }
}