// import a from 'a';
// import b from 'b';


import _ from 'lodash';
import { ff } from './test.js';


// var element = document.createElement('div');
// element.innerHTML = _.join(['Dell', 'Lee'], '-');
// document.body.appendChild(element);

function getComponent() {
    // 异步模块
    return import( /* webpackChunkName:"test" */ './test.js').then(({ default: _ }) => {
        var element = document.createElement('div');
        element.innerHTML = _.join(['Dell', 'Lee'], '-');
        return element;
    })
}

getComponent().then(element => {
    document.body.appendChild(element);
});