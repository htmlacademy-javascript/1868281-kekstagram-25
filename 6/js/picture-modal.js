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

const onPopupEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
};

function closeModal () {
  modalContainer.classList.add('hidden');
  modalCommentsCountWrapper.classList.remove('hidden');
  modalCommentsLoader.classList.remove('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onPopupEscKeydown);
}

modalCloseButton.addEventListener('click', () => {
  closeModal();
});

const showModal = ({url, description, likes, comments}) => {
  modalContainer.classList.remove('hidden');
  modalCommentsCountWrapper.classList.add('hidden');
  modalCommentsLoader.classList.add('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onPopupEscKeydown);
  modalImg.src = url;
  modalCaption.textContent = description;
  modalLikes.textContent = likes;
  modalCommentsCount.textContent = comments.length;

  const modalCommentsFragment = document.createDocumentFragment();

  comments.forEach(
    ({avatar, message, name}) => {
      const commentElement = modalComment.cloneNode(true);
      const commentElementImg = commentElement.querySelector('.social__picture');
      commentElementImg.src = avatar;
      commentElement.querySelector('.social__text').textContent = message;
      commentElementImg.alt = name;
      modalCommentsFragment.append(commentElement);
    }
  );
  modalComments.innerHTML = '';
  modalComments.append(modalCommentsFragment);
};

export {showModal};
