const loaderUtils = require('loader-utils');

module.exports = function(source) {
    const options = loaderUtils.getOptions(this);

    // 在loader里编写异步的代码

    //通过this.async来告诉这是一个异步的loader
    const callback = this.async();

    setTimeout(() => {
        const result = source.replace('dell', options.name);
        //当异步代码执行完成 后执行回调函数
        callback(null, result);
    }, 1000);
}