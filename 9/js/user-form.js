import {isEscapeKey} from './util.js';
import {checkStringLength} from './util.js';
import {effects} from './photo-effects.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadUserPhoto = uploadForm.querySelector('.img-upload__input');
const filterContainer = uploadForm.querySelector('.img-upload__overlay');
const filterImgPreview = uploadForm.querySelector('.img-upload__preview img');
const filterCloseButton = uploadForm.querySelector('.img-upload__cancel');
const scaleControlContainer = uploadForm.querySelector('.img-upload__scale');
const effectsSelector = uploadForm.querySelector('.effects__list');
const hashtagsField = uploadForm.querySelector('.text__hashtags');
const commentField = uploadForm.querySelector('.text__description');
const effectLevelWrapper = uploadForm.querySelector('.effect-level');
const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');
const effectLevelInput = uploadForm.querySelector('.effect-level__value');

noUiSlider.create(effectLevelSlider, {
  range: {
    min: 0,
    max: 1,
  },
  start: 1,
  step: 0.1,
  connect: 'lower',
  format: {
    to: function (value) {
      return value;
    },
    from: function (value) {
      return parseFloat(value);
    },
  },
});

const onEffectsRadioButtonsChange = (evt) => {
  const filterRadioButton = evt.target.value;
  if (filterRadioButton === 'none') {
    filterImgPreview.style.filter = `${effects[filterRadioButton]['filter']}`;
    effectLevelWrapper.classList.add('hidden');
  } else {
    effectLevelWrapper.classList.remove('hidden');
    filterImgPreview.className = `effects__preview--${filterRadioButton}`;
    effectLevelSlider.noUiSlider.updateOptions({
      range: {
        min: effects[filterRadioButton]['min'],
        max: effects[filterRadioButton]['max'],
      },
      start: effects[filterRadioButton]['start'],
      step : effects[filterRadioButton]['step'],
    });
    effectLevelSlider.noUiSlider.on('update', () => {
      effectLevelInput.value = effectLevelSlider.noUiSlider.get();
      filterImgPreview.style.filter = `${effects[filterRadioButton]['filter']}(${effectLevelInput.value}${effects[filterRadioButton]['unit']})`;
    });
  }
};

const onFilterScaleButtonsClick = (evt) => {
  const input = scaleControlContainer.querySelector('.scale__control--value');
  const valueStep = 25;
  const inputIntValue = parseInt(input.value, 10);
  let scaleValue;
  const scaleButton = evt.target;
  if (scaleButton.matches('.scale__control--bigger') && inputIntValue < 100) {
    scaleValue = inputIntValue + valueStep;
    input.value = `${scaleValue}%`;
  }
  if (scaleButton.matches('.scale__control--smaller') && inputIntValue > 25) {
    scaleValue = inputIntValue - valueStep;
    input.value = `${scaleValue}%`;
  }

  const imgScale = scaleValue / 100;
  filterImgPreview.style.transform = `scale(${imgScale})`;
};

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__text',
  errorClass: 'img-upload__text--invalid',
  successClass: 'img-upload__text--valid',
  errorTextParent: 'img-upload__text',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__form-error'
});

const getArrayOfHashtags = (value) => {
  const hashtags = value.split(/\s+/g);
  if (hashtags[0] === ''){
    hashtags.shift();
  }
  if (hashtags[hashtags.length - 1] === '') {
    hashtags.pop();
  }
  return hashtags;
};

const validateArrayOfHashtags = (value) => {
  if (value.length === 0) {
    return true;
  }
  const regularExpression = /^#[A-Za-zА-Яа-яЕё0-9]{1,19}$/;
  const hashtags = getArrayOfHashtags(value).map((element) =>regularExpression.test(element));
  return !hashtags.includes(false);
};

const validateDuplicateHashtag = (value) => {
  if (value.length === 0) {
    return true;
  }
  const hashtags = getArrayOfHashtags(value);
  const swapArr = [...new Set(hashtags.map((element) => element.toLowerCase()))];
  return hashtags.length === swapArr.length;
};

const validateMaxHashTagsNumber = (value) => {
  if (value.length === 0) {
    return true;
  }
  const hashtags = getArrayOfHashtags(value);
  return hashtags.length <= 5;
};

pristine.addValidator(
  hashtagsField,
  validateMaxHashTagsNumber,
  'Не более 5 хешТэгов'
);

pristine.addValidator(
  hashtagsField,
  validateDuplicateHashtag,
  'хэштеги не должны повторяться'
);

pristine.addValidator(
  hashtagsField,
  validateArrayOfHashtags,
  'текст после # должен состоять из букв и чисел, после хэшТега нужно ставить пробел'
);

pristine.addValidator(
  commentField,
  checkStringLength,
  'Комментарий не более 140 символов'
);

const onUploadModalSubmitButtonClick = (evt) => {
  evt.preventDefault();
  pristine.validate();
};

const onPopupEscKeydown = (evt) => {
  if (isEscapeKey(evt) && !document.activeElement.matches('.text__hashtags') && !document.activeElement.matches('.text__description')) {
    evt.preventDefault();
    closeUserPhotoUpload();
  }
};

const onUploadModalCloseButtonClick = () => {
  closeUserPhotoUpload();
};

const onUploadInputAddPhoto = () => {
  filterContainer.classList.remove('hidden');
  document.body.classList.add('modal-open');
  effectLevelWrapper.classList.add('hidden');
  filterCloseButton.addEventListener('click', onUploadModalCloseButtonClick);
  document.addEventListener('keydown', onPopupEscKeydown);
  scaleControlContainer.addEventListener('click', onFilterScaleButtonsClick);
  effectsSelector.addEventListener('change', onEffectsRadioButtonsChange);
  uploadForm.addEventListener('submit', onUploadModalSubmitButtonClick);
};

uploadUserPhoto.addEventListener('change', onUploadInputAddPhoto);

function closeUserPhotoUpload () {
  filterContainer.classList.add('hidden');
  document.body.classList.remove('modal-open');
  filterCloseButton.removeEventListener('click', onUploadModalCloseButtonClick);
  document.removeEventListener('keydown', onPopupEscKeydown);
  scaleControlContainer.removeEventListener('click', onFilterScaleButtonsClick);
  effectsSelector.removeEventListener('change', onEffectsRadioButtonsChange);
  uploadForm.removeEventListener('submit', onUploadModalSubmitButtonClick);
  hashtagsField.value = '';
  commentField.value = '';
  filterImgPreview.style = '';
  filterImgPreview.className = '';
}
