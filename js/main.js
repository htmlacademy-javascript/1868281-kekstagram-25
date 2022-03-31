import {renderMiniPosts} from './picture.js';
import './user-form.js';
import {getData} from './api.js';

getData((data) => {
  renderMiniPosts(data);
});
