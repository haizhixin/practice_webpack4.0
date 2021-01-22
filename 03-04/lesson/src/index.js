// import a from 'a';
// import b from 'b';
import react from 'react-dom';

import { ff } from './test.js';
console.log(ff());

import _ from 'lodash';


var element = document.createElement('div');
element.innerHTML = _.join(['Dell', 'Lee'], '-');
document.body.appendChild(element);

// function getComponent() {
// 	return import(/* webpackChunkName:"lodash" */ 'lodash').then(({ default: _ }) => {
// 		var element = document.createElement('div');
// 		element.innerHTML = _.join(['Dell', 'Lee'], '-');
// 		return element;
// 	})
// }

// getComponent().then(element => {
// 	document.body.appendChild(element);
// });