import { createApp } from 'vue';
import { dialogs, notifications, vueBus } from './ui3n-plugins';
import Ui3nHtml from './directives/ui3n-html';
import './assets/styles/icons.css';
import './assets/styles/variables.css';
import './assets/styles/style.css';

import App from './App.vue';

createApp(App)
  .use(dialogs)
  .use(notifications)
  .use(vueBus)
  .directive('ui3n-html', Ui3nHtml)
  .mount('#ui-3n-lib');
