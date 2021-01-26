//第三方库代码chunk
import _ from "react";

// 懒加载代码chunk
async function getComponent() {
    const { default: _ } = await import( /* webpackChunkName:"test" */ 'lodash');
    const element = document.createElement('div');
    element.innerHTML = _.join(['Dell', 'Lee'], '-');
    return element;
}

document.addEventListener('click', () => {
    getComponent().then(element => {
        document.body.appendChild(element);
    });
})