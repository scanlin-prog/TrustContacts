import { createApp } from 'vue';

import { router } from '@app/router';
import { store } from '@app/store';

import App from '@app/App.vue';

const application = createApp(App).use(router).use(store);

export default application;
