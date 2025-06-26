import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import LoginForm from '../views/LoginForm.vue';
import RegisterForm from '../views/RegisterForm.vue';
import ProfilePage from '../views/ProfilePage.vue';
import { checkAuthStatus } from '../services/authService';
import AdminDashboard from '../views/AdminDashboard.vue';
import ManagementUser from '../views/ManagementUser.vue';
import ManagementCategory from '../views/ManagementCategory.vue';
import ManagementActivities from '../views/ManagementActivities.vue';
import EditActivity from '../views/EditActivity.vue';

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
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: ManagementUser,
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    component: ManagementCategory,
  },
  {
    path: '/admin/activities',
    name: 'AdminActivities',
    component: ManagementActivities,
  },
  {
    path: '/admin/activities/edit/:id',
    name: 'EditActivity',
    component: EditActivity,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
