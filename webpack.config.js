const path = require("path")

module.exports = {
  mode:"development",//环境模式
  entry:"./src/index.js",//打包的入口文件 路径相对于webpack.config.js
  output:{
    filename:"bundle.js",//打包后的文件名
    path:path.resolve(__dirname,'dist'),//指定打包后的文件所在的目录，要使用绝对路径
    
    // _dirname //当前文件的目录名
    // path.resolve()将路径或路径片段的序列从右向左解析为绝对路径
  },
  module:{
    rules:[{
      test:/\.jpg$/,
      use:{
        loader:"url-loader",
        options:{
          outputPath:'images/',//把对应的文件输出到dist下的images文件夹下
          name:'[name].[ext]',//更改输出的文件名
          limit:2048//当小于2048字节时，图片会以base64的编码方式（DataUrl）直接输出到js文件中，大于时像file-loader一样输出到images文件夹下
        }
        
      }
    },{
      test:/\.vue$/,
      use:{
        loader:"vue-loader"
      }
    }]
  }


}