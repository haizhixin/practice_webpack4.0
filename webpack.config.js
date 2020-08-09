const path = require("path")

module.exports = {
  mode:"development",//环境模式
  entry:"./src/index.js",//打包的入口文件 路径相对于webpack.config.js
  output:{
    filename:"bundle.js",//打包后的文件名
    path:path.resolve(__dirname,'dist'),//指定打包后的文件所在的目录，要使用绝对路径
    
    // _dirname //当前文件的目录名
    // path.resolve()将路径或路径片段的序列从右向左解析为绝对路径
  }


}