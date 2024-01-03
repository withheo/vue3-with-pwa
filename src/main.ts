
import '@/scss/index.scss';
import { createApp } from 'vue'

import App from './App.vue'
import OneSinal from './OneSignal.vue';
import I18n from '@/lang';

import OneSignalVuePlugin from '@onesignal/onesignal-vue3'

// const app = createApp(App);
const app = createApp(OneSinal);
app.use(I18n);
app.use(OneSignalVuePlugin,{
  // appId: "c9aeceb5-0db3-4f92-b9e6-3e6a449b3db3",
  appId: "c9aeceb5-0db3-4f92-b9e6-3e6a449b3db3",
});
app.mount('#app')
