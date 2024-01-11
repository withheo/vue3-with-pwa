import { 
  createWebHistory, 
  createRouter,
  RouteRecordRaw
} from "vue-router";

import FcmPage from '@/Fcm.vue';
import DocPage from '@/Docs.vue';

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: '',
    component: FcmPage,
  },
  {
    path: "/install-docs",
    name: "docs Page",
    component: DocPage,
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;