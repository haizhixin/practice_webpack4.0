const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
//性能优化:速度分析插件可以分析出loader和plugin的耗时
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')



const prodConfig = smp.wrap({
    mode: 'production',
    devtool: 'cheap-module-source-map',
    externals: 'lodash', //外部获取这些扩展依赖 通过cdn的方式引入这些基础包通过分包提升打包速度 分离基础包，分离之后以CDN的方式引入所需要的资源文件，缺点就是一个基础库必须指定一个CDN，实际项目开发中可能会引用到多个基础库，还有一些业务包，这样会打出很多个script标签

    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2
                    }
                },
                'sass-loader',
                'postcss-loader'
            ]
        }, {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader'
            ]
        },
        {
            test: /\.svg$/, //处理svg文件
            use: ['@svgr/webpack']
        }]
    },
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].chunk.css'
        }),

        //定义webpack全局环境变量
        new webpack.DefinePlugin({
            // window.ENV = 'production'
            ENV: JSON.stringify('production')
        }),





        // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
        new ParallelUglifyPlugin({
            // 传递给 UglifyJS 的参数
            // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
            uglifyJS: {
                output: {
                    beautify: false, // 最紧凑的输出
                    comments: false, // 删除所有的注释
                },
                compress: {
                    // 删除所有的 `console` 语句，可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                }
            }
        })
        // terser-webpack-plugin**(webpack4.0推荐使用，支持压缩es6代码代替webpack-parallel-uglify-plugin)
        // const TerserPlugin = require('terser-webpack-plugin');
        // optimization: {
        // 	minimize: true,
        // 	minimizer: [
        // 	  new TerserPlugin({
        // 		//代码压缩插件
        // 		parallel: 4, //开启并行压缩
        //      cache: true  //开启缓存
        // 	  }),
        // 	],
        //  } 
    ],
    output: {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js'
    }
})

module.exports = merge(commonConfig, prodConfig);