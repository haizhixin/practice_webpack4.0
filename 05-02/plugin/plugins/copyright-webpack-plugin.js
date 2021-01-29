class CopyrightWebpackPlugin {
    constructor(options) { //接收插件传入的参数

    }

    apply(compiler) {
        //compiler是webpack的实例 存储了webpack相关的配置信息 打包过程 各种参数

        compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
            //compilation只是存放的和这一次打包相关的所有内容
            console.log('compiler');
        })

        //compiler.hooks中定义了webpack打包过程中的各个时刻(例如此处的emit时刻)具体见官网  tapAsync是异步的
        compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, cb) => {
            debugger;
            //在dist文件夹下加入一个copyright.txt
            compilation.assets['copyright.txt'] = {
                //内容
                source: function() {
                    return 'copyright by dell lee'
                },
                //尺寸
                size: function() {
                    return 21;
                }
            };
            //如果使用tapAsync一定要在最后调用一下cb()回调函数
            cb();
        })
    }

}

module.exports = CopyrightWebpackPlugin;