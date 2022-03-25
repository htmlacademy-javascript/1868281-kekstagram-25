const effects = {
  none: {
    min: 0,
    max: 10,
    start: 10,
    step: 1,
    filter: 'none',
    unit: '',
  },
  chrome: {
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    filter: 'grayscale',
    unit: '',
  },
  sepia: {
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    filter: 'sepia',
    unit: '',
  },
  marvin: {
    min: 0,
    max: 100,
    start: 100,
    step: 1,
    filter: 'invert',
    unit: '%',
  },
  phobos: {
    min: 0,
    max: 3,
    start: 3,
    step: 0.1,
    filter: 'blur',
    unit: 'px',
  },
  heat: {
    min: 1,
    max: 3,
    start: 3,
    step: 0.1,
    filter: 'brightness',
    unit: '',
  },
};

export {effects};
