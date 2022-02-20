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
