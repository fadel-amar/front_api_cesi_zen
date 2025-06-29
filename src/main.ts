import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';

import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faEye,
  faEyeSlash,
  faCheckCircle,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'quill/dist/quill.snow.css';

import 'emoji-picker-element';

config.autoAddCss = false;

library.add(faEye, faEyeSlash, faCheckCircle, faRightFromBracket);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router).mount('#app');
