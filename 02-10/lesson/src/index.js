import "@babel/polyfill";
// 此处引入babel/polyfill相当于 presets的补丁 用于处理Promise和includes
//也需要在entry入口文件前引入 但是会污染全局环境 因此需要使用babel/plugin-tansform-runtime解决污染全局的问题
const arr = [
    new Promise(() => {}),
    new Promise(() => {})
];
const arr1 = [1, 2, 3, 4, 5]
let ss = arr1.includes(5)
console.log(ss, "ss")
arr.map(item => {
    console.log(item);
});


const p = new Promise((resolve, reject) => {
    resolve("webpack")
})

p.then(res => {
    console.log(res, "res")
})