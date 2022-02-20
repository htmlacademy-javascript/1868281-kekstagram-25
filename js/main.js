function getRandomInRange(min, max) {
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  if (max < min) {
    randomNumber = Math.floor(Math.random() * (min - max + 1)) + max;
  }
  return randomNumber;
}

getRandomInRange(1, 10);

function checkInputLength(field, maxLength) {
  const OPTIMAL_LENGTH= field.value.length <= maxLength;
  if (OPTIMAL_LENGTH) {
    return true;
  }
  return false;
}

checkInputLength('.text__description', 140);
