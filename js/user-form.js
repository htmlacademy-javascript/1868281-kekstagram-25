import {isEscapeKey} from './util.js';
import {checkStringLength} from './util.js';
import {effects} from './photo-effects.js';
import {sendData} from './api.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadUserPhoto = uploadForm.querySelector('.img-upload__input');
const filterContainer = uploadForm.querySelector('.img-upload__overlay');
const filterImgPreview = uploadForm.querySelector('.img-upload__preview img');
const filterImgEffectsPreviews = uploadForm.querySelectorAll('.effects__preview');
const filterCloseButton = uploadForm.querySelector('.img-upload__cancel');
const scaleControlContainer = uploadForm.querySelector('.img-upload__scale');
const effectsSelector = uploadForm.querySelector('.effects__list');
const hashtagsField = uploadForm.querySelector('.text__hashtags');
const commentField = uploadForm.querySelector('.text__description');
const effectLevelWrapper = uploadForm.querySelector('.effect-level');
const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');
const effectLevelInput = uploadForm.querySelector('.effect-level__value');
const submitButton = uploadForm.querySelector('#upload-submit');
const succesFormTemplate = document.querySelector('#success').content.querySelector('.success');
const succesFormElement = succesFormTemplate.cloneNode(true);
const successFormButton = succesFormElement.querySelector('.success__button');
const errorFormTemplate = document.querySelector('#error').content.querySelector('.error');
const errorFormElement = errorFormTemplate.cloneNode(true);
const errorFormButton = errorFormElement.querySelector('.error__button');
const loadingFormTemplate = document.querySelector('#messages').content.querySelector('.img-upload__message');
const loadingFormElement = loadingFormTemplate.cloneNode(true);
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

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

noUiSlider.create(effectLevelSlider, {
  range: {
    min: 0,
    max: 1,
  },
  start: 1,
  step: 0.1,
  connect: 'lower',
  format: {
    to: (value) => {
      if (Number.isInteger(value)) {
        return value.toFixed(0);
      }
      return value.toFixed(1);
    },
    from: (value) => parseFloat(value),
  },
});

const onEffectsRadioButtonsChange = (evt) => {
  const filterRadioButton = evt.target.value;
  const filterRadioButtonKey = effects[filterRadioButton];
  if (filterRadioButton === 'none') {
    filterImgPreview.style.filter = `${filterRadioButtonKey.filter}`;
    effectLevelWrapper.classList.add('hidden');
  } else {
    effectLevelWrapper.classList.remove('hidden');
    filterImgPreview.className = `effects__preview--${filterRadioButton}`;
    effectLevelSlider.noUiSlider.updateOptions(filterRadioButtonKey);
    effectLevelSlider.noUiSlider.on('update', () => {
      effectLevelInput.value = effectLevelSlider.noUiSlider.get();
      filterImgPreview.style.filter = `${filterRadioButtonKey.filter}(${effectLevelInput.value}${filterRadioButtonKey.unit})`;
    });
  }
};

const pristine = new Pristine(uploadForm, {
  classTo: 'text__wrapper',
  errorClass: 'text__wrapper--invalid',
  successClass: 'text__wraper--valid',
  errorTextParent: 'text__wrapper',
  errorTextTag: 'div',
  errorTextClass: 'text__wrapper-error'
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

pristine.addValidator(
  hashtagsField,
  validateArrayOfHashtags,
  'текст после # должен состоять из букв и чисел, после хэшТега нужно ставить пробел.'
);

const validateDuplicateHashtag = (value) => {
  if (value.length === 0) {
    return true;
  }
  const hashtags = getArrayOfHashtags(value);
  const swapArr = [...new Set(hashtags.map((element) => element.toLowerCase()))];
  return hashtags.length === swapArr.length;
};

pristine.addValidator(
  hashtagsField,
  validateDuplicateHashtag,
  'хэштеги не должны повторяться.',
);

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
  'Не более 5 хешТэгов.'
);

pristine.addValidator(
  commentField,
  checkStringLength,
  'Комментарий не более 140 символов'
);


const onFieldTyping = () => {
  if (!pristine.validate()) {
    submitButton.classList.add('img-upload__submit--disabled');
  } else {
    submitButton.classList.remove('img-upload__submit--disabled');
  }
};

const showPopUp = (element, button) => {
  document.body.append(element);
  document.addEventListener('keydown', onPopupEscKeydown);
  document.addEventListener('click', onOuterClick);
  button.addEventListener('click', onPopupCloseButtonClick);
};

const closePopUp = (element) => {
  document.body.removeChild(element);
  document.removeEventListener('keydown', onPopupEscKeydown);
  document.removeEventListener('click', onOuterClick);
};

function onPopupCloseButtonClick (evt, element) {
  if (evt.target === element) {
    closePopUp(element);
  }
}

function onOuterClick (evt) {
  if(!evt.target.matches('.success__inner') && document.body.contains(succesFormElement)) {
    closePopUp(succesFormElement);
  }
  if(!evt.target.matches('.error__inner') && document.body.contains(errorFormElement)) {
    closePopUp(errorFormElement);
  }
}

const preventMultiSend = (boolean, text) => {
  submitButton.disabled = boolean;
  submitButton.textContent = text;
};

const showLoadingBlock = () => {
  document.body.append(loadingFormElement);
};

const hideLoadingBlock = () => {
  document.body.removeChild(loadingFormElement);
};

const displayErrorPopUp = (title, button) => {
  errorFormElement.querySelector('.error__title').textContent = title;
  errorFormButton.textContent = button;
  showPopUp(errorFormElement, errorFormButton);
};

const setUserFormSubmit = (onSuccess) => {
  uploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristine.validate();
    if (isValid) {
      preventMultiSend(true, 'Публикуем...');
      showLoadingBlock();
      filterContainer.classList.add('hidden');
      sendData(
        () => {
          onSuccess();
          showPopUp(succesFormElement, successFormButton);
          hideLoadingBlock();
          preventMultiSend(false, 'Опубликовать');
        },
        () => {
          displayErrorPopUp('Ошибка загрузки файла', 'Загрузить другой файл');
          hideLoadingBlock();
          preventMultiSend(false, 'Опубликовать');
          closeUserPhotoUpload();
        },
        new FormData(evt.target),
      );
    }
  });
};

setUserFormSubmit(closeUserPhotoUpload);

function onPopupEscKeydown (evt) {
  if (isEscapeKey(evt) && !document.activeElement.matches('.text__hashtags') && !document.activeElement.matches('.text__description')) {
    evt.preventDefault();
    closeUserPhotoUpload();
  }
  if(isEscapeKey(evt) && document.body.contains(succesFormElement)) {
    evt.preventDefault();
    closePopUp(succesFormElement);
  }
  if(isEscapeKey(evt) && document.body.contains(errorFormElement)) {
    evt.preventDefault();
    closePopUp(errorFormElement);
  }
}

const onUploadModalCloseButtonClick = () => {
  closeUserPhotoUpload();
};

const onUploadInputAddPhoto = () => {
  const file = uploadUserPhoto.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((format) => fileName.endsWith(format));
  if (matches) {
    filterImgPreview.src = URL.createObjectURL(file);
    filterImgEffectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
    });
    filterContainer.classList.remove('hidden');
    document.body.classList.add('modal-open');
    effectLevelWrapper.classList.add('hidden');
    filterCloseButton.addEventListener('click', onUploadModalCloseButtonClick);
    document.addEventListener('keydown', onPopupEscKeydown);
    scaleControlContainer.addEventListener('click', onFilterScaleButtonsClick);
    effectsSelector.addEventListener('change', onEffectsRadioButtonsChange);
    hashtagsField.addEventListener('input', onFieldTyping);
    commentField.addEventListener('input', onFieldTyping);
  }
  if (!matches) {
    displayErrorPopUp('Недопустимый формат фотографии', 'Загрузить фото .jpg .jpeg .png .gif');
    uploadForm.reset();
  }
};


uploadUserPhoto.addEventListener('change', onUploadInputAddPhoto);

function closeUserPhotoUpload () {
  filterContainer.classList.add('hidden');
  document.body.classList.remove('modal-open');
  filterCloseButton.removeEventListener('click', onUploadModalCloseButtonClick);
  document.removeEventListener('keydown', onPopupEscKeydown);
  scaleControlContainer.removeEventListener('click', onFilterScaleButtonsClick);
  effectsSelector.removeEventListener('change', onEffectsRadioButtonsChange);
  hashtagsField.removeEventListener('input', onFieldTyping);
  commentField.removeEventListener('input', onFieldTyping);
  filterImgPreview.style = '';
  filterImgPreview.className = '';
  uploadForm.reset();
}

export {displayErrorPopUp};
