import { isEscapeKey } from './util.js';

export const openBigPicture = ({ url, description, likes, comments }) => {
  const bigPictureElement = document.querySelector('.big-picture');
  bigPictureElement.classList.remove('hidden');

  bigPictureElement.querySelector('.big-picture__img img').src = url;
  bigPictureElement.querySelector('.likes-count').textContent = likes;
  bigPictureElement.querySelector('.comments-count').textContent = comments.length;
  bigPictureElement.querySelector('.social__caption').textContent = description;

  const commentsContainer = bigPictureElement.querySelector('.social__comments');
  commentsContainer.innerHTML = '';
  comments.forEach(({ avatar, message, name }) => {
    const commentElement = document.createElement('li');
    commentElement.classList.add('social__comment');
    commentElement.innerHTML = `
      <img class="social__picture" src="${avatar}" alt="${name}" width="35" height="35">
      <p class="social__text">${message}</p>
    `;
    commentsContainer.appendChild(commentElement);
  });

  bigPictureElement.querySelector('.social__comment-count').classList.add('hidden');
  bigPictureElement.querySelector('.comments-loader').classList.add('hidden');
  document.body.classList.add('.modal-open');
};

const closeBigPicture = () => {
  const bigPictureElement = document.querySelector('.big-picture');
  bigPictureElement.classList.add('hidden');
};

const closeButton = document.querySelector('.big-picture__cancel');
closeButton.addEventListener('click', closeBigPicture);

document.addEventListener('keydown', (evt) => {
  evt.preventDefault();
  if (isEscapeKey) {
    closeBigPicture();
  }
});
