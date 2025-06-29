import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import LoginForm from '../views/LoginForm.vue';
import RegisterForm from '../views/RegisterForm.vue';
import ProfilePage from '../views/ProfilePage.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import ManagementUser from '../views/ManagementUser.vue';
import ManagementCategory from '../views/ManagementCategory.vue';
import ManagementActivities from '../views/ManagementActivities.vue';
import ManagementPage from '../views/ManagementPage.vue';
import CreatePage from '../views/CreatePage.vue';
import EditPage from '../views/EditPage.vue';
import { checkAuthStatus } from '../services/AuthService';
import Activities from '../views/Activities.vue';
import Activity from '../views/Activity.vue';
import Pages from '../views/Pages.vue';
import Page from '../views/Page.vue';
import NotFound from '../views/NotFound.vue';

const adminGuard = async (_: any, __: any, next: any) => {
  const { isLoggedIn, role } = await checkAuthStatus();
  if (isLoggedIn && role === 'Admin') {
    next();
  } else {
    next('/profile');
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    beforeEnter: async (_, __, next) => {
      const { isLoggedIn } = await checkAuthStatus();
      if (isLoggedIn) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterForm,
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    beforeEnter: adminGuard,
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: ManagementUser,
    beforeEnter: adminGuard,
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    component: ManagementCategory,
    beforeEnter: adminGuard,
  },
  {
    path: '/admin/activities',
    name: 'AdminActivities',
    component: ManagementActivities,
    beforeEnter: adminGuard,
  },
  {
    path: '/admin/activities/edit/:id',
    name: 'EditActivity',
    component: import('../views/EditActivity.vue'),
    beforeEnter: adminGuard,
  },
  {
    path: '/admin/pages',
    name: 'AdminPages',
    component: ManagementPage,
    beforeEnter: adminGuard,
  },
  {
    path: '/admin/pages/create',
    name: 'CreatePage',
    component: CreatePage,
    beforeEnter: adminGuard,
  },
  {
    path: '/admin/pages/edit/:id',
    name: 'EditPage',
    component: EditPage,
    beforeEnter: adminGuard,
  },
  {
    path: '/activities',
    name: 'Activities',
    component: Activities,
  },
  {
    path: '/activities/:id',
    name: 'ActivityDetails',
    component: Activity,
  },
  {
    path: '/pages',
    name: 'Pages',
    component: Pages,
  },
  {
    path: '/pages/:id',
    name: 'PageDetails',
    component: Page,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
