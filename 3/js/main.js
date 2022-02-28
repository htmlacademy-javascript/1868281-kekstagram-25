const getRandomInRange = (min, max) => {
  let tMin = min;
  let tMax = max;

  if (max < min) {
    tMin = max;
    tMax = min;
  }
  return Math.floor(Math.random() * (tMax - tMin + 1)) + tMin;
};

getRandomInRange(1, 10);

const checkStringLength = (checkString, maxLength) => checkString.length <= maxLength;

checkStringLength(1390, 140);

const PHOTO_DESCRIPTION = [
  'Идеально',
  'Замечательно',
  'Вот так вот',
  'Чё каво?',
  'Воть',
];

const COMMENT_TEXT = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const AUTHOR_NAME = [
  'Артём',
  'Сергей',
  'Дмитрий',
  'Владислав',
  'Пётр',
];

const getRandomArrayElement = (elements) => elements[getRandomInRange(0, elements.length - 1)];

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

console.log(usersPosts);
