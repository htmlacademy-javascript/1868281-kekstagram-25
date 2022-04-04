import {renderMiniPosts, showSortingBlock} from './picture.js';
import './user-form.js';
import {getData} from './api.js';
import {setPicturesFilter} from './pictures-sort.js';

getData((data) => {
  showSortingBlock();
  renderMiniPosts(data);
  setPicturesFilter(data);
});

