import { isEscapeKey } from './util.js';

export const openBigPicture = ({ url, description, likes, comments }) => {
  const bigPictureElement = document.querySelector('.big-picture');
  const loadMoreButton = bigPictureElement.querySelector('.comments-loader');
  bigPictureElement.classList.remove('hidden');

  bigPictureElement.querySelector('.big-picture__img img').src = url;
  bigPictureElement.querySelector('.likes-count').textContent = likes;
  bigPictureElement.querySelector('.comments-count').textContent = comments.length;
  bigPictureElement.querySelector('.social__caption').textContent = description;
  document.body.classList.add('modal-open');

  const commentsContainer = bigPictureElement.querySelector('.social__comments');
  commentsContainer.innerHTML = '';
  let currentCommentIndex = 0;
  const commentsToShow = 5;
  const renderComments = () => {
    const commentsSlice = comments.slice(currentCommentIndex, currentCommentIndex + commentsToShow);
    currentCommentIndex += commentsToShow;
    const commentsContainerCounter = bigPictureElement.querySelector('.social__comment-count');
    const minCurrentIndexOrCommentsLength = Math.min(currentCommentIndex, comments.length);
    commentsContainerCounter.innerHTML = `${minCurrentIndexOrCommentsLength} из <span class="comments-count">${comments.length}</span> комментариев`;
    commentsSlice.forEach(({ avatar, message, name }) => {
      const commentElement = document.createElement('li');
      commentElement.classList.add('social__comment');
      commentElement.innerHTML = `
        <img class="social__picture" src="${avatar}" alt="${name}" width="35" height="35">
        <p class="social__text">${message}</p>
      `;
      commentsContainer.appendChild(commentElement);
    });

    if (currentCommentIndex >= comments.length) {
      loadMoreButton.classList.add('hidden');
    } else {
      loadMoreButton.classList.remove('hidden');
    }
  };
  renderComments();
  loadMoreButton.addEventListener('click', renderComments);
};

const closeBigPicture = () => {
  const bigPictureElement = document.querySelector('.big-picture');
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

document.addEventListener('keydown', (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
});

const closeButton = document.querySelector('.big-picture__cancel');
closeButton.addEventListener('click', () => {
  closeBigPicture();
});
