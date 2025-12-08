import { createPhotoDescriptions } from './data.js';
import { openBigPicture } from './bigPicture.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const photosData = createPhotoDescriptions();

const renderPhoto = (picture) => {
  const { url, description, likes, comments } = picture;
  const pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__img').alt = description;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;
  pictureElement.querySelector('.picture__likes').textContent = likes;

  const onPictureElementClick = (evt) => {
    evt.preventDefault();
    openBigPicture(picture);
  };

  pictureElement.addEventListener('click', onPictureElementClick);

  return pictureElement;
};

const renderPhotos = (objects) => {
  const fragment = document.createDocumentFragment();
  
  objects.forEach((item) => {
    fragment.appendChild(renderPhoto(item));
  });
  
  picturesContainer.appendChild(fragment);
};

renderPhotos(photosData);
