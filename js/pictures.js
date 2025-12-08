import { createPictures } from './data.js';
import { openBigPicture } from './bigPicture.js';

const pictureList = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const pictures = createPictures();
const similarListFragment = document.createDocumentFragment();

pictures.forEach((photo) => {
  const { url, description, likes, comments } = photo;
  const picture = pictureTemplate.cloneNode(true);
  picture.querySelector('.picture__img').src = url;
  picture.querySelector('.picture__img').alt = description;
  picture.querySelector('.picture__comments').textContent = comments.length;
  picture.querySelector('.picture__likes').textContent = likes;
  picture.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPicture(photo);
  });
  similarListFragment.appendChild(picture);
});

pictureList.appendChild(similarListFragment);
