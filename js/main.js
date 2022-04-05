import {renderMiniPosts, showSortingBlock} from './picture.js';
import {displayErrorPopUp} from'./user-form.js';
import {getData} from './api.js';
import {setPicturesFilter} from './pictures-sort.js';

getData(
  (data) => {
    showSortingBlock();
    renderMiniPosts(data);
    setPicturesFilter(data);
  },
  () => {
    displayErrorPopUp('Ошибка запроса на сервер', 'Попробуйте позднее');
  }
);
