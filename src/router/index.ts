import { 
  createWebHistory, 
  createRouter,
  RouteRecordRaw
} from "vue-router";

import FcmPage from '@/Fcm.vue';
import DocPage from '@/Docs.vue';
import RecordSample01  from '@/RecordSample01.vue';
import RecordSample02 from '@/RecordSample02.vue';
import RouterPage from '@/RouterPage.vue';

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
    path: "/audioSample1",
    component: RecordSample01,
  },
  { 
    path: "/audioSample2",
    component: RecordSample02,
  },
  {
    path: '/:NotFound(.*)',
    component: RouterPage
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;