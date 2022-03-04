import {getRandomInRange, getRandomArrayElement} from './util.js';
import {PHOTO_DESCRIPTION, COMMENT_TEXT, AUTHOR_NAME} from './data-value.js';

const createUserComment = (_elem, id) => (
  {
    id,
    avatar: `img/avatar-${getRandomInRange(1, 6)}.svg`,
    message: getRandomArrayElement(COMMENT_TEXT),
    name: getRandomArrayElement(AUTHOR_NAME),
  }
);

const createUserPost = (_elem, id) => {
  const postId = id + 1;
  const commentsCount = getRandomInRange(2, 10);
  const comments = Array.from({length: commentsCount}, createUserComment);

  return {
    id: postId,
    url: `photos/${postId}.jpg`,
    description: getRandomArrayElement(PHOTO_DESCRIPTION),
    likes: getRandomInRange(15, 200),
    comments
  };
};

const usersPosts = Array.from({length: 25}, createUserPost);

export {usersPosts};
