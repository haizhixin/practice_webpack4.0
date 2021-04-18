const loaderUtils = require('loader-utils');
module.exports = function (source) {
    // this上能获取关于loader的各种信息 方法或者变量,因此这里不能使用箭头函数
    // 通过this和loaderUtils获取loader的参数
    const options = loaderUtils.getOptions(this);
    return source.replace('lee', 'world');
    // 如果转换完成之后还想要输出一些内容 使用this.callback(null,result)相当于return
}
