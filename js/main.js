import {createUsersPosts} from './data.js';
import {renderMiniPosts} from './picture.js';

const usersPosts = createUsersPosts(25);
renderMiniPosts(usersPosts);

import './user-form.js';
