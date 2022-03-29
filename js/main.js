import {renderMiniPosts} from './picture.js';
import {setUserFormSubmit} from './user-form.js';
import {closeUserPhotoUpload} from './user-form.js';
import {getData} from './api.js';

getData((data) => {
  renderMiniPosts(data);
});

setUserFormSubmit(closeUserPhotoUpload);
