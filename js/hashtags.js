import {isEscapeKey} from './util.js';
import { openBigPicture } from './bigPicture.js';

const MAX_HASHTAGS_COUNT = 5;
const MAX_SYMBOLS = 20;

const form = document.querySelector('.img-upload__form');
const formOverlay = form.querySelector('.img-upload__overlay');
const body = document.querySelector('body');
const inputHashtag = form.querySelector('.text__hashtags');
const inputComment = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');
const fileInput = form.querySelector('.img-upload__input');
const cancelButton = form.querySelector('.img-upload__cancel');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
});

const showModal = () => {
  formOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

const hideModal = () => {
  form.reset();
  pristine.reset();
  formOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
};

const isTextFieldFocused = () => document.activeElement === inputHashtag
  || document.activeElement === inputComment;

let errorMessage = '';

const error = () => errorMessage;

const hashtagsHandler = (value) => {
  errorMessage = '';

  const inputText = value.toLowerCase().trim();

  if (!inputText) {
    return true;
  }

  const inputArray = inputText.split(/\s+/);

  const rules = [
    {
      check: inputArray.length > MAX_HASHTAGS_COUNT,
      error: `Нельзя указать более ${MAX_HASHTAGS_COUNT} хэш-тегов`,
    },
    {
      check: inputArray.some((item) => item.length > MAX_SYMBOLS),
      error: `Максимальная длина одного хэш-тега ${MAX_SYMBOLS} символов, включая решётку`,
    },
    {
      check: inputArray.some((item) => item.indexOf('#', 1) >= 1),
      error: 'Хэш-теги разделяются пробелами',
    },
    {
      check: inputArray.some((item) => item[0] !== '#'),
      error: 'Хэш-тег должен начинаться с символа #',
    },
    {
      check: inputArray.some((item, num, arr) => arr.includes(item, num + 1)),
      error: 'Хэш-теги не должны повторяться',
    },
    {
      check: inputArray.some((item) => !/^#[a-zа-яё0-9]{1,19}/i.test(item)),
      error: 'Хэш-тег содержит недопустимые символы',
    },
  ];

  return rules.every((rule) => {
    const isInvalid = rule.check;
    if (isInvalid) {
      errorMessage = rule.error;
    }
    return !isInvalid;
  });
};

pristine.addValidator(inputHashtag, hashtagsHandler, error);

const onHashtagInput = () => {
  if (pristine.validate()) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
};

inputHashtag.addEventListener('input', onHashtagInput);

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt) && !isTextFieldFocused()) {
    evt.preventDefault();
    hideModal();
  }
};

const onCancelButtonClick = () => {
  hideModal();
};

const onFileInputChange = () => {
  showModal();
};

fileInput.addEventListener('change', onFileInputChange);
cancelButton.addEventListener('click', onCancelButtonClick);
