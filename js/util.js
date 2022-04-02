const getRandomInRange = (min, max) => {
  let tMin = min;
  let tMax = max;

  if (max < min) {
    tMin = max;
    tMax = min;
  }
  return Math.floor(Math.random() * (tMax - tMin)) + tMin;
};

const getRandomArrayElement = (elements) => elements[getRandomInRange(0, elements.length - 1)];

const maxStringLength = 140;
const checkStringLength = (value) => value.length <= maxStringLength;

const isEscapeKey = (evt) => evt.key === 'Escape';

const debounce = (callback, timeoutDelay) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export{getRandomInRange, getRandomArrayElement, isEscapeKey, checkStringLength, debounce};
