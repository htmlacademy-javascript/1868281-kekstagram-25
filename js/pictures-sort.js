import {renderMiniPosts} from './picture.js';
import {getRandomInRange, debounce} from './util.js';

const sortPicturesContainer = document.querySelector('.img-filters');
const filtersForm = sortPicturesContainer.querySelector('.img-filters__form');
const defaultFilter = filtersForm.querySelector('#filter-default');
const randomFilter = filtersForm.querySelector('#filter-random');
const discussedFilter = filtersForm.querySelector('#filter-discussed');

const previewsContainer = document.querySelector('.pictures');

const MAX_RANDOM_ELEMENTS = 10;
const RERENDER_DELAY = 500;

const deletePreviwesElements = (pictures) => {
  pictures.forEach((el) => {
    previewsContainer.removeChild(el);
  });
};

const toggleActiveFilter = (selectedFilter) => {
  const activeFilter = filtersForm.querySelector('.img-filters__button--active');
  activeFilter.classList.remove('img-filters__button--active');
  selectedFilter.classList.add('img-filters__button--active');
};

const shuffleArray = (data) => {
  const dataCopy = data.slice();
  const iterations = MAX_RANDOM_ELEMENTS < dataCopy.length ? MAX_RANDOM_ELEMENTS : dataCopy.length - 1;
  for (let i = 0; i < iterations; i++) {
    const randomIndex = getRandomInRange(dataCopy.length, i);
    const currentElement = dataCopy[i];
    dataCopy[i] = dataCopy[randomIndex];
    dataCopy[randomIndex] = currentElement;
  }
  return dataCopy;
};

const onFilterButtonsClick = (data) => (evt) => {
  const previews = previewsContainer.querySelectorAll('.picture');
  const filterTarget = evt.target;
  let result;

  if (filterTarget.closest('button')) {
    deletePreviwesElements(previews);
    toggleActiveFilter(filterTarget);
  }
  if(filterTarget === defaultFilter) {
    result = data.slice();
  }
  if(filterTarget === randomFilter) {
    result = shuffleArray(data).slice(0, MAX_RANDOM_ELEMENTS);
  }
  if(filterTarget === discussedFilter) {
    const compareCommentsLength = (second, first) => first.comments.length - second.comments.length;
    result = data.slice().sort(compareCommentsLength);
  }
  renderMiniPosts(result);
};

const onFilterButtonsClickWithDebounce = (data) => debounce(onFilterButtonsClick(data), RERENDER_DELAY);

const setPicturesFilter = (data) => {
  filtersForm.addEventListener('click', onFilterButtonsClickWithDebounce(data));
};


export {setPicturesFilter};
