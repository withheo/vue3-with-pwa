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