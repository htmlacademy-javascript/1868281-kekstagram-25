import {isEscapeKey} from './util.js';

const modalContainer = document.querySelector('.big-picture');
const modalImg = modalContainer.querySelector('.big-picture__img img');
const modalCaption = modalContainer.querySelector('.social__caption');
const modalLikes = modalContainer.querySelector('.likes-count');
const modalCommentsCountWrapper = modalContainer.querySelector('.social__comment-count');
const modalCommentsCount = modalContainer.querySelector('.comments-count');
const modalComments = modalContainer.querySelector('.social__comments');
const modalComment = modalContainer.querySelector('.social__comment').cloneNode(true);
const modalCommentsLoader = modalContainer.querySelector('.comments-loader');
const modalCloseButton = modalContainer.querySelector('.big-picture__cancel');
const modalCommentsFragment = document.createDocumentFragment();

let COUNTER = 5;
let commentsData = [];

const drawComments = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const commentInfo = arr[i];
    const commentElement = modalComment.cloneNode(true);
    const commentElementImg = commentElement.querySelector('.social__picture');
    commentElementImg.src = commentInfo.avatar;
    commentElement.querySelector('.social__text').textContent = commentInfo.message;
    commentElementImg.alt = commentInfo.name;
    modalCommentsFragment.append(commentElement);
  }
};

const onPopupEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
};

const onModalCloseButtonClick = () => {
  closeModal();
};

const onModalCommentsLoaderClick = (evt) => {
  evt.preventDefault();
  modalComments.innerHTML = '';
  COUNTER += 5;
  const slicedCommentsData = commentsData.slice(0, COUNTER);
  if(slicedCommentsData.length <= COUNTER) {
    modalCommentsLoader.classList.add('hidden');
  }
  modalCommentsCountWrapper.firstChild.textContent = (`${slicedCommentsData.length} из `);
  drawComments(slicedCommentsData);
  modalComments.append(modalCommentsFragment);
};

function closeModal () {
  modalContainer.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onPopupEscKeydown);
  modalCloseButton.removeEventListener('click', onModalCloseButtonClick);
  modalCommentsLoader.removeEventListener('click', onModalCommentsLoaderClick);
  commentsData = [];
  modalCommentsFragment.innerHTML = '';
  COUNTER = 5;
}

function showModal ({url, description, likes, comments}) {
  modalComments.innerHTML = '';
  modalContainer.classList.remove('hidden');
  document.body.classList.add('modal-open');
  modalCommentsCountWrapper.classList.add('hidden');
  modalCommentsLoader.classList.add('hidden');
  modalCloseButton.addEventListener('click', onModalCloseButtonClick);
  document.addEventListener('keydown', onPopupEscKeydown);
  modalCommentsLoader.addEventListener('click', onModalCommentsLoaderClick);
  modalImg.src = url;
  modalCaption.textContent = description;
  modalLikes.textContent = likes;
  modalCommentsCount.textContent = comments.length;
  comments.forEach ((element) => {
    commentsData.push(element);
  });
  modalCommentsCountWrapper.firstChild.textContent = (`${5} из `);
  drawComments(commentsData.slice(0, COUNTER));
  modalComments.append(modalCommentsFragment);

  if (comments.length > COUNTER) {
    modalCommentsCountWrapper.classList.remove('hidden');
    modalCommentsLoader.classList.remove('hidden');
  }
}

export {showModal};
