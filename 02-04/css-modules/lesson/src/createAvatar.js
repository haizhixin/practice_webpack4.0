// import avatar from './avatar.jpg';
const avatar = require("./avatar.jpg");
import style from './index.scss';

function createAvatar() {
    var img = new Image();
    img.src = avatar;
    img.classList.add(style.avatar);

    var div = document.createElement('div')
    div.classList.add(style.root)

    var root = document.getElementById('root');
    root.append(img);
    root.append(div)
}

export default createAvatar;