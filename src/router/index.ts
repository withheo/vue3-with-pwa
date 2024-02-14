import { 
  createWebHistory, 
  createRouter,
  RouteRecordRaw
} from "vue-router";

import FcmPage from '@/Fcm.vue';
import DocPage from '@/Docs.vue';
import RecordPage  from '@/RecordPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: "/record",
    name: '',
    component: FcmPage,
  },
  {
    path: "/install-docs",
    name: "docs Page",
    component: DocPage,
  },
  { 
    path: "/",
    name: 'voice Record Page',
    component: RecordPage,
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;