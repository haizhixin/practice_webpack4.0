const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 复制静态文件到某个目录下
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
//性能优化:速度分析插件可以分析出loader和plugin的耗时
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
// 多进程打包
// const HappyPack = require('happypack')
const webpack = require('webpack');
//性能优化:体积分析插件 可以分析第三方模块文件大小 也可以分析业务组件代码大小
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');



const makePlugins = (configs) => {
    const plugins = [
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../')
        }),
        new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, '../static'),
            to: config.release.assetsSubDirectory,
            ignore: ['.*']
        }]),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         { from: './img/*', },
        //     ],
        // }),
        new BundleAnalyzerPlugin(),

        new WorkboxWebpackPlugin.GenerateSW({
            clientsClaim: true,
            exclude: [/\.map$/, /asset-manifest\.json$/],
            importWorkboxFrom: 'cdn',
            navigateFallback: paths.publicUrlOrPath + 'index.html',
            navigateFallbackBlacklist: [
                // Exclude URLs starting with /_, as they're likely an API call
                new RegExp('^/_'),
                // Exclude any URLs whose last part seems to be a file extension
                // as they're likely a resource and not a SPA route.
                // URLs containing a "?" character won't be blacklisted as they're likely
                // a route with query params (e.g. auth callbacks).
                new RegExp('/[^/?]+\\.[^/]+$'),
            ],
        }),

        new ManifestPlugin({
            fileName: 'asset-manifest.json',
            publicPath: paths.publicUrlOrPath,
            generate: (seed, files, entrypoints) => {
                const manifestFiles = files.reduce((manifest, file) => {
                    manifest[file.name] = file.path;
                    return manifest;
                }, seed);
                const entrypointFiles = entrypoints.app.filter(
                    fileName => !fileName.endsWith('.map')
                );

                return {
                    files: manifestFiles,
                    entrypoints: entrypointFiles,
                };
            },
        }),

        // // happyPack 开启多进程打包
        // new HappyPack({
        //     // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
        //     id: 'babel',
        //     // 如何处理 .js 文件，用法和 Loader 配置中一样
        //     loaders: ['babel-loader?cacheDirectory'] //设置babel-loader的cacheDirectory=true开启缓存
        // }),
    ];
    Object.keys(configs.entry).forEach(item => {
        plugins.push(
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                filename: `${item}.html`,
                chunks: ['runtime', 'vendors', item]
            })
        )
    });
    const files = fs.readdirSync(path.resolve(__dirname, '../dll'));
    files.forEach(file => {
        if (/.*\.dll.js/.test(file)) {
            plugins.push(new AddAssetHtmlWebpackPlugin({
                filepath: path.resolve(__dirname, '../dll', file)
            }))
        }
        if (/.*\.manifest.json/.test(file)) {
            plugins.push(new webpack.DllReferencePlugin({
                manifest: path.resolve(__dirname, '../dll', file)
            }))
        }
    });
    return plugins;
}

const configs = smp.wrap({
    entry: {
        index: './src/index.js',
        list: './src/list.js',
        detail: './src/detail.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        noParse: /lodash/, //不对未进行模块化处理的文件进行分析处理
        rules: [
            // // js
            // {
            //     test: /\.js$/,
            //     // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
            //     use: ['happypack/loader?id=babel'],
            //     include: srcPath,
            //     // exclude: /node_modules/
            // },
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, '../src'),
                use: [{
                    //把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行
                    loader: 'thread-loader',
                    options: {
                        //产生的worker的数量,默认就是cpu的核心数
                        workers: 3
                    }
                }, {
                    loader: 'babel-loader'
                }, ]
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
            }
        ]
    },
    optimization: {
        runtimeChunk: {
            name: 'runtime'
        },
        usedExports: true,
        splitChunks: {
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
})
configs.plugins = makePlugins(configs);

module.exports = configs





// 通过缓存提升二次打包速度 开启缓存的三种方式
// 1.babel-loader 开启缓存
// 2.terser-webpack-plugin 开启缓存
// 3.使用hard-source-webpack-plugin
//     new HappyPack({
//       loaders: ['babel-loader?cacheDirectory=true'],
//     })

//   optimization: {
//     minimize: true,
//     minimizer: [
//       new TerserPlugin({
//         //代码压缩插件
//         parallel: 4, //开启并行压缩
//         cache: true,
//       }),
//     ],
//   },
// 设置terser-webpack-plugin插件的cache: true开启缓存
// 使用hard-source-webpack-plugin
// npm install --save-dev hard-source-webpack-plugin
//   plugins: [
// 	   new HardSourceWebpackPlugin()
//   ]  