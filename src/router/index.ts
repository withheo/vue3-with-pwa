import { 
  createWebHistory, 
  createRouter,
  RouteRecordRaw
} from "vue-router";

import FcmPage from '@/Fcm.vue';
import DocPage from '@/Docs.vue';
import RecordSample01  from '@/RecordSample01.vue';
import RecordSample02 from '@/RecordSample02.vue';
import RecordSample03 from '@/RecordSample03.vue';
import RecordSample04 from '@/RecordSample04.vue';
import RecordSample05 from '@/RecordSample05.vue';
import RouterPage from '@/RouterPage.vue';
import Streaming01 from '@/Streaming01.vue';
import Streaming02 from '@/Streaming02.vue';
import Streaming03 from '@/Streaming03.vue';
import Streaming04 from '@/Streaming04.vue';
import Streaming05 from '@/Streaming05.vue';
import Streaming06 from '@/Streaming06.vue';
import Streaming07 from '@/Streaming07.vue';

const routes: RouteRecordRaw[] = [
  { 
    path: "/",    
    component: RouterPage,
  },
  {
    path: '/fcm',
    component: FcmPage,
  },
  {
    path: "/record",
    component: FcmPage,
  },
  {
    path: "/install-docs",
    component: DocPage,
  },
  {
    path: "/streaming1",
    component: Streaming01,
  },
  {
    path: "/streaming2",
    component: Streaming02,
  },
  {
    path: "/streaming3",
    component: Streaming03,
  },
  {
    path: "/streaming4",
    component: Streaming04,
  },
  {
    path: "/streaming5",
    component: Streaming05,
  },
  {
    path: "/streaming6",
    component: Streaming06,
  },
  {
    path: "/streaming7",
    component: Streaming07,
  },
  { 
    path: "/audioSample1",
    component: RecordSample01,
  },
  { 
    path: "/audioSample2",
    component: RecordSample02,
  },
  {
    path: '/audioSample3',
    component: RecordSample03,
  },
  { 
    path: "/audioSample4",
    component: RecordSample04,
  },
  {
    path: '/audioSample5',
    component: RecordSample05,
  },
  {
    path: '/:NotFound(.*)',
    component: RouterPage
  }, 
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;