
import '@/scss/index.scss';
import { createApp } from 'vue'

import App from './App.vue'
import I18n from '@/lang';

const app = createApp(App);
app.use(I18n);
app.mount('#app')
