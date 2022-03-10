import {createUsersPosts} from './data.js';

const picturesContainer = document.querySelector('.pictures');
const randomPostTemplate = document.querySelector('#picture').content.querySelector('.picture');
const usersPosts = createUsersPosts(25);
const picturesFragment = document.createDocumentFragment();

usersPosts.forEach(({url, likes, comments}) => {
  const postElement = randomPostTemplate.cloneNode(true);
  postElement.querySelector('.picture__img').src = url;
  postElement.querySelector('.picture__likes').textContent = likes;
  postElement.querySelector('.picture__comments').textContent = comments.length;
  picturesFragment.append(postElement);
});

picturesContainer.append(picturesFragment);
