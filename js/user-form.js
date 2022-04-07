import {isEscapeKey} from './util.js';
import {effects} from './photo-effects.js';
import {serverRequest} from './api.js';
import {PopUpsErrorsText} from './error-popup-text.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadUserPhoto = uploadForm.querySelector('.img-upload__input');
const filterContainer = uploadForm.querySelector('.img-upload__overlay');
const filterImgPreview = uploadForm.querySelector('.img-upload__preview img');
const filterImgEffectsPreviews = uploadForm.querySelectorAll('.effects__preview');
const filterCloseButton = uploadForm.querySelector('.img-upload__cancel');
const scaleControlContainer = uploadForm.querySelector('.img-upload__scale');
const scaleControlInput = scaleControlContainer.querySelector('.scale__control--value');
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
const VALUE_STEP = 25;
const MAX_VALUE = 100;
const MIN_VALUE = 25;
const HASHTAG_FORMAT = /^#[A-Za-zА-Яа-яЕё0-9]{1,19}$/;
const MAX_STRING_LENGTH = 140;
const MAX_HASHTAGS_AMOUNT = 5;
const MAX_HASHTAG_LENGTH = 20;
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const onFilterScaleButtonsClick = (evt) => {
  const inputIntValue = parseInt(scaleControlInput.value, 10);
  const scaleButton = evt.target;
  let scaleValue;
  if (scaleButton.matches('.scale__control--bigger') && inputIntValue < MAX_VALUE) {
    scaleValue = inputIntValue + VALUE_STEP;
    scaleControlInput.value = `${scaleValue}%`;
  }
  if (scaleButton.matches('.scale__control--smaller') && inputIntValue > MIN_VALUE) {
    scaleValue = inputIntValue - VALUE_STEP;
    scaleControlInput.value = `${scaleValue}%`;
  }

  const imgScale = scaleValue / MAX_VALUE;
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
  const hashtags = getArrayOfHashtags(value).map((element) => HASHTAG_FORMAT.test(element));
  return !hashtags.includes(false);
};

pristine.addValidator(
  hashtagsField,
  validateArrayOfHashtags,
  `текст после # должен состоять из букв и чисел.
   максимальная длинна одного хэштега ${MAX_HASHTAG_LENGTH} символов.
   после хэштега нужно ставить пробел.`
);

const validateDuplicateHashtag = (value) => {
  const hashtags = getArrayOfHashtags(value);
  const newHashtags = [...new Set(hashtags.map((element) => element.toLowerCase()))];
  return hashtags.length === newHashtags.length;
};

pristine.addValidator(
  hashtagsField,
  validateDuplicateHashtag,
  'хэштеги не должны повторяться.',
);

const validateMaxHashTagsNumber = (value) => {
  const hashtags = getArrayOfHashtags(value);
  return hashtags.length <= MAX_HASHTAGS_AMOUNT;
};

pristine.addValidator(
  hashtagsField,
  validateMaxHashTagsNumber,
  `Не более ${MAX_HASHTAGS_AMOUNT} хешТэгов.`
);

const checkStringLength = (value) => value.length <= MAX_STRING_LENGTH;

pristine.addValidator(
  commentField,
  checkStringLength,
  `Комментарий не более ${MAX_STRING_LENGTH} символов.`
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

const preventMultiSend = (boolean) => {
  submitButton.disabled = boolean;
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
      preventMultiSend(true);
      showLoadingBlock();
      filterContainer.classList.add('hidden');
      serverRequest(
        () => {
          onSuccess();
          showPopUp(succesFormElement, successFormButton);
          hideLoadingBlock();
          preventMultiSend(false);
        },
        () => {
          displayErrorPopUp(PopUpsErrorsText.POST.HEADING, PopUpsErrorsText.POST.BUTTON);
          hideLoadingBlock();
          preventMultiSend(false);
          closeUserPhotoUpload();
        },
        'POST',
        new FormData(uploadForm),
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
  const url = URL.createObjectURL(file);
  if (matches) {
    filterImgPreview.src = url;
    filterImgEffectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${url})`;
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
  } else {
    displayErrorPopUp(PopUpsErrorsText.FORMAT.HEADING, PopUpsErrorsText.FORMAT.BUTTON);
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
