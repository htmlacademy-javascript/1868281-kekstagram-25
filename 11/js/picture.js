import {showModal} from './picture-modal.js';

const picturesContainer = document.querySelector('.pictures');
const randomPostTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesFragment = document.createDocumentFragment();


const showSortingBlock = () => {
  const sortPicturesContainer = document.querySelector('.img-filters');
  sortPicturesContainer.classList.remove('img-filters--inactive');
};

const renderMiniPosts = (usersPosts) => {
  usersPosts.forEach((userPost) => {
    const {url, likes, comments} = userPost;
    const postElement = randomPostTemplate.cloneNode(true);
    postElement.querySelector('.picture__img').src = url;
    postElement.querySelector('.picture__likes').textContent = likes;
    postElement.querySelector('.picture__comments').textContent = comments.length;
    picturesFragment.append(postElement);

    postElement.addEventListener('click', () => {
      showModal(userPost);
    });
  });
  picturesContainer.append(picturesFragment);
};

export{renderMiniPosts, showSortingBlock};
