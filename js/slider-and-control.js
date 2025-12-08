const Zoom = {
  MIN: 25,
  MAX: 100,
  STEP: 25,
};

const minusButton = document.querySelector('.scale__control--smaller');
const plusButton = document.querySelector('.scale__control--bigger');
const controlValueElement = document.querySelector('input[name="scale"]');

const sliderField = document.querySelector('.img-upload__effect-level');
const sliderElement = sliderField.querySelector('.effect-level__slider');
const sliderElementValue = sliderField.querySelector('.effect-level__value');

const previewContainer = document.querySelector('.img-upload__preview');
const picture = previewContainer.querySelector('img');

const effectRadios = document.querySelectorAll('input[name="effect"]');

const Effects = {
  none: {
    filter: '',
    unit: '',
    min: 0,
    max: 0,
    step: 0,
  },
  chrome: {
    filter: 'grayscale',
    unit: '',
    min: 0,
    max: 1,
    step: 0.1,
  },
  sepia: {
    filter: 'sepia',
    unit: '',
    min: 0,
    max: 1,
    step: 0.1,
  },
  marvin: {
    filter: 'invert',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
  },
  phobos: {
    filter: 'blur',
    unit: 'px',
    min: 0,
    max: 3,
    step: 0.1,
  },
  heat: {
    filter: 'brightness',
    unit: '',
    min: 1,
    max: 3,
    step: 0.1,
  },
};

sliderField.classList.add('hidden');

const resetSlider = () => {
  if (sliderElement.noUiSlider) {
    sliderElement.noUiSlider.destroy();
  }
};

const createSlider = (effectName) => {
  const effect = Effects[effectName];
  
  resetSlider();
  
  if (effectName === 'none') {
    picture.style.filter = '';
    sliderField.classList.add('hidden');
    return;
  }
  
  sliderField.classList.remove('hidden');
  
  noUiSlider.create(sliderElement, {
    range: {
      min: effect.min,
      max: effect.max,
    },
    start: effect.max,
    step: effect.step,
    connect: 'lower',
  });

  sliderElement.noUiSlider.on('update', () => {
    const currentValue = sliderElement.noUiSlider.get();
    sliderElementValue.value = currentValue;
    picture.style.filter = `${effect.filter}(${currentValue}${effect.unit})`;
  });
};

effectRadios.forEach((radio) => {
  radio.addEventListener('change', (evt) => {
    createSlider(evt.target.value);
  });
});

const resetSliderToNone = () => {
  createSlider('none');
  const noneRadio = document.querySelector('#effect-none');
  noneRadio.checked = true;
};

const changeZoom = (factor = 1) => {
  let size = parseInt(controlValueElement.value, 10) + (Zoom.STEP * factor);

  if (size < Zoom.MIN) {
    size = Zoom.MIN;
  }

  if (size > Zoom.MAX) {
    size = Zoom.MAX;
  }

  controlValueElement.value = `${size}%`;
  previewContainer.style.transform = `scale(${size / 100})`;
};

const onMinusButtonClick = () => {
  changeZoom(-1);
};

const onPlusButtonClick = () => {
  changeZoom();
};

const resetControlToStandart = () => {
  controlValueElement.value = '100%';
  previewContainer.style.transform = 'scale(1)';
};

minusButton.addEventListener('click', onMinusButtonClick);
plusButton.addEventListener('click', onPlusButtonClick);

export { resetSliderToNone, resetControlToStandart };
