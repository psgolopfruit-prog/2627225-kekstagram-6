import {openBigPicture} from './bigPicture.js';

const pictures = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const createPictureElement = (picture) => {
  const {url, description, comments, likes} = picture;
  const pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__img').alt = description;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPicture(picture);
  });

  return pictureElement;
};

const renderPhotos = (photos) => {
  const picturesFragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    picturesFragment.appendChild(createPictureElement(photo));
  });

  pictures.appendChild(picturesFragment);
};

const removePictures = () => {
  const images = document.querySelectorAll('.picture');
  if (images) {
    images.forEach((element) => {
      element.remove();
    });
  }
};

export {renderPhotos, removePictures};
