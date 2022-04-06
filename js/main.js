import {renderMiniPosts, showSortingBlock} from './picture.js';
import {displayErrorPopUp} from'./user-form.js';
import {serverRequest} from './api.js';
import {setPicturesFilter} from './pictures-sort.js';
import {PopUpsErrorsText} from './error-popup-text.js';

serverRequest(
  (data) => {
    showSortingBlock();
    renderMiniPosts(data);
    setPicturesFilter(data);
  },
  () => {
    displayErrorPopUp(PopUpsErrorsText.GET.HEADING, PopUpsErrorsText.GET.BUTTON);
  },
  'GET',
);
