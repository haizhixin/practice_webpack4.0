const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    externals: 'lodash', //外部获取这些扩展依赖
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'library.js',
        library: 'root',
        libraryTarget: 'umd'
    }
}