
import '@/scss/index.scss';
import { createApp } from 'vue'
import Router from '@/router';

import App from './App.vue'
// import Fcm from './Fcm.vue';
//import OneSinal from './OneSignal.vue';
// import FingerApp from './Finger.vue';
import I18n from '@/lang';

//import OneSignalVuePlugin from '@onesignal/onesignal-vue3'

 const app = createApp(App);
//const app = createApp(OneSinal);
app.use(I18n);
app.use(Router);
// app.use(OneSignalVuePlugin,{
//   // appId: "c9aeceb5-0db3-4f92-b9e6-3e6a449b3db3",
//   appId: "eb4e2742-0bbd-41d8-a662-b9e600deec8f",
//   allowLocalhostAsSecureOrigin: true,
//   // serviceWorkerPath: "OneSignalSDKWorker.js",
// });

app.mount('#app')
