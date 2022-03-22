import {createUsersPosts} from './data.js';
import {renderMiniPosts} from './picture.js';
import './user-form.js';

const usersPosts = createUsersPosts(25);
renderMiniPosts(usersPosts);
