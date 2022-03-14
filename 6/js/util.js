const getRandomInRange = (min, max) => {
  let tMin = min;
  let tMax = max;

  if (max < min) {
    tMin = max;
    tMax = min;
  }
  return Math.floor(Math.random() * (tMax - tMin + 1)) + tMin;
};

const getRandomArrayElement = (elements) => elements[getRandomInRange(0, elements.length - 1)];

const checkStringLength = (checkString, maxLength) => checkString.length <= maxLength;

checkStringLength(1390, 140);

const isEscapeKey = (evt) => evt.key === 'Escape';

export{getRandomInRange, getRandomArrayElement, isEscapeKey};
