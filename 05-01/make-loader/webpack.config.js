const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    // 当我们使用loader时,首先在node_modules下去找loader 如果找不到去当前目录下的loaders目录下去找
    resolveLoader: {
        modules: ['node_modules', './loaders']
    },
    module: {
        rules: [{
            test: /\.js/,
            use: [
            {
                loader: 'replaceLoader',
            },
            {
                loader: 'replaceLoaderAsync',
                options: {
                    name: 'lee'
                }
            }, ]
        }]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
}