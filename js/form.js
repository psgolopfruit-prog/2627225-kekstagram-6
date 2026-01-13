import {isEscapeKey} from './util.js';
import {resetSliderToNone, resetControlToStandart} from './slider-and-control.js';
import { uploadData } from './fetch.js';
import { showErrorMessage, showSuccessMessage } from './messages.js';

const MAX_HASHTAGS_COUNT = 5;
const MAX_SYMBOLS = 20;
const VALID_SYMBOLS = /^#[a-zа-яё0-9]{1,19}$/i;

const form = document.querySelector('.img-upload__form');
const formOverlay = form.querySelector('.img-upload__overlay');
const body = document.querySelector('body');
const inputHashtag = form.querySelector('.text__hashtags');
const inputComment = form.querySelector('.text__description');
const fileInput = form.querySelector('#upload-file');
const cancelButton = form.querySelector('#upload-cancel');
const submitButton = form.querySelector('.img-upload__submit');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'form__item--invalid',
  successClass: 'form__item--valid',
  errorTextParent: 'img-upload__field-wrapper',
});

let errorMessage = '';

const error = () => errorMessage;

const isTextFieldFocused = () =>
  document.activeElement === inputHashtag ||
  document.activeElement === inputComment;

const hashtagsHandler = (value) => {
  errorMessage = '';
  const inputText = value.toLowerCase().trim();

  if (!inputText) {
    return true;
  }

  const inputArray = inputText.split(/\s+/);

  const rules = [
    {
      check: inputArray.some((item) => item.length === 1 && item[0] === '#'),
      error: 'Хэш-тэг не может состоять из одного символа #'
    },
    {
      check: inputArray.length > MAX_HASHTAGS_COUNT,
      error: `Нельзя указать более ${MAX_HASHTAGS_COUNT} хэш-тегов`
    },
    {
      check: inputArray.some((item) => item.length > MAX_SYMBOLS),
      error: `Максимальная длина одного хэш-тега ${MAX_SYMBOLS} символов, включая решётку`
    },
    {
      check: inputArray.some((item) => item.indexOf('#', 1) >= 1),
      error: 'Хэш-теги разделяются пробелами'
    },
    {
      check: inputArray.some((item) => item[0] !== '#'),
      error: 'Хэш-тег должен начинаться с символа #'
    },
    {
      check: inputArray.some((item, num, arr) => arr.includes(item, num + 1)),
      error: 'Хэш-теги не должны повторяться'
    },
    {
      check: inputArray.some((item) => !VALID_SYMBOLS.test(item)),
      error: 'Хэш-тег содержит недопустимые символы'
    }
  ];

  return rules.every((rule) => {
    const isInvalid = rule.check;
    if (isInvalid) {
      errorMessage = rule.error;
    }
    return !isInvalid;
  });
};

const hideModal = () => {
  form.reset();
  pristine.reset();
  resetSliderToNone();
  resetControlToStandart();
  submitButton.disabled = false;
  formOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
};

const isErrorMessageOpen = () =>
  document.querySelector('.error') !== null;

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt) && !isTextFieldFocused() && !isErrorMessageOpen()) {
    evt.preventDefault();
    hideModal();
  }
}

const showModal = () => {
  formOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

const onHashtagInput = () => {
  if (pristine.validate()) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
};

const onCancelButtonClick = () => {
  hideModal();
};

const onFileInputChange = () => {
  showModal();
};

const toggleSubmitButton = (isDisabled = false) => {
  submitButton.disabled = isDisabled;
  submitButton.textContent = isDisabled ? 'Публикую...' : 'Опубликовать';
};

const onFormSubmit = (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();

  if (isValid) {
    toggleSubmitButton(true);
    uploadData(
      showSuccessMessage,
      showErrorMessage,
      'POST',
      new FormData(evt.target)
    );
  }
};

// Инициализация
pristine.addValidator(inputHashtag, hashtagsHandler, error);

form.addEventListener('submit', onFormSubmit);
inputHashtag.addEventListener('input', onHashtagInput);
fileInput.addEventListener('change', onFileInputChange);
cancelButton.addEventListener('click', onCancelButtonClick);

export { hideModal, toggleSubmitButton };
