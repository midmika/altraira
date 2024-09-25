import * as Vue from 'vue';
import { initClientEmitter } from './store/__emitter.ts';

import 'vue3-json-viewer/dist/index.css';

import App from './App.vue';
import './index.scss';
import type { Pinia } from 'pinia';
import { createPinia } from 'pinia';

const pinia: Pinia = createPinia();

Vue.createApp(App).use(pinia).mount('#app');
initClientEmitter();
